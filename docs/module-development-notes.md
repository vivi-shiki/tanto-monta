# RTT 模组开发规律

本文档供后续开发 Tanto Monta 时快速查阅。结论来自当前 server 代码、官方 `docs/overview/module.md` / `docs/module/rules.md`，以及 `public/paths-of-glory` 和当前 `public/tanto-monta` 的实现方式。

## 1. Server 与模组的边界

Rally the Troops server 不是规则引擎本身，它主要做这些事：

- 从数据库 `titles` 表读取 `title_id`，并按 `public/{title_id}/rules.js` 加载规则模块。
- 启动游戏时调用 `RULES[title_id].setup(seed, scenario, options)`，把返回的 JS 对象 JSON 序列化保存到数据库。
- 玩家通过 WebSocket 发动作后，server 取出旧 state，调用 `RULES[title_id].action(state, role, action, args)`，再保存新 state。
- 每次推送客户端状态时，server 按连接角色调用 `RULES[title_id].view(state, role, false)`，只把该角色能看到的数据和合法 actions 发送给前端。
- server 记录 replay、snapshot、active player、result、日志增量、结束状态；但它不理解具体桌游规则。

因此模组开发的核心原则是：`rules.js` 必须把完整规则状态封装在一个可 JSON 序列化的 state 对象里，并通过 `view()` 精确暴露当前玩家可见信息与合法操作。

## 2. 最小模组文件结构

一个可被 server 加载的模组目录通常至少包含：

```text
public/{title_id}/
  title.sql      # 注册 titles 表；title_id 必须等于目录名
  about.html     # 标题页介绍；server 加载规则时同步读取
  create.html    # 建局选项表单；server 加载规则时同步读取
  rules.js       # 服务端规则状态机
  data.js        # 静态规则数据，通常被 rules.js 和 play.js 共享
  play.html      # 客户端页面，引用 /common/client.js 与 play.js
  play.js        # 客户端渲染与 send_action 调用
  play.css       # 客户端样式
```

可选但常见的目录/文件包括图片资源、`info/` 规则资料、生成脚本、`layout.js` 或坐标数据、测试文件和开发文档。

## 3. rules.js 的 API 契约

`rules.js` 必须导出：

```js
exports.roles = ["France", "Spain", "Portugal", "Muslim"]
exports.scenarios = ["Standard"]
exports.setup = function (seed, scenario, options) { return state }
exports.view = function (state, role, is_replay) { return view }
exports.action = function (state, role, action, argument) { return state }
```

常见可选导出：

```js
exports.static_view = function (state) { return static_view }
exports.query = function (state, role, what, params) { return result }
exports.finish = function (state, result, message) { return state }
exports.resign = function (state, role) { return state }
exports.dont_snap = function (state) { return boolean }
```

`state.active` 是 server 最关注的字段之一。它应当是角色名字符串、角色名数组，或结束态 `"None"`。当前 Tanto Monta 的内部框架用数字索引表示角色，入口/出口通过 `_load()` / `_save()` 在字符串与数字之间转换，这是合理做法。

## 4. 状态机模式

PoG 和 Tanto Monta 都遵循“状态生成合法动作，动作推进状态”的模式，但具体实现不同：

- PoG 使用 `states` 对象：`game.state` 存当前状态名，`states[game.state].prompt()` 生成 `view.actions`，`states[game.state][action](arg)` 处理动作。
- Tanto Monta 当前使用 `P` 表 + 脚本 DSL：`G.L.P` 存当前过程/状态名，`P[state].prompt()` 生成动作，`P[state][action](arg)` 处理动作，`script()` 用 `call/goto/end` 串联阶段流程。

共同规律：

- `prompt()` 只读状态并生成 `V.prompt` / `V.actions`，不要修改游戏状态。
- action handler 是原子状态变更入口，通常先 `push_undo()`，再修改 `G`，最后 `call/goto/end` 推进流程。
- `call` 进入子状态并保留返回点；`goto` 替换当前状态；`end` 返回上层状态或脚本。
- 暴露给客户端的 action 名必须与 handler 名一致，例如 `play_card`、`pass`、`move_to`。
- 非当前玩家的 view 不应包含可执行 actions，只给等待提示和可见局面。

