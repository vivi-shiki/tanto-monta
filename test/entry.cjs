"use strict"

const data = require("../data.js")
const rules = require("../rules.js")

function setupGame({ seed = 1, scenario = "Standard", options = {} } = {}) {
	return rules.setup(seed, scenario, options)
}

module.exports = {
	data,
	rules,
	setupGame,
}
