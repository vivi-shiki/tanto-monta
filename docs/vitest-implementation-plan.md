# Tanto Monta 规则概要与 Vitest 实现思路

本文档用于先写自然语言测试用例，再让 AI 或开发者把它们转成真实 Vitest 测试。内容结合了用户提供的规则概要、Paths of Glory 的卡牌驱动状态机模式，以及当前 `public/tanto-monta/rules.js` 的 MVP 实现。

## 1. 规则主干概要

Tanto Monta 可以先抽象为：

```text
卡牌驱动 + 多势力 + 区域控制 + 回合制策略游戏
```

主循环：

```text
最多 7 个回合
  1. 抽牌阶段 Card Draw
  2. 外交阶段 Diplomacy
  3. 春季阶段 Spring
  4. 行动阶段 Action Loop
  5. 冬季阶段 Winter
  6. 胜利检测 Victory Check
```

行动阶段的核心：

```text
当前玩家执行一次 impulse
  打 1 张牌
  选择按事件使用或按行动点 CP/OP 使用
  执行动作
  切到下一个玩家
直到阶段结束条件满足
```

玩家顺序按规则概要为：

```text
Muslim -> Portugal -> Spain -> France
```

当前代码中的 `ROLES` 是：

```js
["France", "Spain", "Portugal", "Muslim"]
```

且当前行动循环按角色索引从 France 开始。后续要与规则概要对齐时，需要显式定义行动顺序，例如 `[R_MUSLIM, R_PORTUGAL, R_SPAIN, R_FRANCE]`，不要依赖 `ROLES` 数组顺序。

核心动作类型可先分层实现：

- MVP 已有/接近已有：打牌为 OP、招募、移动、pass、VP 计算。
- 下一阶段：野战、区域控制改变、围城。
- 再后续：外交、海军行动、探索、响应/战斗牌、强制事件、复杂特殊事件。

胜利先保留：

- VP 胜利。
- 自动胜利，例如控制全部关键城市或达到 VP 阈值。
- 军事/投降胜利可先依赖 RTT 的 resign/finish 入口。

## 2. Vitest 测试范围建议

当前根项目没有 Vitest 依赖，也没有现成测试脚本。建议先在 `public/tanto-monta` 内部单独建立测试层，避免影响 server 根项目：

```text
public/tanto-monta/
  package.json
  vitest.config.js
  test/
    helpers.js
    data-model.test.js
    setup.test.js
    action-loop.test.js
    recruit.test.js
    movement.test.js
    diplomacy.test.js
    event-buffs.test.js
    victory.test.js
```

如果决定复用根项目依赖，则需要在根 `package.json` 增加 `vitest` devDependency 和 test script。但从当前仓库结构看，`paths-of-glory` 和 `tanto-monta` 都是 `public/` 下的独立 Git 目录，更适合先在 Tanto Monta 子项目里做测试配置。

测试对象优先是 `rules.js` 的公开 API：

```js
const rules = require("../rules.js")

let state = rules.setup(seed, "Standard", {})
let view = rules.view(state, "France")
state = rules.action(state, "France", "play_card", cardId)
```

这样测试会模拟 RTT server 的调用方式，而不是绕到内部函数。只有当公开 API 很难覆盖某个纯计算规则时，才考虑把纯函数从 `rules.js` 中导出到测试专用入口。

## 3. 测试辅助函数设计

建议先做一个 `test/helpers.js`：

```js
const rules = require("../rules.js")

function setup(options = {}) {
  return rules.setup(12345, "Standard", options)
}

function view(state, role) {
  return rules.view(state, role)
}

function act(state, role, action, arg) {
  return rules.action(state, role, action, arg)
}

function expectAction(view, action, arg) {
  // 若 arg 省略，断言 view.actions[action] 存在且启用。
  // 若 arg 提供，断言 view.actions[action] 数组包含 arg。
}
```

后续可以加更高层 helper：

- `playFirstCardAsOps(state, role)`：取当前 view.hand[0]，执行 `play_card`。
- `passUntilRole(state, role)`：持续按合法 `pass`，直到指定角色 active。
- `finishCurrentImpulse(state, role)`：如果有 `end_impulse` 就执行。
- `stateAtPlayerImpulse(role)`：构造或推进到某角色的 `player_impulse`。
- `forceHand(state, role, cards)`：直接设置手牌用于稳定测试，注意这属于测试夹具，不要模拟真实规则。

