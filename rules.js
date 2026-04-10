"use strict"

const data = require("./data.js")

var G, L, R, V

const P = {}

const ROLES = ["France", "Spain", "Portugal", "Muslim"]
const SCENARIOS = ["Standard"]

// Import constants from data.js
const { FRANCE, SPAIN, PORTUGAL, MUSLIM, MILITIA, REGULAR, CAVALRY, ELIMINATED, AVAILABLE } = data

// Game-specific constants
const R_FRANCE = 0
const R_SPAIN = 1
const R_PORTUGAL = 2
const R_MUSLIM = 3

const MAX_TURNS = 7

// === HELPERS ===

function power_name(p) {
	return data.power_name[p]
}

function region_name(r) {
	return data.regions[r].name
}

function unit_name(u) {
	return data.units[u].name
}

function unit_power(u) {
	return data.units[u].power
}

function unit_type(u) {
	return data.units[u].type
}

function commander_name(c) {
	return data.commanders[c].name
}

function commander_power(c) {
	return data.commanders[c].power
}

function is_adjacent(from, to) {
	return data.adjacency[from].includes(to)
}

function player_power() {
	return R
}

function is_own_unit(u) {
	return unit_power(u) === player_power()
}

function units_in_region(region) {
	var result = []
	for (var u = 0; u < data.units.length; ++u)
		if (G.location[u] === region)
			result.push(u)
	return result
}

function own_units_in_region(region) {
	var result = []
	var power = player_power()
	for (var u = 0; u < data.units.length; ++u)
		if (G.location[u] === region && unit_power(u) === power)
			result.push(u)
	return result
}

function commanders_in_region(region) {
	var result = []
	for (var c = 0; c < data.commanders.length; ++c)
		if (G.commander_location[c] === region)
			result.push(c)
	return result
}

function own_commanders_in_region(region) {
	var result = []
	var power = player_power()
	for (var c = 0; c < data.commanders.length; ++c)
		if (G.commander_location[c] === region && commander_power(c) === power)
			result.push(c)
	return result
}

function count_units_in_region(region, power) {
	var count = 0
	for (var u = 0; u < data.units.length; ++u)
		if (G.location[u] === region && unit_power(u) === power)
			++count
	return count
}

function stack_capacity(region) {
	var cmds = own_commanders_in_region(region)
	if (cmds.length === 0)
		return data.stacking_limit

	// Sort by command rating descending, take top 2
	cmds.sort((a, b) => data.commanders[b].command - data.commanders[a].command)
	var top = cmds.slice(0, 2)
	var cmd_capacity = top.reduce((sum, c) => sum + data.commanders[c].command, 0) + 2
	return Math.max(data.stacking_limit, cmd_capacity)
}

function available_units_of_type(power, type) {
	var result = []
	for (var u = 0; u < data.units.length; ++u)
		if (unit_power(u) === power && unit_type(u) === type && G.location[u] === AVAILABLE)
			result.push(u)
	return result
}

function homeland_regions(power) {
	var result = []
	for (var r = 0; r < data.regions.length; ++r)
		if (data.regions[r].homeland === power)
			result.push(r)
	return result
}

function controlled_regions(power) {
	var result = []
	for (var r = 0; r < data.regions.length; ++r)
		if (G.control[r] === power)
			result.push(r)
	return result
}

function can_recruit_in(region) {
	return G.control[region] === player_power()
}

function current_hand() {
	return G.hand[R]
}

function card_ops(card_id) {
	return data.cards[card_id].ops
}

// === SETUP ===

function on_setup(scenario, options) {
	var scn = data.scenarios[scenario]
	if (!scn)
		scn = data.scenarios["Standard"]

	// Unit locations: default to AVAILABLE
	G.location = new Array(data.units.length).fill(AVAILABLE)
	G.reduced = new Array(data.units.length).fill(false)

	// Commander locations: default to AVAILABLE
	G.commander_location = new Array(data.commanders.length).fill(AVAILABLE)

	// Region control
	G.control = new Array(data.regions.length).fill(-1)

	// Apply scenario deployment
	for (var uid in scn.deployment)
		G.location[Number(uid)] = scn.deployment[uid]

	for (var cid in scn.commanders)
		G.commander_location[Number(cid)] = scn.commanders[cid]

	for (var rid in scn.control)
		G.control[Number(rid)] = scn.control[rid]

	// Cards
	G.deck = []
	G.discard = []
	G.removed = []
	for (var i = 1; i <= 64; ++i)
		G.deck.push(i)
	shuffle(G.deck)

	// Player hands
	G.hand = [[], [], [], []]
	G.hand_size = scn.hand_size.slice()

	// Victory
	G.vp = [0, 0, 0, 0]

	// Turn
	G.turn = 1
	G.ops = 0 // current action points remaining
	G.impulse = 0

	// Options
	G.short_game = options.short_game ? true : false
	var max = G.short_game ? 5 : MAX_TURNS

	G.active = R_FRANCE

	call("main_game")
}

