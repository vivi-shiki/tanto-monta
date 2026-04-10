"use strict"

const data = {}

// === POWERS ===

const FRANCE = 0
const SPAIN = 1
const PORTUGAL = 2
const MUSLIM = 3

data.power_name = ["France", "Spain", "Portugal", "Muslim"]

// === UNIT TYPES ===

const MILITIA = 0
const REGULAR = 1
const CAVALRY = 2
const ARTILLERY = 3
const GALLEY = 4
const NAO = 5
const CORSAIR = 6

data.unit_type_name = ["Militia", "Regular", "Cavalry", "Artillery", "Galley", "Nao", "Corsair"]

// === REGION TYPES ===

const NORMAL = 0
const STRATEGIC = 1
const KEY = 2
const FORTRESS = 3
const SPECIAL = 4

// === REGIONS ===

// Each region: { id, name, type, homeland, is_port, vp, x, y }
// Connections are defined separately as adjacency list

data.regions = [
	{ id: 0, name: "Bordeaux", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1865, y: 868 },
	{ id: 1, name: "Toulouse", type: NORMAL, homeland: FRANCE, is_port: false, vp: 0, x: 2056, y: 916 },
	{ id: 2, name: "Bayonne", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1739, y: 1034 },
	{ id: 3, name: "Perpignan", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1568, y: 1185 },
	{ id: 4, name: "Navarre", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 1442, y: 1002 },
	{ id: 5, name: "Aragon", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 1594, y: 859 },
	{ id: 6, name: "Catalonia", type: STRATEGIC, homeland: SPAIN, is_port: true, vp: 1, x: 1685, y: 702 },
	{ id: 7, name: "Valencia", type: KEY, homeland: SPAIN, is_port: true, vp: 2, x: 1100, y: 700 },
	{ id: 8, name: "Castille", type: KEY, homeland: SPAIN, is_port: false, vp: 2, x: 900, y: 900 },
	{ id: 9, name: "Leon", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 600, y: 800 },
	{ id: 10, name: "Galicia", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 350, y: 700 },
	{ id: 11, name: "Andalusia", type: KEY, homeland: SPAIN, is_port: true, vp: 2, x: 700, y: 1300 },
	{ id: 12, name: "Granada", type: KEY, homeland: MUSLIM, is_port: true, vp: 3, x: 900, y: 1400 },
	{ id: 13, name: "Murcia", type: STRATEGIC, homeland: SPAIN, is_port: true, vp: 1, x: 1100, y: 1300 },
	{ id: 14, name: "Extremadura", type: NORMAL, homeland: SPAIN, is_port: false, vp: 0, x: 500, y: 1100 },
	{ id: 15, name: "Portugal North", type: STRATEGIC, homeland: PORTUGAL, is_port: true, vp: 1, x: 250, y: 900 },
	{ id: 16, name: "Lisbon", type: KEY, homeland: PORTUGAL, is_port: true, vp: 3, x: 200, y: 1100 },
	{ id: 17, name: "Algarve", type: NORMAL, homeland: PORTUGAL, is_port: true, vp: 0, x: 300, y: 1300 },
	{ id: 18, name: "Fez", type: KEY, homeland: MUSLIM, is_port: true, vp: 2, x: 500, y: 1600 },
	{ id: 19, name: "Tlemcen", type: STRATEGIC, homeland: MUSLIM, is_port: true, vp: 1, x: 800, y: 1600 },
	{ id: 20, name: "Oran", type: NORMAL, homeland: MUSLIM, is_port: true, vp: 0, x: 1000, y: 1550 },
	{ id: 21, name: "Algiers", type: STRATEGIC, homeland: MUSLIM, is_port: true, vp: 1, x: 1200, y: 1500 },
	{ id: 22, name: "Mallorca", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 1400, y: 1100 },
	{ id: 23, name: "Sardinia", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 1600, y: 1350 },
	{ id: 24, name: "Badajoz", type: NORMAL, homeland: SPAIN, is_port: false, vp: 0, x: 400, y: 1200 },
]