优先测试公开行为；直接改 state 只用于建立复杂局面，且测试名称里要写清楚“given a prepared state”。

## 4. 自然语言测试用例草案

### A. 核心静态数据模型

1. `data.players` 应定义四个玩家席位，每个席位拥有 `id`、`role` 和至少一个 `powers`。
2. `data.powers` 应定义四个势力，每个势力拥有稳定的 `id`、`name`、`role` 和 `class_name`。
3. `data.power_to_player` 应把每个势力映射到一个默认玩家席位。
4. `data.atomic_actions` 应包含 `play_card_ops`、`play_event`、`pass`、`recruit_unit`、`move_formation`、`field_battle`、`siege`、`naval_move`、`explore`、`diplomacy`。
5. `data.regions.length` 应等于 `hex.json.length`，当前为 213。
6. 每个 `data.regions[i].hex_id` 应等于 `hex.json[i].id`。
7. 每个 `data.adjacency[i]` 应等于 `hex.json[i].connections` 映射成的 region index 列表。
8. `data.sea_connections` 应只包含最终 `data.regions` 中双方都标记 `is_port` 的邻接节点；当前以 `hex.json` 连接为底，再叠加旧 MVP 地区语义后为 23 条。
9. 每张普通卡牌都应有 `type`、`actions`、`image` 和 `text` 字段。
10. 每张普通卡牌的 `actions` 至少应包含 `play_card_ops`；后续有事件文本的卡牌还应能包含 `play_event`。
11. 每个单位都应有 `type`、`kind`、`power`、`quantity`、`strength` 和 `image`。
12. `data.events` 应定义事件 buff 的 `id`、`name`、`scope`、`description` 和 `effects`。
13. 外交关系常量应包括 war、neutral、alliance、self，并且数值能用于关系矩阵。

### B. 模组契约与 setup

1. 当调用 `rules.setup(12345, "Standard", {})` 时，应返回一个可 JSON 序列化的 state，包含 `active`、`seed`、`log`、`undo`、`turn`、`vp`、`location`、`control`、`deck`、`discard`、`hand`、`L`。
2. setup 后 `active` 应是 `rules.roles` 中的合法角色名，或后续按规则修正为行动顺序的首位角色。
3. setup 后所有玩家手牌数量应等于场景 `hand_size`：France 5、Spain 5、Portugal 4、Muslim 5。
4. setup 后 deck 数量应等于 64 减去已发手牌总数，discard 应为空。
5. setup 后初始部署应与 `data.scenarios.Standard.deployment` 一致，初始控制应与 `data.scenarios.Standard.control` 一致。
6. 同一个 seed 重复 setup 应得到相同的 deck 顺序、手牌和初始状态；不同 seed 可以得到不同 deck 顺序。
7. setup 后 `G.players` 应复制 `data.players[].powers`，但不应复制完整卡牌对象。
8. setup 后 `G.power_player` 应等于 `data.power_to_player`。
9. setup 后 `G.power_events` 应为每个势力提供一个空数组。
10. setup 后 `G.relations` 应是四乘四矩阵，对角线为 `RELATION_SELF`，非对角线默认 `RELATION_NEUTRAL`。

### C. view 与隐藏信息

1. 当前 active 角色调用 `view()` 时，应包含 `actions`，且 prompt 表示可以打牌或 pass。
2. 非 active 角色调用 `view()` 时，不应包含可执行 `actions`，prompt 应是等待当前 active 角色行动。
3. 当前角色的 `view.hand` 应显示自己的手牌。
4. 非当前角色的 `view.hand` 不应暴露 active 角色手牌。当前代码会按传入 role 返回该 role 自己的手牌；后续如果要隐藏观察者信息，应为 Observer 添加专门断言。
5. `view.hand_size` 可以显示每个玩家手牌数量，但不能泄露具体卡牌。
6. 游戏结束后 `view()` 应返回结束提示，且不再给任何角色可执行动作。
7. `view.players`、`view.power_player`、`view.power_events`、`view.relations` 应暴露给客户端用于渲染和调试。
8. `view.player_hand_size` 应按玩家控制的所有势力手牌数量聚合计算。

### D. 行动循环

