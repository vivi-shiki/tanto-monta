# Tanto Monta 核心数据实现方案

本文档记录当前核心数据对象的设计方向，以及已经落到 `data.js` / `rules.js` 的初始结构。原则是组合优于继承：实体之间用 id、数组和映射关系组合，不让某个对象长期拥有另一类对象的完整副本。

## 1. 设计原则

- 静态定义放在 `data.js`：玩家席位、势力、卡牌、原子行动、地区、单位、事件、初始部署。
- 动态状态放在 `rules.js` 生成的 `G`：玩家控制哪些势力、势力关系、势力已有事件、手牌/牌库、地区控制、单位位置、当前临时编队。
- 关系用索引和 id 表达。例如单位不嵌入地区，单位位置由 `G.location[unit] = region` 表达。
- 不长期保存可从其他字段推导出的集合。例如“某地区有哪些单位”由扫描 `G.location` 得出。
- 编队是临时概念，只在移动/战斗等原子行动中创建，结算后随 `L` 状态消失。

## 2. 玩家 Player

玩家在这里指游戏席位，不等同于真实用户账号。真实用户与 seat 的绑定由 RTT server 的 players 表负责。

静态结构：

```js
data.players = [
  { id: 0, name: "France Player", role: "France", powers: [FRANCE] },
  { id: 1, name: "Spain Player", role: "Spain", powers: [SPAIN] },
  { id: 2, name: "Portugal Player", role: "Portugal", powers: [PORTUGAL] },
  { id: 3, name: "Muslim Player", role: "Muslim", powers: [MUSLIM] },
]
```

动态结构：

```js
G.players = data.players.map(p => ({
  powers: p.powers.slice(),
}))
G.power_player = data.power_to_player.slice()
```

玩家手牌暂时不复制到 `G.players` 里，避免和现有 `G.hand[power]` 产生两份真相。当前 view 用 `player_hand_size` 按玩家控制的势力组合计算手牌数量。后续如果要支持“同一玩家手牌跨多个势力合并”，应新增 helper 从 `G.players[player].powers` 聚合 `G.hand[power]`。

## 3. 势力 Power

势力是规则主体，当前四个势力为 France、Spain、Portugal、Muslim。

静态结构：

```js
data.powers = [
  { id: FRANCE, name: "France", role: "France", class_name: "france" },
  { id: SPAIN, name: "Spain", role: "Spain", class_name: "spain" },
  { id: PORTUGAL, name: "Portugal", role: "Portugal", class_name: "portugal" },
  { id: MUSLIM, name: "Muslim", role: "Muslim", class_name: "muslim" },
]
```

动态关系：

```js
G.control[region] = power
G.power_events[power] = ["event_id"]
G.relations[power_a][power_b] = relation
```

关系值：

```js
data.RELATION_WAR = -1
data.RELATION_NEUTRAL = 0
data.RELATION_ALLIANCE = 1
data.RELATION_SELF = 2
```

这让“势力控制地区”“势力拥有事件 buff”“势力之间结盟/交战”都成为独立状态切片，互不嵌套。

## 4. 卡牌 Card

卡牌是静态规则资源，动态归属由牌库/手牌/弃牌数组保存。

当前结构：

```js
data.cards[card_id] = {
  id,
  name,
  ops,
  power,
  event,
  remove,
  type,
  actions,
  image,
  text,
}
```

补齐后的默认值：

- `type`: 默认 `data.CARD_EVENT`。
- `actions`: 默认 `[data.ACTION_PLAY_CARD_OPS, data.ACTION_PLAY_EVENT]`。
- `image`: 默认 `event_XX`。
- `text`: 默认卡牌名。

动态卡牌区仍沿用当前实现：

```js
G.deck = []
G.discard = []
G.removed = []
G.hand[power] = []
```

后续实现事件牌时，不要把事件逻辑写死在卡牌对象里。建议卡牌只引用 `event` 或 `actions`，由 `rules.js` 的事件处理表解释。

## 5. 原子行动 Atomic Action

原子行动是卡牌、阶段或状态机可以调用的最小行为能力。静态定义放在 `data.atomic_actions`，真实合法性仍由 `rules.js` 的 `prompt()` 根据当前 state 生成。