// Adjacency list: region index -> [connected region indices]
data.adjacency = [
	/* 0 Bordeaux    */ [1, 2],
	/* 1 Toulouse    */ [0, 3, 5],
	/* 2 Bayonne     */ [0, 4],
	/* 3 Perpignan   */ [1, 5, 6],
	/* 4 Navarre     */ [2, 5, 8, 9],
	/* 5 Aragon      */ [1, 3, 4, 6, 7, 8],
	/* 6 Catalonia   */ [3, 5, 7],
	/* 7 Valencia    */ [5, 6, 8, 13, 22],
	/* 8 Castille    */ [4, 5, 7, 9, 11, 13, 14],
	/* 9 Leon        */ [4, 8, 10, 14, 15],
	/* 10 Galicia    */ [9, 15],
	/* 11 Andalusia  */ [8, 12, 14, 17, 24],
	/* 12 Granada    */ [11, 13, 19, 20],
	/* 13 Murcia     */ [7, 8, 12, 21],
	/* 14 Extremadura*/ [8, 9, 11, 16, 24],
	/* 15 Portugal N */ [9, 10, 16],
	/* 16 Lisbon     */ [14, 15, 17, 24],
	/* 17 Algarve    */ [11, 16, 18],
	/* 18 Fez        */ [17, 19],
	/* 19 Tlemcen    */ [12, 18, 20],
	/* 20 Oran       */ [12, 19, 21],
	/* 21 Algiers    */ [13, 20],
	/* 22 Mallorca   */ [7, 23],
	/* 23 Sardinia   */ [22],
	/* 24 Badajoz    */ [11, 14, 16],
]

// Sea connections (port-to-port routes)
data.sea_connections = [
	[6, 22],    // Catalonia - Mallorca
	[22, 23],   // Mallorca - Sardinia
	[7, 22],    // Valencia - Mallorca
	[10, 15],   // Galicia - Portugal North
	[17, 18],   // Algarve - Fez
	[11, 18],   // Andalusia - Fez
	[12, 19],   // Granada - Tlemcen
	[12, 20],   // Granada - Oran
	[13, 21],   // Murcia - Algiers
]

// === PIECES / UNITS ===