1. 在行动阶段且当前玩家没有 OP 时，合法动作应包括该玩家手牌中的 `play_card` 和 `pass`。
2. 当前玩家执行 `pass` 后，应记录日志，清空 `G.ops`，并切到下一名未 pass 玩家。
3. 如果所有玩家都 pass，行动阶段应结束并进入后续阶段。
4. 如果采用“连续 pass”规则，任意玩家执行非 pass 行动后，连续 pass 计数应重置；这是当前代码与规则概要可能不一致的待实现点。
5. 行动顺序应按规则概要为 Muslim、Portugal、Spain、France；如果暂时沿用当前代码顺序，应把测试标为当前实现测试，并另建一条 pending 测试描述规则目标。
6. active 变化后 undo 栈应被清空。

### E. 打牌作为 OP

1. 当前玩家打出手牌中的一张牌后，该牌应从 `G.hand[player]` 移除，加入 `G.discard`。
2. `G.ops` 应等于 `data.cards[cardId].ops`。
3. 日志应记录玩家打出卡牌和获得 OP 的信息。
4. 打出不在当前玩家手牌中的牌不应改变手牌、discard 或 OP；后续建议把当前“静默不变”改成显式错误或只通过 view.actions 防止。
5. 当前玩家有 OP 时，view 应显示可消耗 OP 的动作，例如 recruit 和 move，并显示 `end_impulse`。
6. 使用卡牌作为 OP 时，不应修改 `G.power_events`，除非后续明确实现“同时触发事件”的卡牌。

### F. 招募

1. 当前玩家有至少 1 OP，且在自己控制且未满堆叠的区域，应可招募 militia。
2. 当前玩家有至少 2 OP，应可招募 regular；有至少 3 OP，应可招募 cavalry。
3. 招募后，被招募单位应从 AVAILABLE 移到目标区域。
4. 招募后 `G.ops` 应按单位类型扣减：militia 1、regular 2、cavalry 3。
5. 招募后日志应记录玩家、单位和区域。
6. 当目标区域不是当前玩家控制时，不应出现 recruit action。
7. 当目标区域达到堆叠上限时，不应出现 recruit action。
8. 当对应类型没有 available 单位时，不应出现对应 recruit action。

### G. 移动与临时编队

1. 当前玩家有 OP 且某区域有己方单位时，该区域应出现在 `select_move_from` 合法动作里。
2. 选择移动起点后，应创建临时 `L.formation`，其中包含 `power`、`region`、`units` 和 `commanders`。
3. `L.formation.units` 应只包含起点区域内属于当前势力、且本次移动允许带走的单位。
4. 选择移动起点后，应进入 `select_move_to` 状态，prompt 要求选择目的地。
5. `select_move_to` 只应列出邻接区域，不应列出非邻接区域。
6. 执行 `move_to` 后，`L.formation.units` 应移动到目的地，`L.formation.commanders` 也应随同移动。
7. 移动后 `G.ops` 应减少 1，并返回 `player_impulse`。
8. 移动结算后，编队不应成为长期 `G` 状态。
9. `cancel` 移动应撤销之前的 `select_move_from` 产生的 undo 快照，并回到原 impulse 局面。
10. 后续新增战斗前，移动进入敌方单位区域的规则应单独测试：是否允许进入、是否触发野战、是否阻止继续移动。

### H. 势力关系与事件 buff

1. 给定 prepared state，当 `G.relations[France][Spain]` 设置为 alliance 时，反向关系也应同步为 alliance；如果当前尚未实现 helper，应写成 `test.todo`。
2. 给定 prepared state，当 `G.relations[Spain][Muslim]` 设置为 war 时，攻击/战斗 action 才应允许生成；当前尚未实现战斗时写成 `test.todo`。
3. 给定 prepared state，当某卡牌事件添加 `"alhambra"` 到 `G.power_events[Spain]` 时，该 buff 应能在 view 中看到。
4. 同一个 power event 不应重复添加两次；如果规则允许叠加，应在事件定义中显式标记 stackable。
5. 使用 OP 打牌不应添加 power event；使用 event 打牌才应添加对应事件。

### I. 控制与 VP

1. `victory_check` 应按 `G.control` 中每个区域的 `data.regions[r].vp` 计算四个势力 VP。
2. 控制 KEY 区域应给更高 VP，STRATEGIC 区域给次级 VP，普通区域给 0。
3. 当某玩家 VP 达到自动胜利阈值时，应 `finish(player, message)`，`state.active` 变为 `"None"`，`state.result` 为赢家角色名。
4. 到达最大回合时，应比较四方 VP，最高者获胜。
5. 若出现 VP 平局，应按正式规则补充 tie-breaker；当前代码默认保留先出现的最高分玩家，这需要被标注为临时行为。

