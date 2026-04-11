"use strict"

/* globals data */

const { regions, units, commanders, cards, ELIMINATED, POWER_CLASS } = data

// Map dimensions (match the tm/main.jpg image)
const MAP_W = 5298
const MAP_H = 3449

const UNIT_SIZE = 36
const COMMANDER_SIZE = 40
const STACK_DX = 8
const STACK_DY = 8

// === UI ELEMENTS ===

let ui = {
	map: document.getElementById("map"),
	pieces: document.getElementById("pieces"),
	status: document.getElementById("status"),
	spaces: [],
	hex_markers: [],
	unit_elements: [],
	commander_elements: [],
	card_elements: [],
}

let gameView = null

// === BUILD UI ===

function build_region(r) {
	let region = regions[r]
	let marker = document.createElement("div")
	marker.className = "hex-marker"
	marker.style.left = (region.x - 55) + "px"
	marker.style.top = (region.y - 55) + "px"
	marker.title = `Hex ${r}: ${region.name}`
	ui.pieces.appendChild(marker)
	ui.hex_markers[r] = marker

	let elt = document.createElement("div")
	elt.className = "region"
	elt.region = r
	elt.style.left = (region.x - 55) + "px"
	elt.style.top = (region.y - 55) + "px"
	elt.addEventListener("click", on_click_region)
	elt.addEventListener("mouseenter", on_focus_region)
	elt.addEventListener("mouseleave", on_blur_region)
	ui.pieces.appendChild(elt)
	ui.spaces[r] = elt
}

function build_unit(u) {
	let unit = units[u]
	let elt = document.createElement("div")
	elt.className = "unit offmap power_" + POWER_CLASS[unit.power]
	elt.unit = u
	elt.addEventListener("click", on_click_unit)
	elt.addEventListener("mouseenter", on_focus_unit)
	elt.addEventListener("mouseleave", on_blur_unit)
	ui.pieces.appendChild(elt)
	ui.unit_elements[u] = elt
}

function build_commander(c) {
	let cmd = commanders[c]
	let elt = document.createElement("div")
	elt.className = "commander offmap power_" + POWER_CLASS[cmd.power]
	elt.commander = c
	elt.addEventListener("click", on_click_commander)
	elt.addEventListener("mouseenter", on_focus_commander)
	elt.addEventListener("mouseleave", on_blur_commander)
	ui.pieces.appendChild(elt)
	ui.commander_elements[c] = elt
}

function build_card(c) {
	let card = cards[c]
	let elt = document.createElement("div")
	elt.className = "card event_card"
	elt.card_id = c
	elt.addEventListener("click", on_click_card)
	elt.addEventListener("mouseenter", on_focus_card)
	elt.addEventListener("mouseleave", on_blur_card)
	ui.card_elements[c] = elt
}

// === EVENT HANDLERS ===

function on_click_region(evt) {
	let r = evt.currentTarget.region
	if (gameView.actions) {
		if (gameView.actions.region && gameView.actions.region.includes(r))
			send_action("region", r)
		else if (gameView.actions.move_to && gameView.actions.move_to.includes(r))
			send_action("move_to", r)
	}
}

function on_focus_region(evt) {
	let r = evt.currentTarget.region
	ui.status.textContent = regions[r].name
}

function on_blur_region() {
	ui.status.textContent = ""
}

function on_click_unit(evt) {
	let u = evt.currentTarget.unit
	if (gameView.actions) {
		if (gameView.actions.unit && gameView.actions.unit.includes(u))
			send_action("unit", u)
		if (gameView.actions.piece && gameView.actions.piece.includes(u))
			send_action("piece", u)
	}
}

function on_focus_unit(evt) {
	let u = evt.currentTarget.unit
	let unit = units[u]
	let loc = gameView.location[u]
	let where = loc >= 0 ? regions[loc].name : (loc === ELIMINATED ? "Eliminated" : "Available")
	ui.status.textContent = unit.name + " in " + where
}

function on_blur_unit() {
	ui.status.textContent = ""
}

function on_click_commander(evt) {
	let c = evt.currentTarget.commander
	if (gameView.actions) {
		if (gameView.actions.commander && gameView.actions.commander.includes(c))
			send_action("commander", c)
	}
}

function on_focus_commander(evt) {
	let c = evt.currentTarget.commander
	let cmd = commanders[c]
	let loc = gameView.commander_location[c]
	let where = loc >= 0 ? regions[loc].name : "Off map"
	ui.status.textContent = cmd.name + " (" + cmd.command + "/" + cmd.admin + ") in " + where
}

function on_blur_commander() {
	ui.status.textContent = ""
}

function on_click_card(evt) {
	let c = evt.currentTarget.card_id
	if (gameView.actions) {
		if (gameView.actions.card && gameView.actions.card.includes(c))
			send_action("card", c)
		if (gameView.actions.play_card && gameView.actions.play_card.includes(c))
			send_action("play_card", c)
	}
}

function on_focus_card(evt) {
	let c = evt.currentTarget.card_id
	let card = cards[c]
	ui.status.textContent = card.name + " (Ops: " + card.ops + ")"
	let tooltip = document.getElementById("tooltip")
	if (tooltip) {
		tooltip.className = "card tooltip_card event_" + String(c).padStart(2, "0")
		tooltip.hidden = false
	}
}

function on_blur_card() {
	ui.status.textContent = ""
	let tooltip = document.getElementById("tooltip")
	if (tooltip)
		tooltip.hidden = true
}

// === LAYOUT ===