// === GAME FLOW ===

var max_turns = () => G.short_game ? 5 : MAX_TURNS

P.main_game = script(`
	for G.turn in 1 to ${MAX_TURNS} {
		call card_draw_phase
		if (G.turn > 1) {
			call diplomacy_phase
		}
		call spring_phase
		call action_phase
		call winter_phase
		if (G.turn >= 3) {
			call marriage_phase
		}
		call victory_check
	}
	eval { finish("Draw", "The game ends in a draw.") }
`)

// === CARD DRAW PHASE ===

P.card_draw_phase = function () {
	log()
	log("=== Turn " + G.turn + " ===")
	log()
	log("Card Draw Phase")

	// Draw cards for each power
	for (var p = 0; p < 4; ++p) {
		var n = G.hand_size[p] - G.hand[p].length
		for (var i = 0; i < n; ++i) {
			if (G.deck.length === 0) {
				// Reshuffle discard into deck
				G.deck = G.discard.slice()
				G.discard = []
				shuffle(G.deck)
			}
			if (G.deck.length > 0) {
				G.hand[p].push(G.deck.pop())
			}
		}
	}

	end()
}

// === DIPLOMACY PHASE (stub) ===

P.diplomacy_phase = function () {
	log("Diplomacy Phase (not yet implemented)")
	end()
}

// === SPRING PHASE (stub) ===

P.spring_phase = function () {
	log("Spring Headlines Phase (not yet implemented)")
	end()
}

// === ACTION PHASE ===

P.action_phase = script(`
	eval {
		log()
		log("Action Phase")
		G.passed = [false, false, false, false]
		G.impulse = 0
	}
	call action_impulse_loop
`)

P.action_impulse_loop = function () {
	// Find next non-passed player
	var start = G.impulse % 4
	var found = -1
	for (var i = 0; i < 4; ++i) {
		var idx = (start + i) % 4
		if (!G.passed[idx]) {
			found = idx
			break
		}
	}

	if (found === -1) {
		// All passed
		end()
		return
	}

	G.active = found
	G.impulse++
	call("player_impulse")
}

P.player_impulse = {
	inactive: "take their action",
	prompt() {
		if (G.ops > 0) {
			prompt("You have " + G.ops + " OP remaining. Spend them or pass.")
			// Recruit actions
			for (var r = 0; r < data.regions.length; ++r) {
				if (can_recruit_in(r) && count_units_in_region(r, player_power()) < stack_capacity(r)) {
					if (G.ops >= 1 && available_units_of_type(player_power(), MILITIA).length > 0)
						action("recruit_militia", r)
					if (G.ops >= 2 && available_units_of_type(player_power(), REGULAR).length > 0)
						action("recruit_regular", r)
					if (G.ops >= 3 && available_units_of_type(player_power(), CAVALRY).length > 0)
						action("recruit_cavalry", r)
				}
			}
			// Move action
			for (var r = 0; r < data.regions.length; ++r) {
				if (own_units_in_region(r).length > 0)
					action("select_move_from", r)
			}
			button("end_impulse")
		} else {
			prompt("Play a card from your hand or pass.")
			var hand = current_hand()
			for (var i = 0; i < hand.length; ++i)
				action("play_card", hand[i])
			button("pass")
		}
	},

	play_card(c) {
		push_undo()
		var idx = G.hand[R].indexOf(c)
		if (idx >= 0) {
			G.hand[R].splice(idx, 1)
			G.discard.push(c)
			G.ops = card_ops(c)
			log(power_name(R) + " plays C" + c + " for " + G.ops + " OP.")
		}
	},

	pass() {
		log(power_name(R) + " passes.")
		G.passed[R] = true
		G.ops = 0
		end()
	},

	end_impulse() {
		if (G.ops > 0) {
			log(power_name(R) + " ends impulse with " + G.ops + " OP unused.")
		}
		G.ops = 0
		end()
	},

	recruit_militia(region) {
		push_undo()
		do_recruit(region, MILITIA, 1)
	},

	recruit_regular(region) {
		push_undo()
		do_recruit(region, REGULAR, 2)
	},

	recruit_cavalry(region) {
		push_undo()
		do_recruit(region, CAVALRY, 3)
	},

	select_move_from(region) {
		push_undo()
		L.move_from = region
		goto("select_move_to")
	},
}

