# Tanto Monta — 对局数据 (G) 与视图数据 (V) 设计

本文档定义 tanto-monta 模组中 **游戏状态 G**（服务端持久化）和 **视图数据 V**（推送给客户端）的完整数据结构。

---

## 1. 常量定义

```javascript
// 势力 (Power)
const FRANCE = 0
const SPAIN = 1
const PORTUGAL = 2
const MUSLIM = 3

// 单位类型 (Unit Type)
const MILITIA = 0     // 民兵
const REGULAR = 1     // 正规军
const CAVALRY = 2     // 骑兵
const ARTILLERY = 3   // 火炮
const GALLEY = 4      // 桨帆船
const NAO = 5         // 大帆船
const CORSAIR = 6     // 海盗船

// 特殊位置
const ELIMINATED = -1   // 已消灭
const AVAILABLE = -2    // 可征召池

// 区域类型
const NORMAL = 0        // 普通 (0 VP)
const STRATEGIC = 1     // 战略 (1 VP)
const KEY = 2           // 关键 (2-3 VP)
const FORTRESS = 3      // 要塞
const SPECIAL = 4       // 特殊

// 角色名 (服务器使用的字符串形式)
const ROLES = ["France", "Spain", "Portugal", "Muslim"]
```

---

## 2. 游戏状态 G (Game State)

G 是服务器持久化的完整游戏状态，由 `setup()` 创建，通过 `action()` 修改。

```javascript
G = {
    // === 服务器框架必需字段 ===
    active: "France",       // 当前活跃角色 (字符串)，游戏结束时为 "None"
    seed: 12345,            // 确定性随机种子
    log: [],                // 游戏日志 (字符串数组)
    undo: [],               // 撤销栈 (框架管理)
    L: { ... },             // 状态机栈帧 (框架管理)
    result: null,           // 游戏结果 (null | 角色名 | "Draw")

    // === 回合信息 ===
    turn: 1,                // 当前回合 (1-7)
    impulse: 0,             // 当前行动脉冲计数
    ops: 0,                 // 当前玩家剩余行动点

    // === 棋子位置 ===
    // 每个单位的当前位置: region_id | ELIMINATED(-1) | AVAILABLE(-2)
    location: Int8Array(67),         // location[unit_id] = region_id
    // 单位是否处于减员状态
    reduced: Uint8Array(67),         // reduced[unit_id] = 0 | 1

    // 指挥官位置: region_id | AVAILABLE(-2)
    commander_location: Int8Array(14), // commander_location[cmd_id] = region_id

    // === 区域控制 ===
    // 每个区域由谁控制: power_id | -1(无人)
    control: Int8Array(25),           // control[region_id] = power_id

    // === 卡牌系统 ===
    deck: [],               // 公共牌堆 (card_id 数组, 1-64)
    discard: [],             // 弃牌堆
    removed: [],             // 永久移除的卡牌

    // 每个势力的手牌
    hand: [
        [3, 7, 12, ...],   // France 手牌 (card_id 数组)
        [1, 5, 9, ...],    // Spain 手牌
        [2, 8, ...],       // Portugal 手牌
        [4, 6, 11, ...],   // Muslim 手牌
    ],
    hand_size: [5, 5, 4, 5], // 每个势力的手牌上限

    // === 胜利点 ===
    vp: [0, 0, 0, 0],       // 各势力当前 VP

    // === 行动阶段状态 ===
    passed: [false, false, false, false], // 各势力是否已 pass

    // === 游戏选项 ===
    short_game: false,       // 短局 (5 回合) / 标准 (7 回合)

    // === 外交状态 (未来扩展) ===
    // alliances: [],        // 联盟关系
    // war_status: [],       // 战争状态

    // === 战斗状态 (未来扩展) ===
    // battle: null,         // 当前战斗上下文
    // siege: null,          // 当前围城上下文

    // === 事件标记 (未来扩展) ===
    // events: {},           // 已触发的永久事件
}
```

### 2.1 数据类型说明

| 字段 | 类型 | 大小 | 说明 |
|------|------|------|------|
| `location` | 数组 | 67 | 对应 data.units 的 67 个单位 |
| `reduced` | 数组 | 67 | 0=满编, 1=减员 |
| `commander_location` | 数组 | 14 | 对应 data.commanders 的 14 个指挥官 |
| `control` | 数组 | 25 | 对应 data.regions 的 25 个区域 |
| `hand` | 二维数组 | 4×N | 4 个势力各自的手牌 |
| `vp` | 数组 | 4 | 4 个势力的 VP |

### 2.2 状态机栈帧 (L)

框架通过链表管理程序执行栈：

```javascript
L = {
    P: "player_impulse",  // 当前状态/程序名
    I: 0,                 // 脚本指令指针 (脚本式状态才用)
    L: {                  // 父栈帧 (调用链)
        P: "action_impulse_loop",
        I: 0,
        L: { P: "action_phase", ... }
    },
    // 临时局部变量
    move_from: 5,         // 移动来源区域 (select_move_to 状态)
}
```