// Each unit: { id, type, power, name, strength, image }
// strength: [full, reduced] combat factors
data.units = [
	// --- FRANCE ---
	{ id: 0, type: REGULAR, power: FRANCE, name: "FR Reg 1", strength: [2, 1], image: "france/france1reg" },
	{ id: 1, type: REGULAR, power: FRANCE, name: "FR Reg 2", strength: [2, 1], image: "france/france2reg" },
	{ id: 2, type: MILITIA, power: FRANCE, name: "FR Mil 1", strength: [1, 0], image: "france/france1mil" },
	{ id: 3, type: MILITIA, power: FRANCE, name: "FR Mil 2", strength: [1, 0], image: "france/france2mil" },
	{ id: 4, type: CAVALRY, power: FRANCE, name: "FR Cav 1", strength: [3, 1], image: "france/france1cav" },
	{ id: 5, type: CAVALRY, power: FRANCE, name: "FR Cav 2", strength: [3, 1], image: "france/france2cav" },
	{ id: 6, type: ARTILLERY, power: FRANCE, name: "FR Art 1", strength: [2, 1], image: "france/france1art" },
	{ id: 7, type: ARTILLERY, power: FRANCE, name: "FR Art 2", strength: [2, 1], image: "france/france2art" },
	{ id: 8, type: GALLEY, power: FRANCE, name: "FR Galley", strength: [1, 0], image: "france/francegalley" },
	{ id: 9, type: NAO, power: FRANCE, name: "FR Nao", strength: [1, 0], image: "france/francec1p2nao" },
	{ id: 10, type: MILITIA, power: FRANCE, name: "FR Mil 4", strength: [1, 0], image: "france/france4mil" },
	{ id: 11, type: REGULAR, power: FRANCE, name: "FR Reg 4", strength: [2, 1], image: "france/france4reg" },
	{ id: 12, type: CAVALRY, power: FRANCE, name: "FR Cav 4", strength: [3, 1], image: "france/france4cav" },
	{ id: 13, type: MILITIA, power: FRANCE, name: "FR Mil 6", strength: [1, 0], image: "france/france6mil" },
	{ id: 14, type: REGULAR, power: FRANCE, name: "FR Reg 6", strength: [2, 1], image: "france/france6reg" },

	// --- SPAIN (Castille) ---
	{ id: 15, type: REGULAR, power: SPAIN, name: "SP Reg 1", strength: [2, 1], image: "castille/castille1reg" },
	{ id: 16, type: REGULAR, power: SPAIN, name: "SP Reg 2", strength: [2, 1], image: "castille/castille2reg" },
	{ id: 17, type: MILITIA, power: SPAIN, name: "SP Mil 1", strength: [1, 0], image: "castille/castille1mil" },
	{ id: 18, type: MILITIA, power: SPAIN, name: "SP Mil 2", strength: [1, 0], image: "castille/castille2mil" },
	{ id: 19, type: CAVALRY, power: SPAIN, name: "SP Cav 1", strength: [3, 1], image: "castille/castille1cav" },
	{ id: 20, type: CAVALRY, power: SPAIN, name: "SP Cav 2", strength: [3, 1], image: "castille/castille2cav" },
	{ id: 21, type: GALLEY, power: SPAIN, name: "SP Galley", strength: [1, 0], image: "castille/castillegalley" },
	{ id: 22, type: NAO, power: SPAIN, name: "SP Nao", strength: [1, 0], image: "castille/castillec1p1nao" },
	{ id: 23, type: MILITIA, power: SPAIN, name: "SP Mil 4", strength: [1, 0], image: "castille/castille4mil" },
	{ id: 24, type: REGULAR, power: SPAIN, name: "SP Reg 4", strength: [2, 1], image: "castille/castille4reg" },
	{ id: 25, type: MILITIA, power: SPAIN, name: "SP Mil 6", strength: [1, 0], image: "castille/castille6mil" },
	{ id: 26, type: REGULAR, power: SPAIN, name: "SP Reg 6", strength: [2, 1], image: "castille/castille6reg" },

	// --- PORTUGAL ---
	{ id: 27, type: REGULAR, power: PORTUGAL, name: "PT Reg 1", strength: [2, 1], image: "portugal1reg" },
	{ id: 28, type: REGULAR, power: PORTUGAL, name: "PT Reg 2", strength: [2, 1], image: "portugal2reg" },
	{ id: 29, type: MILITIA, power: PORTUGAL, name: "PT Mil 1", strength: [1, 0], image: "portugal1mil" },
	{ id: 30, type: MILITIA, power: PORTUGAL, name: "PT Mil 2", strength: [1, 0], image: "portugal2mil" },
	{ id: 31, type: CAVALRY, power: PORTUGAL, name: "PT Cav 1", strength: [3, 1], image: "portugal1cav" },
	{ id: 32, type: CAVALRY, power: PORTUGAL, name: "PT Cav 2", strength: [3, 1], image: "portugal2cav" },
	{ id: 33, type: GALLEY, power: PORTUGAL, name: "PT Galley", strength: [1, 0], image: "portugalgalley" },
	{ id: 34, type: NAO, power: PORTUGAL, name: "PT Nao 1", strength: [1, 0], image: "portugalc1p1nao" },
	{ id: 35, type: NAO, power: PORTUGAL, name: "PT Nao 2", strength: [2, 1], image: "portugalc2p1nao" },
	{ id: 36, type: MILITIA, power: PORTUGAL, name: "PT Mil 4", strength: [1, 0], image: "portugal4mil" },
	{ id: 37, type: REGULAR, power: PORTUGAL, name: "PT Reg 4", strength: [2, 1], image: "portugal4reg" },
	{ id: 38, type: CAVALRY, power: PORTUGAL, name: "PT Cav 4", strength: [3, 1], image: "portugal4cav" },
	{ id: 39, type: MILITIA, power: PORTUGAL, name: "PT Mil 6", strength: [1, 0], image: "portugal6mil" },
	{ id: 40, type: REGULAR, power: PORTUGAL, name: "PT Reg 6", strength: [2, 1], image: "portugal6reg" },

	// --- MUSLIM (Nasrid + North Africa) ---
	{ id: 41, type: REGULAR, power: MUSLIM, name: "Nasrid Reg 1", strength: [2, 1], image: "nasrid1reg" },
	{ id: 42, type: REGULAR, power: MUSLIM, name: "Nasrid Reg 2", strength: [2, 1], image: "nasrid2reg" },
	{ id: 43, type: MILITIA, power: MUSLIM, name: "Nasrid Mil 1", strength: [1, 0], image: "nasrid1mil" },
	{ id: 44, type: MILITIA, power: MUSLIM, name: "Nasrid Mil 2", strength: [1, 0], image: "nasrid2mil" },
	{ id: 45, type: CAVALRY, power: MUSLIM, name: "Nasrid Cav 1", strength: [3, 1], image: "nasrid1cav" },
	{ id: 46, type: CAVALRY, power: MUSLIM, name: "Nasrid Cav 2", strength: [3, 1], image: "nasrid2cav" },
	{ id: 47, type: GALLEY, power: MUSLIM, name: "Nasrid Galley", strength: [1, 0], image: "nasridgalley" },
	{ id: 48, type: CORSAIR, power: MUSLIM, name: "Nasrid Corsair", strength: [1, 0], image: "nasridcorsair" },
	{ id: 49, type: REGULAR, power: MUSLIM, name: "NAfr Reg 1", strength: [2, 1], image: "nafrica1reg" },
	{ id: 50, type: REGULAR, power: MUSLIM, name: "NAfr Reg 2", strength: [2, 1], image: "nafrica2reg" },
	{ id: 51, type: MILITIA, power: MUSLIM, name: "NAfr Mil 1", strength: [1, 0], image: "nafrica1mil" },
	{ id: 52, type: MILITIA, power: MUSLIM, name: "NAfr Mil 2", strength: [1, 0], image: "nafrica2mil" },
	{ id: 53, type: CAVALRY, power: MUSLIM, name: "NAfr Cav 1", strength: [3, 1], image: "nafrica1cav" },
	{ id: 54, type: CAVALRY, power: MUSLIM, name: "NAfr Cav 2", strength: [3, 1], image: "nafrica2cav" },
	{ id: 55, type: NAO, power: MUSLIM, name: "NAfr Nao", strength: [1, 0], image: "nafricac1p1nao" },
	{ id: 56, type: GALLEY, power: MUSLIM, name: "NAfr Galley", strength: [1, 0], image: "nafricagalley" },
	{ id: 57, type: MILITIA, power: MUSLIM, name: "Nasrid Mil 4", strength: [1, 0], image: "nasrid4mil" },
	{ id: 58, type: REGULAR, power: MUSLIM, name: "Nasrid Reg 4", strength: [2, 1], image: "nasrid4reg" },
	{ id: 59, type: CAVALRY, power: MUSLIM, name: "Nasrid Cav 4", strength: [3, 1], image: "nasrid4cav" },
	{ id: 60, type: MILITIA, power: MUSLIM, name: "NAfr Mil 4", strength: [1, 0], image: "nafrica4mil" },
	{ id: 61, type: REGULAR, power: MUSLIM, name: "NAfr Reg 4", strength: [2, 1], image: "nafrica4reg" },
	{ id: 62, type: CAVALRY, power: MUSLIM, name: "NAfr Cav 4", strength: [3, 1], image: "nafrica4cav" },
	{ id: 63, type: MILITIA, power: MUSLIM, name: "Nasrid Mil 6", strength: [1, 0], image: "nasrid6mil" },
	{ id: 64, type: REGULAR, power: MUSLIM, name: "Nasrid Reg 6", strength: [2, 1], image: "nasrid6reg" },
	{ id: 65, type: MILITIA, power: MUSLIM, name: "NAfr Mil 6", strength: [1, 0], image: "nafrica6mil" },
	{ id: 66, type: REGULAR, power: MUSLIM, name: "NAfr Reg 6", strength: [2, 1], image: "nafrica6reg" },
]