function do_recruit(region, type, cost) {
	var avail = available_units_of_type(player_power(), type)
	if (avail.length === 0) return
	var u = avail[0]
	G.location[u] = region
	G.ops -= cost
	log(power_name(R) + " recruits U" + u + " in R" + region + ".")
}

// === MOVEMENT ===

P.select_move_to = {
	inactive: "move units",
	prompt() {
		var from = L.move_from
		prompt("Select destination for units from " + region_name(from) + ".")
		for (var to of data.adjacency[from]) {
			action("move_to", to)
		}
		button("cancel")
	},

	move_to(to) {
		var from = L.move_from
		var units = own_units_in_region(from)
		var cap = stack_capacity(from)
		var limit = Math.min(units.length, cap)

		// Move units (up to capacity)
		var moved = 0
		for (var i = 0; i < units.length && moved < limit; ++i) {
			var u = units[i]
			G.location[u] = to
			moved++
		}

		// Also move own commanders
		var cmds = own_commanders_in_region(from)
		for (var c of cmds)
			G.commander_location[c] = to

		G.ops -= 1
		log(power_name(R) + " moves " + moved + " units from R" + from + " to R" + to + ".")
		goto("player_impulse")
	},

	cancel() {
		pop_undo()
	},
}

// === WINTER PHASE (stub) ===

P.winter_phase = function () {
	log()
	log("Winter Phase (not yet implemented)")
	end()
}

// === MARRIAGE PHASE (stub) ===

P.marriage_phase = function () {
	log("Marriage Phase (not yet implemented)")
	end()
}

// === VICTORY CHECK ===

P.victory_check = function () {
	log()
	log("Victory Check")

	// Count VP from controlled regions
	for (var p = 0; p < 4; ++p) {
		G.vp[p] = 0
		for (var r = 0; r < data.regions.length; ++r) {
			if (G.control[r] === p) {
				G.vp[p] += data.regions[r].vp
			}
		}
	}

	log("VP: France=" + G.vp[0] + " Spain=" + G.vp[1] + " Portugal=" + G.vp[2] + " Muslim=" + G.vp[3])

	// Check for automatic victory (20+ VP)
	for (var p = 0; p < 4; ++p) {
		if (G.vp[p] >= 20) {
			finish(p, power_name(p) + " wins with " + G.vp[p] + " VP!")
			return
		}
	}

	// Check for end of game
	var max = G.short_game ? 5 : MAX_TURNS
	if (G.turn >= max) {
		var best = 0
		for (var p = 1; p < 4; ++p)
			if (G.vp[p] > G.vp[best])
				best = p
		finish(best, power_name(best) + " wins with " + G.vp[best] + " VP!")
		return
	}

	end()
}

// === RESUME FROM ACTION IMPULSE ===

P.player_impulse._resume = function () {
	// After returning from sub-state (like movement), go back to impulse loop
	goto("action_impulse_loop")
}

// === FRAMEWORK (copy of public/common/framework.js) ===

function log(s) {
	if (s === undefined) {
		if (G.log.length > 0 && G.log[G.log.length - 1] !== "")
			G.log.push("")
	} else {
		G.log.push(s)
	}
}

function prompt(s) {
	V.prompt = s
}

function button(action, enabled = true) {
	V.actions[action] = !!enabled | 0
}

function action(action, argument) {
	if (!(action in V.actions))
		V.actions[action] = []
	set_add(V.actions[action], argument)
}

function finish(result, message) {
	G.active = -1
	G.result = ROLES[result] ?? result
	G.L = L = { message }
	log()
	log(message)
}

function call_or_goto(pred, name, env) {
	if (pred)
		call(name, env)
	else
		goto(name, env)
}