### J. 短局选项

1. 当 setup options 含 `short_game: true` 时，`G.short_game` 应为 true。
2. 短局最大回合应为 5；普通局最大回合应为 7。
3. 当 `G.turn >= 5` 且 `G.short_game` 为 true 时，`victory_check` 应结束游戏。

### K. Undo 与确定性

1. 可撤销动作执行前应产生 undo 快照。
2. 执行 undo 后，state 应回到动作前，包括手牌、discard、ops、位置、日志长度和状态机位置。
3. 当 active 玩家变化时，undo 应被清空。
4. 抽牌/洗牌等随机信息确定后，如果会揭示隐藏信息，应清空 undo 或禁止回退到可利用随机结果的点。
5. replay 关键路径应可用固定 seed 重放同样动作序列得到同样 state。

### L. 未来战斗与围城

这些是规则目标测试，等实现前可以先写成 `test.todo` 或自然语言清单：

1. 当移动或攻击导致双方单位在同一非要塞区域交战时，应进入 field battle 状态。
2. 野战应收集攻击方、防守方、将领修正和战斗牌修正。
3. 战斗掷骰必须使用规则 PRNG，而不是 `Math.random()`。
4. 战斗结果应造成损失，并要求一方撤退或消灭。
5. 攻击要塞区域时应进入 siege 流程，而不是普通野战。
6. 围城成功后应改变区域控制，并更新 VP。

## 5. 从自然语言到 Vitest 的转换格式

建议让 AI 生成测试时使用固定模板：

```text
目标：为 Tanto Monta 的 rules.js 公开 API 编写 Vitest 测试。
约束：
- 使用 CommonJS require 加载 ../rules.js 和 ../data.js。
- 不测试 DOM，不加载 play.js。
- 通过 rules.setup/view/action 模拟 server 调用。
- 每个测试只断言一个明确行为。
- 需要复杂局面时可以直接修改 state，但必须在测试名中写 prepared state。
- 不要依赖随机 deck 的具体顺序，除非 seed 固定且测试目标就是确定性。

请把以下自然语言用例转成 test 文件：
<粘贴用例>
```

## 6. 实施顺序

建议按风险和依赖关系推进：

1. 建立 Vitest 运行配置和 `helpers.js`，先让 setup/view/action 的 smoke tests 通过。
2. 写 setup、view、打牌、pass、招募、移动的当前实现测试。
3. 写若干 `test.todo` 表达规则目标和当前缺口，例如行动顺序、连续 pass、战斗、围城。
4. 每补一条规则，先把对应自然语言用例改成真实测试，再实现规则。
5. 保留 RTT fuzzer 作为补充：Vitest 负责确定性规则断言，fuzzer 负责随机动作下发现死状态和 crash。

## 7. 当前实现需要注意的缺口

- 行动顺序当前是 France、Spain、Portugal、Muslim；规则概要期望 Muslim、Portugal、Spain、France。
- 当前 pass 逻辑是“玩家 pass 后本行动阶段不再行动”，不等同于“所有玩家连续 pass 后结束”。
- `play_card` 目前只按 OP 处理，还没有事件/强制事件/响应/战斗牌分支。
- `diplomacy_phase`、`spring_phase`、`winter_phase`、`marriage_phase` 仍是 stub。
- 战斗、围城、海军、探索、区域占领触发控制变化尚未实现。
- VP 平局 tie-breaker 未按正式规则实现。
- 当前 `view()` 对传入 role 的 hand 直接返回，后续要明确 Observer 和信息隐藏策略。
- 当前 `G.players` 只保存玩家控制的势力，不保存手牌副本；手牌仍以 `G.hand[power]` 为唯一真相。
- 当前 `G.power_events` 和 `G.relations` 已初始化，但还没有事件牌/外交 action 会修改它们。
- 当前地图节点已从 `hex.json` 接入，但 `hex.json` 仍缺真实名称、家园、港口、VP 和地区类型数据；现阶段把旧 MVP 地区语义映射到最接近的 hex 上，相关测试应先覆盖连接一致性和语义覆盖结果，再把完整规则语义作为待补数据。