---

## 3. 视图数据 V (View)

V 是 `view()` 返回给客户端的数据。包含公开信息 + 当前玩家的隐藏信息。

```javascript
V = {
    // === 框架必需 ===
    log: [...],              // 完整游戏日志
    prompt: "出牌或跳过。",    // 当前提示文本
    actions: {               // 可用动作 (仅活跃玩家)
        // 卡牌动作
        play_card: [3, 7, 12], // 可以打出的卡牌 id 列表

        // 征召动作 — 值为可执行此动作的区域 id 列表
        recruit_militia: [8, 11],
        recruit_regular: [8],
        recruit_cavalry: [],

        // 移动动作
        select_move_from: [8, 11, 12],  // 有己方单位的区域
        move_to: [4, 5, 7],             // 相邻可达区域 (移动第二步)

        // 单位选择 (超出堆叠限制时)
        unit: [15, 16, 17],    // 可选的单位 id

        // 指挥官选择
        commander: [4, 5],     // 可选的指挥官 id

        // 按钮
        pass: 1,               // 跳过 (1=可用, 0=不可用)
        end_impulse: 1,        // 结束脉冲
        done: 1,               // 确认
        undo: 1,               // 撤销
    },

    // === 回合信息 ===
    turn: 3,                 // 当前回合
    impulse: 7,              // 当前脉冲序号
    ops: 2,                  // 当前剩余 OP
    power: 0,                // 当前查看者的势力 id

    // === 棋盘状态 (公开) ===
    location: [...],         // 全部单位位置 (67 元素)
    reduced: [...],          // 全部单位减员状态 (67 元素)
    commander_location: [...], // 全部指挥官位置 (14 元素)
    control: [...],          // 区域控制 (25 元素)

    // === 胜利点 (公开) ===
    vp: [5, 8, 3, 6],       // 各势力 VP

    // === 卡牌信息 ===
    hand: [3, 7, 12, 22, 45], // 当前玩家的手牌 (隐藏, 仅本人可见)
    hand_size: [5, 4, 3, 5],  // 各势力手牌数量 (公开)
    deck_size: 38,             // 牌堆剩余数量 (公开)
    discard_size: 12,          // 弃牌堆数量 (公开)

    // === 行动阶段状态 (公开) ===
    passed: [true, false, false, true], // 各势力是否已 pass
}
```

### 3.1 可用动作 (actions) 分类

| 动作名 | 参数类型 | 触发时机 | 说明 |
|--------|----------|---------|------|
| `play_card` | card_id | ops=0 时 | 打出手牌获得 OP |
| `pass` | 无 | ops=0 时 | 跳过本脉冲 |
| `recruit_militia` | region_id | ops≥1 时 | 征召民兵 (1 OP) |
| `recruit_regular` | region_id | ops≥2 时 | 征召正规军 (2 OP) |
| `recruit_cavalry` | region_id | ops≥3 时 | 征召骑兵 (3 OP) |
| `select_move_from` | region_id | ops≥1 时 | 选择移动起点 |
| `move_to` | region_id | 选择起点后 | 选择移动目标 |
| `end_impulse` | 无 | ops>0 时 | 放弃剩余 OP |
| `undo` | 无 | 有撤销历史时 | 撤销上一步 |
| `unit` | unit_id | 选择单位时 | 选取特定单位 |
| `commander` | cmd_id | 选择指挥官时 | 选取指挥官 |
| `done` | 无 | 确认步骤时 | 确认当前选择 |
| `cancel` | 无 | 子状态中 | 取消返回 |

### 3.2 隐藏信息规则

| 数据 | 法国玩家 | 西班牙玩家 | 其他玩家 | 观察者 |
|------|---------|-----------|---------|--------|
| `hand` | 法国手牌 | 西班牙手牌 | 各自手牌 | 空 |
| `hand_size` | 全部可见 | 全部可见 | 全部可见 | 全部可见 |
| `location` | 全部可见 | 全部可见 | 全部可见 | 全部可见 |
| `control` | 全部可见 | 全部可见 | 全部可见 | 全部可见 |
| `deck` | 不可见 | 不可见 | 不可见 | 不可见 |

---

## 4. data.js 静态数据引用

rules.js 通过 `require("./data.js")` 加载以下静态数据：