function call(name, env) {
	G.L = L = { ...env, P: name, I: 0, L: L }
	P[name]?._begin?.()
}

function goto(name, env) {
	P[L.P]?._end?.()
	G.L = L = { ...env, P: name, I: 0, L: L.L }
	P[name]?._begin?.()
}

function end(result) {
	P[L.P]?._end?.()
	G.L = L = L.L
	if (result !== undefined)
		L.$ = result
	P[L.P]?._resume?.()
}

function resume() {
	P[L.P]?._resume?.()
}

exports.roles = ROLES

exports.scenarios = SCENARIOS

exports.setup = function (seed, scenario, options) {
	G = {
		active: null,
		seed,
		log: [],
		undo: [],
	}
	L = null
	R = null
	V = null

	on_setup(scenario, options)
	_run()
	_save()

	return G
}

exports.view = function (state, role) {
	G = state
	L = G.L
	R = role

	// Initialize view object with complete game state
	V = {
		log: G.log,
		prompt: null,
		turn: G.turn,
		vp: G.vp,
		control: G.control,
		location: G.location,
		reduced: G.reduced,
		commander_location: G.commander_location,
		ops: G.ops,
		hand: G.hand[R] || [],
		hand_size: G.hand.map(h => h.length),
		deck_size: G.deck.length,
		discard_size: G.discard.length,
		impulse: G.impulse,
		power: R,
		passed: G.passed,
	}

	if ((Array.isArray(G.active) && G.active.includes(R)) || G.active === R) {
		_load()

		V.actions = {}

		try {
			if (P[L.P])
				P[L.P].prompt()
			else
				V.prompt = "TODO: " + L.P
		} catch (x) {
			console.error(x)
			V.prompt = x.toString()
		}

		if (V.actions.undo === undefined)
			button("undo", G.undo?.length > 0)

		_save()
	} else {
		_load()
		_save()

		if (G.active === "None") {
			V.prompt = L.message
		} else {
			var inactive = P[L.P]?.inactive
			if (inactive) {
				if (Array.isArray(G.active))
					V.prompt = `Waiting for ${G.active.join(" and ")} to ${inactive}.`
				else
					V.prompt = `Waiting for ${G.active} to ${inactive}.`
			} else {
				if (Array.isArray(G.active))
					V.prompt = `Waiting for ${G.active.join(" and ")}.`
				else
					V.prompt = `Waiting for ${G.active}.`
			}
		}
	}

	return V
}

exports.action = function (state, role, action, argument) {
	G = state
	L = G.L
	R = role
	V = null

	var old_active = G.active

	_load()

	var this_state = P[L.P]
	if (this_state && typeof this_state[action] === "function") {
		this_state[action](argument)
		_run()
	} else if (action === "undo" && G.undo.length > 0) {
		pop_undo()
	} else {
		throw new Error("Invalid action: " + action)
	}

	_save()

	if (old_active !== G.active)
		clear_undo()

	return G
}

exports.finish = function (state, result, message) {
	G = state
	L = G.L
	R = null
	V = null

	_load()
	finish(result, message)
	_save()

	return G
}

exports.query = function (state, role, q) {
	G = state
	L = G.L
	R = role
	V = null

	_load()
	var result = null
	_save()

	return result
}

function _load() {
	R = ROLES.indexOf(R)
	if (Array.isArray(G.active))
		G.active = G.active.map(r => ROLES.indexOf(r))
	else
		G.active = ROLES.indexOf(G.active)
}

function _save() {
	if (Array.isArray(G.active))
		G.active = G.active.map(r => ROLES[r])
	else
		G.active = ROLES[G.active] ?? "None"
}

function _run() {
	for (var i = 0; i < 1000 && L; ++i) {
		var prog = P[L.P]
		if (typeof prog === "function") {
			prog()
		} else if (Array.isArray(prog)) {
			if (L.I < prog.length) {
				try {
					prog[L.I++]()
				} catch (err) {
					err.message += "\n\tat P." + L.P + ":" + L.I
					throw err
				}
			} else {
				end()
			}
		} else {
			return
		}
	}
	if (L)
		throw new Error("runaway script")
}