当前初始原子行动：

- `play_card_ops`: 打牌获得 OP。
- `play_event`: 执行卡牌事件。
- `pass`: pass 当前 impulse。
- `recruit_unit`: 招募单位。
- `move_formation`: 移动临时编队。
- `field_battle`: 野战。
- `siege`: 围城。
- `build_fortress`: 建造/强化要塞。
- `naval_move`: 海军移动。
- `explore`: 探索。
- `diplomacy`: 改变势力关系。

示例结构：

```js
{
  id: data.ACTION_RECRUIT_UNIT,
  name: "Recruit Unit",
  common: true,
  scope: "power",
  description: "...",
  costs: { [MILITIA]: 1, [REGULAR]: 2, [CAVALRY]: 3 },
}
```

## 6. 地区 Region

地区是地图节点。静态结构继续使用当前 `data.regions` 和 `data.adjacency`：

```js
data.regions[region_id] = {
  id,
  name,
  type,
  homeland,
  is_port,
  vp,
  x,
  y,
}
```

动态归属和内容：

```js
G.control[region] = power
G.location[unit] = region
G.commander_location[commander] = region
```

不在 `region` 对象上存单位数组。需要某地区的单位时，通过 `units_in_region(region)`、`own_units_in_region(region)` 等 helper 从 `G.location` 推导。

## 7. 编队 Formation

编队不是长期实体，而是某次原子行动的临时选择。当前已在移动起点选择时创建：

```js
L.formation = {
  power: R,
  region,
  units: [unit_id],
  commanders: [commander_id],
}
```

`move_to` 使用 `L.formation.units` 和 `L.formation.commanders` 结算移动。状态 `select_move_to` 结束后，`L.formation` 随状态栈被替换或弹出，不进入长期 `G`。

后续战斗也可以复用同一思路：在攻击选择阶段创建 `L.formation` 或 `G.attack.formations`，只保存当前战斗需要的临时编组。

## 8. 单位 Unit

单位是静态棋子定义，动态位置保存在 `G.location`。

当前结构：

```js
data.units[unit_id] = {
  id,
  type,
  kind,
  power,
  name,
  strength,
  quantity,
  image,
}
```

补齐后的默认值：

- `kind`: 默认等于 `type`。
- `quantity`: 默认 1。

动态状态：

```js
G.location[unit] = region | data.AVAILABLE | data.ELIMINATED
G.reduced[unit] = boolean
```

## 9. 事件 Event

事件在这里指已经附着在某势力或地区上的 buff/status，不是卡牌本身。

静态结构：

```js
data.events = [
  {
    id: "alhambra",
    name: "Alhambra",
    scope: data.EVENT_SCOPE_POWER,
    description: "...",
    effects: [],
  },
]
```

动态结构：

```js
G.power_events[power] = ["alhambra"]
```

后续如果出现地区事件，可增加：

```js
G.region_events[region] = ["morisco_uprising"]
```

目前先只落地了 `G.power_events`，因为你的描述明确提到“势力已经拥有了 n 个事件 buff”。

## 10. 当前查漏补缺结果

已经补上的初始结构：

- `data.players`：玩家席位与可控势力。
- `data.powers` / `data.power_to_player`：势力定义与默认玩家归属。
- `data.atomic_actions`：原子行动清单。
- `data.events`：事件 buff 清单的初始占位。
- 卡牌默认 `type/actions/image/text`。
- 单位默认 `kind/quantity`。
- `G.players` / `G.power_player`：动态玩家到势力关系。
- `G.power_events`：动态势力 buff。
- `G.relations`：动态势力外交关系矩阵。
- `L.formation`：移动时临时编队。
- `view.player_hand_size`：按玩家控制势力组合出来的手牌数量。

仍待后续实现：

- 卡牌事件执行器，把 `card.event` 转为修改 `G.power_events`、`G.relations`、地图控制或单位状态的逻辑。
- 地区事件 `G.region_events`。
- 多势力同玩家控制时的合并手牌/行动权限策略。
- 战斗/围城中的临时编队结构。
- 关系矩阵对合法行动的影响，例如盟友可否同区、战争是否允许攻击。
- 原子行动到具体 `rules.js` state handler 的统一调度层。
