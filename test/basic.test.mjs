import { describe, expect, it } from "vitest"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { data, rules, setupGame } = require("./entry.cjs")

describe("tanto-monta test entry", () => {
	it("creates a standard game view with the hex map data", () => {
		const game = setupGame()
		const view = rules.view(game, "France")

		expect(data.regions).toHaveLength(213)
		expect(view.control).toHaveLength(data.regions.length)
		expect(view.actions.play_card.length).toBeGreaterThan(0)
		expect(data.regions[game.location[0]].name).toBe("Bordeaux")
	})
})