function _parse(text) {
	var prog = []

	function lex(s) {
		var words = []
		var p = 0, n = s.length, m

		function lex_flush() {
			if (words.length > 0) {
				command(words)
				words = []
			}
		}

		function lex_newline() {
			while (p < n && s[p] === "\n")
				++p
			lex_flush()
		}

		function lex_semi() {
			++p
			lex_flush()
		}

		function lex_comment() {
			while (p < n && s[p] !== "\n")
				++p
		}

		function lex_word() {
			while (p < n && !" \t\n".includes(s[p]))
				++p
			words.push(s.substring(m, p))
		}

		function lex_qstring(q) {
			var x = 1
			++p
			while (p < n && x > 0) {
				if (s[p] === q)
					--x
				++p
			}
			if (p >= n && x > 0)
				throw new Error("unterminated string")
			words.push(s.substring(m, p))
		}

		function lex_bstring(a, b) {
			var x = 1
			++p
			while (p < n && x > 0) {
				if (s[p] === a)
					++x
				else if (s[p] === b)
					--x
				++p
			}
			if (p >= n && x > 0)
				throw new Error("unterminated string")
			words.push(s.substring(m, p))
		}

		while (p < n) {
			while (s[p] === " " || s[p] === "\t")
				++p
			if (p >= n) break
			m = p
			if (s[p] === "{") lex_bstring("{", "}")
			else if (s[p] === "[") lex_bstring("[", "]")
			else if (s[p] === "(") lex_bstring("(", ")")
			else if (s[p] === '"') lex_qstring('"')
			else if (s[p] === "\n") lex_newline()
			else if (s[p] === ";") lex_semi()
			else if (s[p] === "#") lex_comment()
			else if (s[p] === "/" && s[p+1] === "/") lex_comment()
			else if (s[p] === "-" && s[p+1] === "-") lex_comment()
			else lex_word()
		}

		if (words.length > 0)
			command(words)
	}

	function command(line) {
		var ix_loop, ix1, ix2
		var i, k, start, end, array, body

		switch (line[0]) {
		case "set":
			if (line.length !== 3)
				throw new Error("invalid set - " + line.join(" "))
			emit(line[1] + " = " + line[2])
			break
		case "incr":
			if (line.length !== 2)
				throw new Error("invalid incr - " + line.join(" "))
			emit("++(" + line[1] + ")")
			break
		case "decr":
			if (line.length !== 2)
				throw new Error("invalid decr - " + line.join(" "))
			emit("--(" + line[1] + ")")
			break
		case "eval":
			emit(line.slice(1).join(" "))
			break
		case "log":
			emit("log(" + line.slice(1).join(" ") + ")")
			break
		case "call":
			if (line.length === 3)
				emit("call(" + quote(line[1]) + ", " + line[2] + ")")
			else if (line.length === 2)
				emit("call(" + quote(line[1]) + ")")
			else
				throw new Error("invalid call - " + line.join(" "))
			break
		case "goto":
			if (line.length === 3)
				emit("goto(" + quote(line[1]) + ", " + line[2] + ")")
			else if (line.length === 2)
				emit("goto(" + quote(line[1]) + ")")
			else
				throw new Error("invalid goto - " + line.join(" "))
			break
		case "return":
			if (line.length === 1)
				emit(`end()`)
			else if (line.length === 2)
				emit(`end(${line[1]})`)
			else
				throw new Error("invalid return - " + line.join(" "))
			break
		case "while":
			if (line.length !== 3)
				throw new Error("invalid while - " + line.join(" "))
			ix_loop = emit_jz(line[1])
			block(line[2])
			emit_jump(ix_loop)
			label(ix_loop)
			break
		case "for":
			if (line.length === 7 && line[2] === "in" && line[4] === "to") {
				i = line[1]
				start = line[3]
				end = line[5]
				body = line[6]
				emit(`${i} = ${start}`)
				ix_loop = prog.length
				block(body)
				emit(`if ((${i}) < ${end}) { ++(${i}); L.I = ${ix_loop} }`)
				return
			} else if (line.length === 5 && line[2] === "in") {
				k = line[1]
				i = k.replace(/^G\./, "L.G_") + "_"
				array = line[3]
				body = line[4]
				emit(`${i} = 0`)
				ix_loop = emit(`if (${i} < ${array}.length) { ${k} = ${array}[${i}++] } else { delete ${i} ; L.I = @ }`)
				block(body)
				emit_jump(ix_loop)
				label(ix_loop)
			} else {
				throw new Error("invalid for - " + line.join(" "))
			}
			break
		case "if":
			if (line.length === 3) {
				ix1 = emit_jz(line[1])
				block(line[2])
				label(ix1)
			} else if (line.length === 5 && line[3] === "else") {
				ix1 = emit_jz(line[1])
				block(line[2])
				ix2 = emit_jump()
				label(ix1)
				block(line[4])
				label(ix2)
			} else {
				throw new Error("invalid if - " + line.join(" "))
			}
			break
		default:
			throw new Error("unknown command - " + line.join(" "))
		}
	}

	function quote(s) {
		if ("{[(`'\"".includes(s[0]))
			return s
		return '"' + s + '"'
	}

	function emit_jz(exp, to = "@") {
		return emit("if (!(" + exp + ")) L.I = " + to)
	}

	function emit_jump(to = "@") {
		return emit("L.I = " + to)
	}

	function emit(s) {
		prog.push(s)
		return prog.length - 1
	}

	function label(ix) {
		prog[ix] = prog[ix].replace("@", prog.length)
	}

	function block(body) {
		if (body[0] !== "{")
			throw new Error("expected block")
		lex(body.slice(1, -1))
	}

	lex(text)

	return prog
}