```javascript
data.power_name = ["France", "Spain", "Portugal", "Muslim"]

data.regions[25] = {
    id, name, type, homeland, is_port, vp, x, y
}

data.adjacency[25] = [
    [connected_region_ids...]
]

data.sea_connections = [
    [port_a, port_b], ...
]

data.units[67] = {
    id, type, power, name, strength: [full, reduced], image
}

data.commanders[14] = {
    id, power, name, command, admin, naval, image
}

data.cards[65] = {  // index 0 为占位符, 1-64 为事件牌
    id, name, ops, power, event, remove
}

data.home_cards[13] = {
    id, name, ops, power
}

data.scenarios["Standard"] = {
    deployment: { unit_id: region_id },
    commanders: { cmd_id: region_id },
    control: { region_id: power_id },
    hand_size: [5, 5, 4, 5],
}

data.recruit_cost = { 0: 1, 1: 2, 2: 3 } // MILITIA, REGULAR, CAVALRY
data.stacking_limit = 4
```

---

## 5. 日志格式约定

规则层使用 ID 占位符，客户端 play.js 通过正则替换为可点击的名称：

```javascript
// 规则层输出:
log("France recruits U17 in R8.")     // U{unit_id}, R{region_id}
log("France moves 3 units from R8 to R4.")
log("France plays C12 for 3 OP.")     // C{card_id}

// play.js 替换:
text.replace(/R(\d+)/g, sub_region_name)  // R8 → "Castille"
text.replace(/U(\d+)/g, sub_unit_name)    // U17 → "SP Mil 1"
text.replace(/C(\d+)/g, sub_card_name)    // C12 → "Event 12"
```

---

## 6. 游戏流程状态机

```
main_game
  └─ for turn 1..7:
       ├── card_draw_phase        (自动: 补牌)
       ├── diplomacy_phase        (turn>1: 外交谈判)
       ├── spring_phase           (春季事件)
       ├── action_phase           (玩家交互)
       │    └── action_impulse_loop
       │         └── player_impulse  ← 主要交互状态
       │              ├── ops=0: play_card / pass
       │              └── ops>0: recruit / move / end_impulse
       │                   └── select_move_to (子状态)
       ├── winter_phase           (冬季维护)
       ├── marriage_phase         (turn≥3: 联姻事件)
       └── victory_check          (VP 检查)
```

### 6.1 player_impulse 状态详解

```
进入 player_impulse:
  ┌─ ops === 0 ?
  │   ├── 显示 play_card 动作 (手牌列表)
  │   └── 显示 pass 按钮
  │
  └─ ops > 0 ?
      ├── 显示 recruit_militia/regular/cavalry (己方控制区域)
      ├── 显示 select_move_from (有己方单位的区域)
      └── 如果 ops 用完，显示 end_impulse

  play_card(card_id):
      弃掉手牌 → ops = card.ops → 留在 player_impulse

  pass():
      标记 passed[power] → ops=0 → end() 回到 impulse_loop

  recruit_X(region):
      放置单位 → ops -= cost → 留在 player_impulse

  select_move_from(region):
      记录 move_from → goto select_move_to

  end_impulse():
      ops=0 → end() 回到 impulse_loop
```

---

## 7. 堆叠规则

```javascript
function stack_capacity(region) {
    // 获取该区域己方指挥官
    var cmds = own_commanders_in_region(region)
    if (cmds.length === 0)
        return data.stacking_limit  // 默认 4

    // 取指挥权最高的 2 位指挥官
    cmds.sort((a, b) => data.commanders[b].command - data.commanders[a].command)
    var top = cmds.slice(0, 2)
    // 容量 = 前两名指挥权之和 + 2
    var cmd_capacity = top.reduce((sum, c) => sum + data.commanders[c].command, 0) + 2
    return Math.max(data.stacking_limit, cmd_capacity)
}
```

示例：2 个指挥官 (Command 3 + Command 2) → 容量 = max(4, 3+2+2) = 7

---

## 8. VP 计算

每回合结束时统计各势力控制区域的 VP：

```javascript
for (var p = 0; p < 4; ++p) {
    G.vp[p] = 0
    for (var r = 0; r < data.regions.length; ++r) {
        if (G.control[r] === p)
            G.vp[p] += data.regions[r].vp
    }
}
```

自动胜利条件：任一势力 VP ≥ 20。
游戏结束时 VP 最高者获胜。

---

## 9. 未来扩展字段预留

以下字段将在后续阶段加入 G 和 V：

### G 扩展
```javascript
// 战斗
G.battle = null | {
    region: region_id,
    attacker: power_id,
    defender: power_id,
    attacker_units: [unit_ids],
    defender_units: [unit_ids],
    round: 1,
    attacker_hits: 0,
    defender_hits: 0,
}

// 围城
G.siege = null | {
    region: region_id,
    besieger: power_id,
    garrison: [unit_ids],
}

// 外交
G.alliances = []          // [power_a, power_b] 联盟对
G.at_war = []             // [power_a, power_b] 交战对

// 事件
G.events = {}             // { event_name: true/false, ... }

// 海军
G.naval_control = []      // 各海域控制
```

### V 扩展
```javascript
V.battle = null | { ... }  // 当前战斗信息 (公开)
V.siege = null | { ... }   // 当前围城信息 (公开)
V.last_card = null | card_id // 最后打出的卡 (公开)
```