## 5. 数据建模规律

PoG 的规模很大，但模式可以直接迁移：

- `data.js` 放静态数据：地图空间、邻接、卡牌、棋子、初始部署、常量。
- `rules.js` 放动态状态和规则判断：位置、控制权、手牌、弃牌、VP、阶段、当前行动点、撤销栈。
- `play.js` 不判断规则合法性，只根据 `view.actions` 高亮并调用 `send_action()`。
- 隐藏信息必须由 `view()` 控制。例如手牌只给当前角色；其他玩家只看到手牌数量。
- 地图控制、棋子位置、卡牌区最好用稳定索引数组表示，便于 JSON 存储、replay 和测试断言。

当前 Tanto Monta 已有的主干状态包括：

- `G.location` / `G.commander_location`：单位与指挥官位置。
- `G.control`：区域控制。
- `G.deck` / `G.discard` / `G.hand`：卡牌状态。
- `G.vp`：各势力 VP。
- `G.ops`：当前 impulse 剩余行动点。
- `G.passed` / `G.impulse`：行动阶段轮转。
- `G.L`：当前状态机栈。

## 6. 回合与行动循环规律

PoG 的卡牌驱动核心可以抽象为：

```text
阶段开始
  当前玩家打牌
  选择事件或行动点
  规则系统生成下一批合法动作
  玩家执行若干动作
  结束 impulse
  切换/推进到下一玩家或下一阶段
```

Tanto Monta 可以继续沿用当前 MVP 主线：

```text
main_game
  card_draw_phase
  diplomacy_phase
  spring_phase
  action_phase
    action_impulse_loop
      player_impulse
  winter_phase
  marriage_phase
  victory_check
```

需要注意当前 `P.action_impulse_loop` 的语义是“找下一个未 pass 的玩家”；这比用户规则概要里的“所有玩家连续 pass 后结束行动阶段”更强。后续如果要严格实现连续 pass，需要把 `G.passed` 改为“本轮连续 pass 计数”或“自上次非 pass 后的 pass 记录”，并在任何非 pass 行动后重置。

## 7. Undo、随机数和 replay

RTT 对 replay 很敏感：

- 不要用 `Math.random()`。使用框架提供的 `random(range)` / `shuffle(list)`，随机种子保存在 `G.seed`。
- 生成随机数或揭示隐藏信息后应 `clear_undo()`，避免玩家通过 undo 探查未来或隐藏信息。
- 每个可撤销的 action handler 开头应 `push_undo()`。
- server 会记录 replay 和 snapshot；`rules.js` 返回的 state 必须能稳定 JSON 序列化。

## 8. 客户端规律

`play.html` 引用 `/common/client.js` 后，模组的 `play.js` 至少实现：

```js
function on_init(scenario, options, static_view) {}
function on_update() {}
```

Tanto Monta 当前已在 `window.on_init` / `window.on_update` 注册回调。客户端开发重点是：

- 使用 `view` 或当前别名 `gameView` 渲染地图、棋子、手牌和提示。
- 点击地图/棋子/卡牌时先检查 `view.actions`，再 `send_action(action, argument)`。
- 顶部按钮用 `action_button()` 或 `action_button_with_argument()`，不要绕过 `view.actions`。
- 客户端可以做高亮和辅助展示，但不能成为规则真相来源。

## 9. 后续开发建议

开发新规则时，优先按以下顺序推进：

1. 在 `data.js` 明确静态实体索引、常量、初始部署和卡牌字段。
2. 在 `rules.js` 为目标流程增加最小状态字段。
3. 在状态 `prompt()` 中生成合法 actions。
4. 在 action handler 中修改 state、记录 log、推进状态机。
5. 在 `view()` 中只暴露客户端需要的数据。
6. 给新增规则写自然语言测试用例，再转成 Vitest 或 RTT fuzzer 目标。

对于大规则，不要一次性实现完整事件库。优先让“卡牌 -> OP -> 移动/招募/战斗 -> 控制/VP -> 回合推进”闭环可测试，再逐步补外交、围城、海军、探索、响应牌和特殊事件。