// === COMMANDERS ===

// Each commander: { id, power, name, command, admin, naval, image }
data.commanders = [
	// FRANCE
	{ id: 0, power: FRANCE, name: "Louis XI", command: 2, admin: 3, naval: false, image: "france/francelouisxi" },
	{ id: 1, power: FRANCE, name: "Charles VIII", command: 3, admin: 2, naval: false, image: "france/francecharlesviii" },
	{ id: 2, power: FRANCE, name: "Louis XII", command: 2, admin: 2, naval: false, image: "france/francelouisxii" },
	{ id: 3, power: FRANCE, name: "Anjou", command: 2, admin: 1, naval: false, image: "france/franceanjou" },

	// SPAIN
	{ id: 4, power: SPAIN, name: "Isabella", command: 2, admin: 3, naval: false, image: "castille/castilleisabella" },
	{ id: 5, power: SPAIN, name: "Mendoza", command: 3, admin: 2, naval: false, image: "castille/castillemendoza" },
	{ id: 6, power: SPAIN, name: "Gran Capitan", command: 4, admin: 1, naval: false, image: "castille/castillegcaptain" },

	// PORTUGAL
	{ id: 7, power: PORTUGAL, name: "Alfonso V", command: 2, admin: 2, naval: true, image: "portugalalfonsov" },
	{ id: 8, power: PORTUGAL, name: "Joao II", command: 3, admin: 3, naval: true, image: "portugaljoaoii" },
	{ id: 9, power: PORTUGAL, name: "Manuel I", command: 2, admin: 2, naval: true, image: "portugalmanueli" },

	// MUSLIM
	{ id: 10, power: MUSLIM, name: "Muley Hacen", command: 3, admin: 2, naval: false, image: "nasridmhacen" },
	{ id: 11, power: MUSLIM, name: "Boabdil", command: 2, admin: 1, naval: false, image: "nasridboabdil" },
	{ id: 12, power: MUSLIM, name: "El Zagal", command: 3, admin: 2, naval: false, image: "nasridelzagal" },
	{ id: 13, power: MUSLIM, name: "Barbarossa", command: 3, admin: 1, naval: true, image: "nafricabarbarossa" },
]