function script(text) {
	return text
}

// Compile scripts
;(function _compile() {
	var cache = {}
	for (var name in P) {
		if (typeof P[name] === "string") {
			var prog = []
			try {
				for (var inst of _parse(P[name])) {
					try {
						prog.push(cache[inst] ??= eval("(function(){" + inst + "})"))
					} catch (err) {
						err.message += "\n\tat (" + inst + ")"
						throw err
					}
				}
			} catch (err) {
				err.message += "\n\tat P." + name
				throw err
			}
			P[name] = prog
		}
	}
})()

// === LIBRARY ===

function clear_undo() {
	if (G.undo) {
		G.undo.length = 0
	}
}

function push_undo() {
	var copy, k, v
	if (G.undo) {
		copy = {}
		for (k in G) {
			v = G[k]
			if (k === "undo")
				continue
			else if (k === "log")
				v = v.length
			else if (typeof v === "object" && v !== null)
				v = object_copy(v)
			copy[k] = v
		}
		G.undo.push(copy)
	}
}

function pop_undo() {
	if (G.undo) {
		var save_log = G.log
		var save_undo = G.undo
		G = save_undo.pop()
		save_log.length = G.log
		G.log = save_log
		G.undo = save_undo
	}
}

function random(range) {
	return (G.seed = G.seed * 200105 % 34359738337) % range
}

function shuffle(list) {
	var i, j, tmp
	for (i = list.length - 1; i > 0; --i) {
		j = random(i + 1)
		tmp = list[j]
		list[j] = list[i]
		list[i] = tmp
	}
}

function object_copy(original) {
	var copy, i, n, v
	if (Array.isArray(original)) {
		n = original.length
		copy = new Array(n)
		for (i = 0; i < n; ++i) {
			v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	} else {
		copy = {}
		for (i in original) {
			v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	}
}

function array_delete(array, index) {
	var i, n = array.length
	for (i = index + 1; i < n; ++i)
		array[i - 1] = array[i]
	array.length = n - 1
}

function array_delete_item(array, item) {
	var i, n = array.length
	for (i = 0; i < n; ++i)
		if (array[i] === item)
			return array_delete(array, i)
}

function array_insert(array, index, item) {
	for (var i = array.length; i > index; --i)
		array[i] = array[i - 1]
	array[index] = item
}

function set_clear(set) {
	set.length = 0
}

function set_has(set, item) {
	var a = 0
	var b = set.length - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return true
	}
	return false
}

function set_add(set, item) {
	var a = 0
	var b = set.length - 1
	if (item > set[b]) {
		set[b+1] = item
		return
	}
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return
	}
	array_insert(set, a, item)
}

function set_delete(set, item) {
	var a = 0
	var b = set.length - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else {
			array_delete(set, m)
			return
		}
	}
}

function map_get(map, key, missing) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else
			return map[(m<<1)+1]
	}
	return missing
}

function map_set(map, key, value) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else {
			map[(m<<1)+1] = value
			return
		}
	}
	var idx = a<<1
	for (var i = map.length; i > idx; i -= 2) {
		map[i] = map[i-2]
		map[i+1] = map[i-1]
	}
	map[idx] = key
	map[idx+1] = value
}