function layout_region_stack(r) {
	let region = regions[r]
	let cx = region.x
	let cy = region.y

	// Collect units in this region
	let unit_list = []
	for (let u = 0; u < units.length; ++u)
		if (gameView.location[u] === r)
			unit_list.push(u)

	// Collect commanders in this region
	let cmd_list = []
	for (let c = 0; c < commanders.length; ++c)
		if (gameView.commander_location[c] === r)
			cmd_list.push(c)

	// Layout units in a stack
	let n = unit_list.length + cmd_list.length
	let sx = cx - (n * STACK_DX) / 2
	let sy = cy - UNIT_SIZE / 2
	let i = 0

	for (let c of cmd_list) {
		let elt = ui.commander_elements[c]
		elt.classList.remove("offmap")
		elt.style.left = Math.floor(sx + i * STACK_DX) + "px"
		elt.style.top = Math.floor(sy - STACK_DY) + "px"
		elt.style.zIndex = 10 + i
		i++
	}

	for (let u of unit_list) {
		let elt = ui.unit_elements[u]
		elt.classList.remove("offmap")
		elt.classList.toggle("reduced", !!gameView.reduced[u])
		elt.style.left = Math.floor(sx + i * STACK_DX) + "px"
		elt.style.top = Math.floor(sy) + "px"
		elt.style.zIndex = 10 + i

		// Highlight selectable units
		if (gameView.actions && gameView.actions.unit && gameView.actions.unit.includes(u))
			elt.classList.add("highlight")
		else if (gameView.actions && gameView.actions.piece && gameView.actions.piece.includes(u))
			elt.classList.add("highlight")
		else
			elt.classList.remove("highlight")
		i++
	}
}

// === UPDATE ===

function update_map() {
	if (!gameView)
		return

	// Hide all pieces first
	for (let u = 0; u < units.length; ++u) {
		ui.unit_elements[u].classList.add("offmap")
		ui.unit_elements[u].classList.remove("highlight")
	}
	for (let c = 0; c < commanders.length; ++c) {
		ui.commander_elements[c].classList.add("offmap")
		ui.commander_elements[c].classList.remove("highlight")
	}

	// Update region control colors
	for (let r = 0; r < regions.length; ++r) {
		let elt = ui.spaces[r]
		elt.classList.remove("control_france", "control_spain", "control_portugal", "control_muslim")
		let ctrl = gameView.control[r] ?? -1
		if (ctrl >= 0)
			elt.classList.add("control_" + POWER_CLASS[ctrl])

		// Highlight selectable regions
		let selectable = false
		if (gameView.actions) {
			if (gameView.actions.region && gameView.actions.region.includes(r))
				selectable = true
			if (gameView.actions.move_to && gameView.actions.move_to.includes(r))
				selectable = true
		}
		elt.classList.toggle("highlight", selectable)
	}

	// Layout units in each region
	for (let r = 0; r < regions.length; ++r)
		layout_region_stack(r)

	// Highlight selectable commanders
	for (let c = 0; c < commanders.length; ++c) {
		if (gameView.actions && gameView.actions.commander && gameView.actions.commander.includes(c))
			ui.commander_elements[c].classList.add("highlight")
	}

	// Update cards display
	update_hand()
}

function update_hand() {
	let hand_el = document.getElementById("hand")
	if (!hand_el)
		return
	hand_el.replaceChildren()

	if (gameView.hand) {
		for (let c of gameView.hand) {
			let elt = ui.card_elements[c]
			if (elt) {
				elt.classList.toggle("highlight",
					(gameView.actions && gameView.actions.card && gameView.actions.card.includes(c)) ||
					(gameView.actions && gameView.actions.play_card && gameView.actions.play_card.includes(c))
				)
				hand_el.appendChild(elt)
			}
		}
	}
}

// === CALLBACKS ===

function on_init() {
	// Build regions
	for (let r = 0; r < regions.length; ++r)
		build_region(r)

	// Build units
	for (let u = 0; u < units.length; ++u)
		build_unit(u)

	// Build commanders
	for (let c = 0; c < commanders.length; ++c)
		build_commander(c)

	// Build cards
	for (let c = 1; c < cards.length; ++c)
		build_card(c)

	fit_map_to_width()
}

function fit_map_to_width() {
	let mapwrap = document.getElementById("mapwrap")
	if (!mapwrap)
		return
	mapwrap.dataset.fit = "width"
	if (typeof window.update_zoom === "function")
		requestAnimationFrame(() => window.update_zoom())
}

function on_update() {
	update_map()

	// Action buttons
	action_button("recruit_militia", "Recruit Militia")
	action_button("recruit_regular", "Recruit Regular")
	action_button("recruit_cavalry", "Recruit Cavalry")
	action_button("move", "Move")
	action_button("pass", "Pass")
	action_button("done", "Done")
	action_button("undo", "Undo")
}

function sub_region_name(match, p1) {
	let r = p1 | 0
	let name = regions[r].name
	return `<span class="regiontip" onclick="scroll_to_region(${r})">${name}</span>`
}

function sub_unit_name(match, p1) {
	let u = p1 | 0
	let unit = units[u]
	if (unit)
		return `<span class="unittip power_${POWER_CLASS[unit.power]}">${unit.name}</span>`
	return "Unknown Unit"
}

function sub_card_name(match, p1) {
	let c = p1 | 0
	let card = cards[c]
	if (card)
		return `<span class="cardtip">${card.name}</span>`
	return "Unknown Card"
}

function scroll_to_region(r) {
	let elt = ui.spaces[r]
	if (elt)
		elt.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" })
}

// Register log substitutions
if (typeof on_log !== "undefined") {
	on_log = function (text) {
		text = text.replace(/R(\d+)/g, sub_region_name)
		text = text.replace(/U(\d+)/g, sub_unit_name)
		text = text.replace(/C(\d+)/g, sub_card_name)
		return text
	}
}

// Expose callbacks to global scope for client.js
window.on_init = on_init
window.on_update = on_update