// === CARDS ===

// Card fields: { id, name, ops, power (null=any), event, remove, home }
data.cards = [
	{ id: 0 }, // placeholder (1-indexed)

	// Event cards (1-64)
	{ id: 1, name: "Event 1", ops: 3, power: null, event: null, remove: false },
	{ id: 2, name: "Event 2", ops: 2, power: null, event: null, remove: false },
	{ id: 3, name: "Event 3", ops: 4, power: null, event: null, remove: false },
	{ id: 4, name: "Event 4", ops: 3, power: null, event: null, remove: false },
	{ id: 5, name: "Event 5", ops: 2, power: null, event: null, remove: false },
	{ id: 6, name: "Event 6", ops: 3, power: null, event: null, remove: false },
	{ id: 7, name: "Event 7", ops: 4, power: null, event: null, remove: false },
	{ id: 8, name: "Event 8", ops: 2, power: null, event: null, remove: false },
	{ id: 9, name: "Event 9", ops: 3, power: null, event: null, remove: false },
	{ id: 10, name: "Event 10", ops: 3, power: null, event: null, remove: false },
	{ id: 11, name: "Event 11", ops: 2, power: null, event: null, remove: false },
	{ id: 12, name: "Event 12", ops: 4, power: null, event: null, remove: false },
	{ id: 13, name: "Event 13", ops: 3, power: null, event: null, remove: false },
	{ id: 14, name: "Event 14", ops: 2, power: null, event: null, remove: false },
	{ id: 15, name: "Event 15", ops: 3, power: null, event: null, remove: false },
	{ id: 16, name: "Event 16", ops: 4, power: null, event: null, remove: false },
	{ id: 17, name: "Event 17", ops: 2, power: null, event: null, remove: false },
	{ id: 18, name: "Event 18", ops: 3, power: null, event: null, remove: false },
	{ id: 19, name: "Event 19", ops: 3, power: null, event: null, remove: false },
	{ id: 20, name: "Event 20", ops: 2, power: null, event: null, remove: false },
	{ id: 21, name: "Event 21", ops: 4, power: null, event: null, remove: false },
	{ id: 22, name: "Event 22", ops: 3, power: null, event: null, remove: false },
	{ id: 23, name: "Event 23", ops: 2, power: null, event: null, remove: false },
	{ id: 24, name: "Event 24", ops: 3, power: null, event: null, remove: false },
	{ id: 25, name: "Event 25", ops: 4, power: null, event: null, remove: false },
	{ id: 26, name: "Event 26", ops: 2, power: null, event: null, remove: false },
	{ id: 27, name: "Event 27", ops: 3, power: null, event: null, remove: false },
	{ id: 28, name: "Event 28", ops: 3, power: null, event: null, remove: false },
	{ id: 29, name: "Event 29", ops: 2, power: null, event: null, remove: false },
	{ id: 30, name: "Event 30", ops: 4, power: null, event: null, remove: false },
	{ id: 31, name: "Event 31", ops: 3, power: null, event: null, remove: false },
	{ id: 32, name: "Event 32", ops: 2, power: null, event: null, remove: false },
	{ id: 33, name: "Event 33", ops: 3, power: null, event: null, remove: false },
	{ id: 34, name: "Event 34", ops: 4, power: null, event: null, remove: false },
	{ id: 35, name: "Event 35", ops: 2, power: null, event: null, remove: false },
	{ id: 36, name: "Event 36", ops: 3, power: null, event: null, remove: false },
	{ id: 37, name: "Event 37", ops: 3, power: null, event: null, remove: false },
	{ id: 38, name: "Event 38", ops: 2, power: null, event: null, remove: false },
	{ id: 39, name: "Event 39", ops: 4, power: null, event: null, remove: false },
	{ id: 40, name: "Event 40", ops: 3, power: null, event: null, remove: false },
	{ id: 41, name: "Event 41", ops: 2, power: null, event: null, remove: false },
	{ id: 42, name: "Event 42", ops: 3, power: null, event: null, remove: false },
	{ id: 43, name: "Event 43", ops: 4, power: null, event: null, remove: false },
	{ id: 44, name: "Event 44", ops: 2, power: null, event: null, remove: false },
	{ id: 45, name: "Event 45", ops: 3, power: null, event: null, remove: false },
	{ id: 46, name: "Event 46", ops: 3, power: null, event: null, remove: false },
	{ id: 47, name: "Event 47", ops: 2, power: null, event: null, remove: false },
	{ id: 48, name: "Event 48", ops: 4, power: null, event: null, remove: false },
	{ id: 49, name: "Event 49", ops: 3, power: null, event: null, remove: false },
	{ id: 50, name: "Event 50", ops: 2, power: null, event: null, remove: false },
	{ id: 51, name: "Event 51", ops: 3, power: null, event: null, remove: false },
	{ id: 52, name: "Event 52", ops: 4, power: null, event: null, remove: false },
	{ id: 53, name: "Event 53", ops: 2, power: null, event: null, remove: false },
	{ id: 54, name: "Event 54", ops: 3, power: null, event: null, remove: false },
	{ id: 55, name: "Event 55", ops: 3, power: null, event: null, remove: false },
	{ id: 56, name: "Event 56", ops: 2, power: null, event: null, remove: false },
	{ id: 57, name: "Event 57", ops: 4, power: null, event: null, remove: false },
	{ id: 58, name: "Event 58", ops: 3, power: null, event: null, remove: false },
	{ id: 59, name: "Event 59", ops: 2, power: null, event: null, remove: false },
	{ id: 60, name: "Event 60", ops: 3, power: null, event: null, remove: false },
	{ id: 61, name: "Event 61", ops: 4, power: null, event: null, remove: false },
	{ id: 62, name: "Event 62", ops: 2, power: null, event: null, remove: false },
	{ id: 63, name: "Event 63", ops: 3, power: null, event: null, remove: false },
	{ id: 64, name: "Event 64", ops: 3, power: null, event: null, remove: false },
]

// Home cards (separate deck)
data.home_cards = [
	{ id: 1, name: "Home 1", ops: 2, power: null },
	{ id: 2, name: "Home 2", ops: 3, power: null },
	{ id: 3, name: "Home 3", ops: 2, power: null },
	{ id: 4, name: "Home 4", ops: 4, power: null },
	{ id: 5, name: "Home 5", ops: 2, power: null },
	{ id: 6, name: "Home 6", ops: 3, power: null },
	{ id: 7, name: "Home 7", ops: 2, power: null },
	{ id: 8, name: "Home 8", ops: 4, power: null },
	{ id: 9, name: "Home 9", ops: 3, power: null },
	{ id: 10, name: "Home 10", ops: 2, power: null },
	{ id: 11, name: "Home 11", ops: 3, power: null },
	{ id: 12, name: "Home 12", ops: 4, power: null },
	{ id: 13, name: "Home 13", ops: 2, power: null },
]

// === SCENARIOS & INITIAL DEPLOYMENT ===

// 1470 scenario: starting positions { unit_id: region_id }
data.scenarios = {
	"Standard": {
		deployment: {
			// France starts in French homeland
			0: 0, 1: 1, 2: 0, 3: 1, 4: 2, 8: 0,
			// Spain starts in Castille
			15: 8, 16: 8, 17: 11, 18: 8, 19: 8, 21: 11,
			// Portugal starts in Lisbon area
			27: 16, 28: 15, 29: 16, 30: 15, 31: 16,
			// Muslim starts in Granada + N.Africa
			41: 12, 42: 18, 43: 12, 44: 19, 45: 12, 47: 12, 49: 18, 50: 19,
		},
		commanders: {
			0: 0,  // Louis XI in Bordeaux
			4: 8,  // Isabella in Castille
			7: 16, // Alfonso V in Lisbon
			10: 12, // Muley Hacen in Granada
		},
		control: {
			// France controls French regions
			0: FRANCE, 1: FRANCE, 2: FRANCE, 3: FRANCE,
			// Spain controls Spanish regions
			4: SPAIN, 5: SPAIN, 6: SPAIN, 7: SPAIN, 8: SPAIN, 9: SPAIN,
			10: SPAIN, 11: SPAIN, 13: SPAIN, 14: SPAIN, 22: SPAIN, 23: SPAIN, 24: SPAIN,
			// Portugal controls Portuguese regions
			15: PORTUGAL, 16: PORTUGAL, 17: PORTUGAL,
			// Muslim controls Islamic regions + Granada
			12: MUSLIM, 18: MUSLIM, 19: MUSLIM, 20: MUSLIM, 21: MUSLIM,
		},
		hand_size: [5, 5, 4, 5], // cards per power
	},
}

// === COSTS ===

data.recruit_cost = {
	[MILITIA]: 1,
	[REGULAR]: 2,
	[CAVALRY]: 3,
}

data.stacking_limit = 4

// === CONSTANTS (exported for use in rules.js and play.js) ===

// Powers
data.FRANCE = FRANCE
data.SPAIN = SPAIN
data.PORTUGAL = PORTUGAL
data.MUSLIM = MUSLIM

// Unit types
data.MILITIA = MILITIA
data.REGULAR = REGULAR
data.CAVALRY = CAVALRY
data.ARTILLERY = ARTILLERY
data.GALLEY = GALLEY
data.NAO = NAO
data.CORSAIR = CORSAIR

// Region types
data.NORMAL = NORMAL
data.STRATEGIC = STRATEGIC
data.KEY = KEY
data.FORTRESS = FORTRESS
data.SPECIAL = SPECIAL

// Special locations
data.ELIMINATED = -1
data.AVAILABLE = -2

// CSS class mappings
data.POWER_CLASS = ["france", "spain", "portugal", "muslim"]

// === EXPORT ===

if (typeof module !== "undefined")
	module.exports = data
