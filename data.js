"use strict"

const data = {}

// === POWERS ===

const FRANCE = 0
const SPAIN = 1
const PORTUGAL = 2
const MUSLIM = 3

data.power_name = ["France", "Spain", "Portugal", "Muslim"]

data.powers = [
	{ id: FRANCE, name: "France", role: "France", class_name: "france" },
	{ id: SPAIN, name: "Spain", role: "Spain", class_name: "spain" },
	{ id: PORTUGAL, name: "Portugal", role: "Portugal", class_name: "portugal" },
	{ id: MUSLIM, name: "Muslim", role: "Muslim", class_name: "muslim" },
]

// Player seats are distinct from powers so a future scenario can let one player
// control multiple powers without changing the rest of the data model.
data.players = [
	{ id: 0, name: "France Player", role: "France", powers: [FRANCE] },
	{ id: 1, name: "Spain Player", role: "Spain", powers: [SPAIN] },
	{ id: 2, name: "Portugal Player", role: "Portugal", powers: [PORTUGAL] },
	{ id: 3, name: "Muslim Player", role: "Muslim", powers: [MUSLIM] },
]

data.power_to_player = [
	0, // France
	1, // Spain
	2, // Portugal
	3, // Muslim
]

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

// === CARD / ACTION / EVENT TYPES ===

const CARD_EVENT = "event"
const CARD_HOME = "home"
const CARD_MANDATORY = "mandatory"
const CARD_COMBAT = "combat"
const CARD_RESPONSE = "response"
const CARD_OPS_ONLY = "ops_only"

const ACTION_PLAY_CARD_OPS = "play_card_ops"
const ACTION_PLAY_EVENT = "play_event"
const ACTION_PASS = "pass"
const ACTION_RECRUIT_UNIT = "recruit_unit"
const ACTION_MOVE_FORMATION = "move_formation"
const ACTION_FIELD_BATTLE = "field_battle"
const ACTION_SIEGE = "siege"
const ACTION_BUILD_FORTRESS = "build_fortress"
const ACTION_NAVAL_MOVE = "naval_move"
const ACTION_EXPLORE = "explore"
const ACTION_DIPLOMACY = "diplomacy"

const RELATION_WAR = -1
const RELATION_NEUTRAL = 0
const RELATION_ALLIANCE = 1
const RELATION_SELF = 2

const EVENT_SCOPE_POWER = "power"
const EVENT_SCOPE_REGION = "region"
const EVENT_SCOPE_GLOBAL = "global"

data.card_type_name = {
	[CARD_EVENT]: "Event",
	[CARD_HOME]: "Home",
	[CARD_MANDATORY]: "Mandatory",
	[CARD_COMBAT]: "Combat",
	[CARD_RESPONSE]: "Response",
	[CARD_OPS_ONLY]: "Ops Only",
}

data.atomic_actions = [
	{
		id: ACTION_PLAY_CARD_OPS,
		name: "Play Card for OP",
		common: true,
		scope: "card",
		description: "Use a card as an action point budget.",
	},
	{
		id: ACTION_PLAY_EVENT,
		name: "Play Event",
		common: true,
		scope: "card",
		description: "Resolve the event text printed on a card.",
	},
	{
		id: ACTION_PASS,
		name: "Pass",
		common: true,
		scope: "impulse",
		description: "Pass the current impulse.",
	},
	{
		id: ACTION_RECRUIT_UNIT,
		name: "Recruit Unit",
		common: true,
		scope: "power",
		description: "Spend OP to place an available unit in a controlled region.",
		costs: { [MILITIA]: 1, [REGULAR]: 2, [CAVALRY]: 3 },
	},
	{
		id: ACTION_MOVE_FORMATION,
		name: "Move Formation",
		common: true,
		scope: "formation",
		description: "Temporarily select one stack and move it one region at a time.",
	},
	{
		id: ACTION_FIELD_BATTLE,
		name: "Field Battle",
		common: true,
		scope: "region",
		description: "Resolve battle between opposing land forces in a non-fortress region.",
	},
	{
		id: ACTION_SIEGE,
		name: "Siege",
		common: true,
		scope: "region",
		description: "Resolve attack against a fortified region.",
	},
	{
		id: ACTION_BUILD_FORTRESS,
		name: "Build Fortress",
		common: false,
		scope: "region",
		description: "Build or improve a fortress marker.",
	},
	{
		id: ACTION_NAVAL_MOVE,
		name: "Naval Move",
		common: false,
		scope: "formation",
		description: "Move naval units through a legal sea connection.",
	},
	{
		id: ACTION_EXPLORE,
		name: "Explore",
		common: false,
		scope: "power",
		description: "Resolve an exploration or overseas voyage action.",
	},
	{
		id: ACTION_DIPLOMACY,
		name: "Diplomacy",
		common: false,
		scope: "power_pair",
		description: "Change relation between two powers.",
	},
]

// === REGIONS ===

// Regions are generated from hex.json. Keep hex.json as the map source of truth.
// Existing MVP semantic region names are mapped onto the nearest hex centers.
// Each region: { id, hex_id, name, type, homeland, is_port, vp, x, y }
// Connections are defined separately as an adjacency list.

data.regions = [
	{ id: 0, hex_id: "9105dc28-ac41-484e-b9da-8af8e4a81a7e", name: "Bordeaux", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1915, y: 917.86 },
	{ id: 1, hex_id: "6c827325-aa2c-41fa-9df4-2b15ff43ff67", name: "Toulouse", type: NORMAL, homeland: FRANCE, is_port: false, vp: 0, x: 2106.43, y: 966.43 },
	{ id: 2, hex_id: "0417b1d3-13cc-4b73-9f56-968e17ff62fc", name: "Bayonne", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1789.29, y: 1083.57 },
	{ id: 3, hex_id: "c9e73ed8-bcde-495d-b799-838ed251b529", name: "Perpignan", type: NORMAL, homeland: FRANCE, is_port: true, vp: 0, x: 1617.86, y: 1235 },
	{ id: 4, hex_id: "6ba165c0-4c14-4773-98d3-16d0a9b3dac3", name: "Navarre", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 1492.14, y: 1052.14 },
	{ id: 5, hex_id: "1f662d63-138d-46f3-9dfd-8a10382d37c7", name: "Aragon", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 1643.57, y: 909.29 },
	{ id: 6, hex_id: "5b269d9a-2f83-4e5d-add5-9915630e45d7", name: "Catalonia", type: STRATEGIC, homeland: SPAIN, is_port: true, vp: 1, x: 1735, y: 752.14 },
	{ id: 7, hex_id: "23c9998b-f81e-44c0-9496-351fe8a76841", name: "Hex 008", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1803.57, y: 580.71 },
	{ id: 8, hex_id: "4dde4499-4e8b-4b04-be00-3a5814493b5a", name: "Hex 009", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1577.86, y: 523.57 },
	{ id: 9, hex_id: "111cebef-060c-4c14-9fa9-98fe0b862c5a", name: "Hex 010", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1503.57, y: 292.14 },
	{ id: 10, hex_id: "8b9a29c7-b64b-496a-9dc1-6692e6547656", name: "Hex 011", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1349.29, y: 457.86 },
	{ id: 11, hex_id: "a050370d-92bb-4974-a7d3-9da34d7597c7", name: "Hex 012", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1377.86, y: 606.43 },
	{ id: 12, hex_id: "43dfb4d2-f424-4a65-a64e-7cd2ae3a36f5", name: "Hex 013", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1500.71, y: 720.71 },
	{ id: 13, hex_id: "5ef49cdb-91bf-4491-8dbf-e59da2b79249", name: "Valencia", type: KEY, homeland: SPAIN, is_port: true, vp: 2, x: 1195, y: 626.43 },
	{ id: 14, hex_id: "5945fd0e-5ef2-409f-b3eb-097449afe6a8", name: "Hex 015", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1169.29, y: 832.14 },
	{ id: 15, hex_id: "0d639ba1-76df-4a4d-bb4e-af2491c6f226", name: "Hex 016", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1343.57, y: 906.43 },
	{ id: 16, hex_id: "e4dc9052-e2ed-434f-99cc-21ab802977f4", name: "Badajoz", type: NORMAL, homeland: SPAIN, is_port: false, vp: 0, x: 1177.86, y: 1069.29 },
	{ id: 17, hex_id: "bc688f42-d2c2-4d8f-9ca5-a3c867d1a360", name: "Castille", type: KEY, homeland: SPAIN, is_port: false, vp: 2, x: 1009.29, y: 969.29 },
	{ id: 18, hex_id: "b8692445-bf68-484e-a1b3-a392e63ce6d4", name: "Galicia", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 817.86, y: 1000.71 },
	{ id: 19, hex_id: "2f7d1a8f-fb20-4e9b-80d3-aa7a4c99b3d3", name: "Algarve", type: NORMAL, homeland: PORTUGAL, is_port: true, vp: 0, x: 1003.57, y: 1169.29 },
	{ id: 20, hex_id: "e4da438e-deb4-4eb6-9d6e-9f04dbd13b02", name: "Extremadura", type: NORMAL, homeland: SPAIN, is_port: false, vp: 0, x: 840.71, y: 1277.86 },
	{ id: 21, hex_id: "4da8947f-5307-4a1c-815b-c0bdef37b34e", name: "Andalusia", type: KEY, homeland: SPAIN, is_port: true, vp: 2, x: 640.71, y: 1332.14 },
	{ id: 22, hex_id: "718d7f31-fd84-4f9a-8751-80c361ad35b6", name: "Portugal North", type: STRATEGIC, homeland: PORTUGAL, is_port: true, vp: 1, x: 760.71, y: 1446.43 },
	{ id: 23, hex_id: "209e9600-1baf-4daa-9714-512176220e1a", name: "Granada", type: KEY, homeland: MUSLIM, is_port: true, vp: 3, x: 937.86, y: 1517.86 },
	{ id: 24, hex_id: "fc17ba6f-8846-4f2e-94e1-657440a60a2a", name: "Murcia", type: STRATEGIC, homeland: SPAIN, is_port: true, vp: 1, x: 1063.57, y: 1375 },
	{ id: 25, hex_id: "b5ec7cd6-f8fd-4908-ac67-aea82c192bde", name: "Algiers", type: STRATEGIC, homeland: MUSLIM, is_port: true, vp: 1, x: 1177.86, y: 1257.86 },
	{ id: 26, hex_id: "e50bf8fd-ee81-4774-9200-d67f7112399a", name: "Mallorca", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 1403.57, y: 1229.29 },
	{ id: 27, hex_id: "64872535-a0b2-425e-bd0e-3b9d98cea77e", name: "Oran", type: NORMAL, homeland: MUSLIM, is_port: true, vp: 0, x: 1252.14, y: 1435 },
	{ id: 28, hex_id: "fd32b8be-19fb-4b6b-9c6d-397528cc6627", name: "Fez", type: KEY, homeland: MUSLIM, is_port: true, vp: 2, x: 1089.29, y: 1580.71 },
	{ id: 29, hex_id: "16a05a44-4886-4e44-b4c1-9db155d12746", name: "Tlemcen", type: STRATEGIC, homeland: MUSLIM, is_port: true, vp: 1, x: 1246.43, y: 1655 },
	{ id: 30, hex_id: "ee70e1aa-ef1a-4221-b215-9a5c96b61c65", name: "Hex 031", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1426.43, y: 1589.29 },
	{ id: 31, hex_id: "efc75746-2de5-4313-837a-4cfb5a8a9c68", name: "Hex 032", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1543.57, y: 1729.29 },
	{ id: 32, hex_id: "f2f5824d-f3b2-4f35-8ce1-46b3278d1ff2", name: "Hex 033", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1700.71, y: 1586.43 },
	{ id: 33, hex_id: "69323d1a-bbf9-49cb-8f9c-f2a203a0da6f", name: "Hex 034", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1732.14, y: 1880.71 },
	{ id: 34, hex_id: "0ff3ac19-5684-46e1-a6fc-fb58b8f5ebc5", name: "Hex 035", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1840.71, y: 1703.57 },
	{ id: 35, hex_id: "57f8f71b-c437-4181-9f7d-956863a2c591", name: "Hex 036", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2020.71, y: 1597.86 },
	{ id: 36, hex_id: "b01451e7-e692-4581-8e34-71f8dbf86260", name: "Hex 037", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2192.14, y: 1492.14 },
	{ id: 37, hex_id: "091335c5-39ef-4807-8f94-19ea3f19b4f7", name: "Hex 038", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2423.57, y: 1423.57 },
	{ id: 38, hex_id: "c197ece6-cb4c-49dc-8972-18e253d685c9", name: "Hex 039", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1980.71, y: 1837.86 },
	{ id: 39, hex_id: "6b89b94c-3cdd-40e2-8d7b-4000ec57de30", name: "Hex 040", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1875, y: 1989.29 },
	{ id: 40, hex_id: "5530577b-0565-4f0a-bd96-f17a65269c1e", name: "Hex 041", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2275, y: 1812.14 },
	{ id: 41, hex_id: "997b4100-17ce-4d2c-926d-bc20ebdcca30", name: "Hex 042", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2417.86, y: 1655 },
	{ id: 42, hex_id: "19c995fa-5dee-4e43-88f2-787b4064d412", name: "Hex 043", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2120.71, y: 1163.57 },
	{ id: 43, hex_id: "49da3b0d-087f-49ac-a27b-794f93de096c", name: "Hex 044", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2292.14, y: 1275 },
	{ id: 44, hex_id: "d08fa3dc-bf51-44e1-a4f1-4891ea65d885", name: "Hex 045", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1937.86, y: 1295 },
	{ id: 45, hex_id: "51861bf3-47c5-4c24-9878-350d85a57d4e", name: "Hex 046", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2315, y: 1086.43 },
	{ id: 46, hex_id: "7dc7b2cf-f7e3-4896-be2c-5cec9f1678c4", name: "Hex 047", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1763.57, y: 1395 },
	{ id: 47, hex_id: "cc2e78e6-865b-4eea-8875-c78ceb3295e8", name: "Sardinia", type: NORMAL, homeland: SPAIN, is_port: true, vp: 0, x: 1512.14, y: 1415 },
	{ id: 48, hex_id: "f11a4fde-4ada-4603-945e-a4f787229b99", name: "Hex 049", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1995, y: 529.29 },
	{ id: 49, hex_id: "4dd45593-8f92-4a32-b7d8-ea279e552b34", name: "Hex 050", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2009.29, y: 729.29 },
	{ id: 50, hex_id: "7b369423-6b30-4fa6-ac20-ceb131c56bf3", name: "Hex 051", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2180.71, y: 592.14 },
	{ id: 51, hex_id: "e9d19c36-f1e6-4103-8e70-e7c18a5c0998", name: "Hex 052", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2220.71, y: 792.14 },
	{ id: 52, hex_id: "21dcc732-3f95-47f0-937f-aa11f3891be7", name: "Hex 053", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2343.57, y: 923.57 },
	{ id: 53, hex_id: "6f656aa5-0951-4036-b51a-be450b610600", name: "Hex 054", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2420.71, y: 752.14 },
	{ id: 54, hex_id: "b0783ecb-712a-4ce0-85e7-6eddcc86b4e4", name: "Hex 055", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2406.43, y: 577.86 },
	{ id: 55, hex_id: "b8d4613b-0c34-4f94-a4d0-3b0596266390", name: "Hex 056", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2520.71, y: 1060.71 },
	{ id: 56, hex_id: "b16c5c6e-2073-4cf0-9e8e-d657aee8e25a", name: "Hex 057", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2700.71, y: 1112.14 },
	{ id: 57, hex_id: "d6ac627d-89e8-427a-9c4d-c6515aab383e", name: "Hex 058", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2600.71, y: 1300.71 },
	{ id: 58, hex_id: "45355ce9-2a81-4fa0-a00f-63166149eb86", name: "Hex 059", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2840.71, y: 1257.86 },
	{ id: 59, hex_id: "94aae20b-8335-4782-8310-4595957607d9", name: "Hex 060", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3015, y: 1177.86 },
	{ id: 60, hex_id: "2b854896-a684-4b2c-aa3f-514efa724322", name: "Hex 061", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2752.14, y: 1515 },
	{ id: 61, hex_id: "24a345b1-60fc-443f-9d0b-efe154896e14", name: "Hex 062", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2849.29, y: 1026.43 },
	{ id: 62, hex_id: "2a93d76f-25db-4085-ba59-bcf08d50d437", name: "Hex 063", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3046.43, y: 1003.57 },
	{ id: 63, hex_id: "625b17a2-c3a1-48b5-9310-fa154dd2fa6f", name: "Hex 064", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2703.57, y: 892.14 },
	{ id: 64, hex_id: "d8947865-c90b-4ff2-b4e8-0b8218c3029a", name: "Hex 065", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2526.43, y: 889.29 },
	{ id: 65, hex_id: "0eb7b766-f922-475b-bbfe-8bd3825cc8b3", name: "Hex 066", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2657.86, y: 672.14 },
	{ id: 66, hex_id: "3bec41eb-d6c4-42e6-986f-a0ab6fc4c83d", name: "Hex 067", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2589.29, y: 500.71 },
	{ id: 67, hex_id: "60e7e7f0-592f-4015-ab1b-674457caca25", name: "Hex 068", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2660.71, y: 340.71 },
	{ id: 68, hex_id: "dc130b2a-e69e-4f7d-b55d-47b0de40c800", name: "Hex 069", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2683.57, y: 163.57 },
	{ id: 69, hex_id: "555abad1-6229-4a16-bfaf-8ceddc79286f", name: "Hex 070", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2932.14, y: 209.29 },
	{ id: 70, hex_id: "30987bf2-10f6-4e79-a526-1d7a28a24025", name: "Hex 071", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2792.14, y: 435 },
	{ id: 71, hex_id: "411a5244-bd7e-4f38-b39d-d94870aad59c", name: "Hex 072", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2909.29, y: 603.57 },
	{ id: 72, hex_id: "4776abf8-07d4-44fe-aac6-e560058a0ca6", name: "Hex 073", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2826.43, y: 752.14 },
	{ id: 73, hex_id: "8d3127ef-2dbe-4100-bb69-70423a728a7e", name: "Hex 074", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3163.57, y: 646.43 },
	{ id: 74, hex_id: "8810930e-103c-4a9d-bab0-64c501957dcc", name: "Hex 075", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3157.86, y: 846.43 },
	{ id: 75, hex_id: "47318dc0-e06e-4032-b83c-a290e0bedc1a", name: "Hex 076", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2977.86, y: 832.14 },
	{ id: 76, hex_id: "dcb39599-32f8-4303-87dc-01e2e27a9748", name: "Hex 077", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3240.71, y: 1049.29 },
	{ id: 77, hex_id: "f377eeb4-dbb1-44ac-b72a-9676f29468bf", name: "Hex 078", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3415, y: 1083.57 },
	{ id: 78, hex_id: "e8dd5805-52e7-4283-85c8-a065b5ff2de5", name: "Hex 079", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3395, y: 875 },
	{ id: 79, hex_id: "7ebaa358-5ac7-4352-802d-fa671837ea65", name: "Hex 080", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3432.14, y: 569.29 },
	{ id: 80, hex_id: "778c560b-6b87-46c2-9dae-a9ab0934a0ef", name: "Hex 081", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3295, y: 423.57 },
	{ id: 81, hex_id: "cf43a5f2-7345-4f01-9285-51e75da126f2", name: "Hex 082", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3063.57, y: 432.14 },
	{ id: 82, hex_id: "3992da37-49c7-4031-aeda-2612728eafcf", name: "Hex 083", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3146.43, y: 203.57 },
	{ id: 83, hex_id: "9639b132-2df7-44f3-9a1a-6797ad9ed7e9", name: "Hex 084", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3446.43, y: 306.43 },
	{ id: 84, hex_id: "70cd980d-8e9d-4df0-a223-c96cb3528f49", name: "Hex 085", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3643.57, y: 409.29 },
	{ id: 85, hex_id: "0f768cd3-74d9-47eb-923a-b61b55ae23e5", name: "Hex 086", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3700.71, y: 163.57 },
	{ id: 86, hex_id: "1a659397-ddac-4c79-af1a-64e49a188020", name: "Hex 087", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3389.29, y: 77.86 },
	{ id: 87, hex_id: "39c8cb93-21d3-4bb3-b689-a2bcb284629b", name: "Hex 088", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3895, y: 486.43 },
	{ id: 88, hex_id: "be37c7fc-15b4-4d61-aeed-55f45c52ef7b", name: "Hex 089", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3797.86, y: 709.29 },
	{ id: 89, hex_id: "a21f579f-2016-4366-814c-d081ab093171", name: "Hex 090", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3615, y: 757.86 },
	{ id: 90, hex_id: "6f2d698a-8326-44bd-8cc2-42ceb8f35aae", name: "Hex 091", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3617.86, y: 1015 },
	{ id: 91, hex_id: "49afa552-f814-42e0-9c16-aa942953778e", name: "Hex 092", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3803.57, y: 886.43 },
	{ id: 92, hex_id: "3a49a948-050b-47a5-aae6-05489b33e335", name: "Hex 093", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3752.14, y: 1249.29 },
	{ id: 93, hex_id: "1be83ae1-c88a-4ce9-950d-419cdc3b57b3", name: "Hex 094", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4006.43, y: 1080.71 },
	{ id: 94, hex_id: "08b522af-281f-44b6-b550-07e10462882c", name: "Hex 095", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4009.29, y: 889.29 },
	{ id: 95, hex_id: "ca31b137-3217-4a1f-8a9b-479f1843a27a", name: "Hex 096", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4112.14, y: 1209.29 },
	{ id: 96, hex_id: "88271550-02da-40e8-b15c-b0bed63425de", name: "Hex 097", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4317.86, y: 1083.57 },
	{ id: 97, hex_id: "91566a50-4133-484d-b8ab-33cdf0d7dd5e", name: "Hex 098", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4206.43, y: 949.29 },
	{ id: 98, hex_id: "90e28416-a7de-4d57-b1b5-8c6acd63edb9", name: "Hex 099", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4183.57, y: 780.71 },
	{ id: 99, hex_id: "0f041c89-4675-4557-b5ea-7b6bee8e44ee", name: "Hex 100", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4006.43, y: 672.14 },
	{ id: 100, hex_id: "cdc51b09-26ce-4ce4-b9b3-4e8f4c6be626", name: "Hex 101", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4120.71, y: 543.57 },
	{ id: 101, hex_id: "452399e1-49c3-4897-836f-b0d339e32bd3", name: "Hex 102", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4295, y: 580.71 },
	{ id: 102, hex_id: "54fd35af-96d4-4086-96b0-f940b9905219", name: "Hex 103", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4403.57, y: 792.14 },
	{ id: 103, hex_id: "9a5e9b1c-3ce8-48a7-8531-56b48894d2a0", name: "Hex 104", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4569.29, y: 915 },
	{ id: 104, hex_id: "08446eeb-a305-4258-9743-21b9536b6345", name: "Hex 105", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4772.14, y: 1063.57 },
	{ id: 105, hex_id: "5f5df8ee-7e8c-4465-a37e-e0b4aa2ea3d9", name: "Hex 106", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4949.29, y: 1203.57 },
	{ id: 106, hex_id: "51e1b4ea-c5e1-4c1e-b620-a9be224201d7", name: "Hex 107", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4412.14, y: 1269.29 },
	{ id: 107, hex_id: "58289901-f714-43c3-87dc-2346585afecf", name: "Hex 108", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4220.71, y: 1377.86 },
	{ id: 108, hex_id: "114098ee-4fdc-4509-96ed-7b20904305ff", name: "Hex 109", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4212.14, y: 1566.43 },
	{ id: 109, hex_id: "99cdafe8-1f0e-48cb-94cb-bbc296e65714", name: "Hex 110", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4457.86, y: 1449.29 },
	{ id: 110, hex_id: "4da4ec0d-92d1-4875-a9fa-19dd16b370f6", name: "Hex 111", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4689.29, y: 1449.29 },
	{ id: 111, hex_id: "a9ebdf1c-4e29-457b-8553-0fcb546e3129", name: "Hex 112", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4583.57, y: 1600.71 },
	{ id: 112, hex_id: "4870249d-befb-4950-a98c-a27acd404709", name: "Hex 113", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4375, y: 1677.86 },
	{ id: 113, hex_id: "a82e665b-f484-41de-bf7b-c66b21a91017", name: "Hex 114", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4506.43, y: 1832.14 },
	{ id: 114, hex_id: "8572125a-bf05-48d4-9af9-9d1f74fb2497", name: "Hex 115", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4732.14, y: 1877.86 },
	{ id: 115, hex_id: "25d89d36-24ee-44a9-8af5-f733d598302c", name: "Hex 116", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4755, y: 1692.14 },
	{ id: 116, hex_id: "230642b2-c952-48a8-945f-e9002ca986af", name: "Hex 117", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4929.29, y: 1643.57 },
	{ id: 117, hex_id: "02017f9d-f8ed-40e3-ab50-f09f67b13da0", name: "Hex 118", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4897.86, y: 1803.57 },
	{ id: 118, hex_id: "7694a952-a692-488e-9565-f46a2e20ddac", name: "Hex 119", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 5075, y: 1869.29 },
	{ id: 119, hex_id: "a5ba283d-a9d4-42f0-9a0a-0a6c08d2b630", name: "Hex 120", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4717.86, y: 2026.43 },
	{ id: 120, hex_id: "85bf96e6-3fd6-4c35-b92e-5c49db7c5724", name: "Hex 121", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4566.43, y: 2103.57 },
	{ id: 121, hex_id: "d7fced96-7ab4-461d-ab37-f8bf43e89684", name: "Hex 122", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4477.86, y: 2309.29 },
	{ id: 122, hex_id: "d3117e05-f27d-48fa-95b7-18ef480713b4", name: "Hex 123", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4317.86, y: 2189.29 },
	{ id: 123, hex_id: "fb1896c5-469b-4879-9571-97373eb5351d", name: "Hex 124", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4166.43, y: 2052.14 },
	{ id: 124, hex_id: "6ec5ae84-cf7b-4294-a392-5267a333a3f4", name: "Hex 125", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3832.14, y: 2277.86 },
	{ id: 125, hex_id: "4083369d-c8e3-4e53-a10c-8de7856c2407", name: "Hex 126", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3652.14, y: 2146.43 },
	{ id: 126, hex_id: "ec1b8f24-456a-4dc6-a6c1-b4ab90ee274f", name: "Hex 127", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3503.57, y: 2343.57 },
	{ id: 127, hex_id: "410acb1e-20d7-40f9-a0aa-b22511d4be8a", name: "Hex 128", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3275, y: 2266.43 },
	{ id: 128, hex_id: "5f6136fd-6f01-4853-8b47-7029f6cdde1b", name: "Hex 129", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3197.86, y: 2129.29 },
	{ id: 129, hex_id: "c94850bf-0a0f-41ff-880d-c1c14769c6d7", name: "Hex 130", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2920.71, y: 2123.57 },
	{ id: 130, hex_id: "03460c32-bef2-4b66-bdfa-0fb38c21bda7", name: "Hex 131", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2729.29, y: 2272.14 },
	{ id: 131, hex_id: "30436350-991c-404c-ba89-ee055e1f3da0", name: "Hex 132", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2497.86, y: 2183.57 },
	{ id: 132, hex_id: "03903e19-80ae-4ed9-9c11-e9efddd63043", name: "Hex 133", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2277.86, y: 2337.86 },
	{ id: 133, hex_id: "b472d2d8-2d39-4cf5-a3b4-108df1226ca4", name: "Hex 134", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2023.57, y: 2246.43 },
	{ id: 134, hex_id: "be10ef09-7d2c-4c69-9216-eea61b2cd668", name: "Hex 135", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1812.14, y: 2377.86 },
	{ id: 135, hex_id: "8a955d82-ed81-40f1-bac6-5c48340a6385", name: "Hex 136", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1532.14, y: 2435 },
	{ id: 136, hex_id: "594bcb6e-3209-4018-b7c8-0e46e453f9d0", name: "Hex 137", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1429.29, y: 2272.14 },
	{ id: 137, hex_id: "4c9aa788-0068-4243-a647-8ff176e7b21a", name: "Hex 138", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1186.43, y: 2066.43 },
	{ id: 138, hex_id: "fc81db81-57a9-4f2c-998e-20d9da601d79", name: "Hex 139", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 995, y: 2066.43 },
	{ id: 139, hex_id: "767391ad-a9bf-476b-87c1-a5b587ec7a0e", name: "Hex 140", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1183.57, y: 1883.57 },
	{ id: 140, hex_id: "2832d646-cca4-41b6-8d92-97d88e26f8d2", name: "Hex 141", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1335, y: 1809.29 },
	{ id: 141, hex_id: "c4b6c7fb-37cc-41fc-bc4b-7d0b13778eff", name: "Hex 142", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1497.86, y: 1906.43 },
	{ id: 142, hex_id: "c02ce9dd-03eb-4ffe-b24a-71d8e97e9cf4", name: "Hex 143", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1092.14, y: 2203.57 },
	{ id: 143, hex_id: "d9950e9c-051e-44c3-bf21-867e4116e733", name: "Hex 144", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1212.14, y: 2426.43 },
	{ id: 144, hex_id: "78645455-1049-4c3b-bbaa-ea364560874c", name: "Hex 145", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1023.57, y: 2695 },
	{ id: 145, hex_id: "96fa2d00-2437-4c2b-8a89-4aa2678b8b6b", name: "Hex 146", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 946.43, y: 2400.71 },
	{ id: 146, hex_id: "0983e23e-8c8a-4085-ae0c-5c962098b655", name: "Hex 147", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 837.86, y: 2195 },
	{ id: 147, hex_id: "4a25eb1c-f4af-446f-8fac-f805d435dbe3", name: "Hex 148", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 700.71, y: 2392.14 },
	{ id: 148, hex_id: "4c433406-6940-49b2-a454-818fde453293", name: "Hex 149", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 546.43, y: 2566.43 },
	{ id: 149, hex_id: "adfcb405-de0d-4c72-a560-7db1f68bb58a", name: "Hex 150", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 740.71, y: 2783.57 },
	{ id: 150, hex_id: "3f66f813-5b45-4417-a469-5778863c2fc9", name: "Hex 151", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 886.43, y: 3063.57 },
	{ id: 151, hex_id: "9e323524-9a11-4532-896d-0473f7e8f01a", name: "Hex 152", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 677.86, y: 3177.86 },
	{ id: 152, hex_id: "caa004f1-c1db-4508-8e18-87eec251fe0f", name: "Hex 153", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 409.29, y: 2752.14 },
	{ id: 153, hex_id: "7b1471fb-cb44-4b56-a508-0cc0cd025bb2", name: "Hex 154", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 306.43, y: 2966.43 },
	{ id: 154, hex_id: "3e963651-e2d3-4026-b407-c650edcff3c5", name: "Hex 155", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 237.86, y: 3212.14 },
	{ id: 155, hex_id: "8c5b998c-babd-44b1-9f87-03c2f13d2cbb", name: "Hex 156", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3663.57, y: 1483.57 },
	{ id: 156, hex_id: "a970f08e-20b0-46e9-bb40-69f3abdeaf86", name: "Hex 157", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3640.71, y: 1706.43 },
	{ id: 157, hex_id: "b6455503-a68a-441d-b202-09b3233aadf9", name: "Lisbon", type: KEY, homeland: PORTUGAL, is_port: true, vp: 3, x: 549.29, y: 1669.29 },
	{ id: 158, hex_id: "184147cd-2568-4138-a7c2-c5bdead98dc7", name: "Leon", type: STRATEGIC, homeland: SPAIN, is_port: false, vp: 1, x: 737.86, y: 552.14 },
	{ id: 159, hex_id: "3f74088d-3cc8-43a2-b65f-169bd90fadd4", name: "Hex 160", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2003.57, y: 297.86 },
	{ id: 160, hex_id: "15d0dd60-44b5-453f-a552-028b551ebbd2", name: "Hex 161", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3332.14, y: 1309.29 },
	{ id: 161, hex_id: "1545f304-57db-40aa-9a86-a33159ec8df4", name: "Hex 162", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 200.71, y: 2558.43 },
	{ id: 162, hex_id: "b2768f89-f212-43c9-9f9f-e56d9a7efe53", name: "Hex 163", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1789.29, y: 2155.57 },
	{ id: 163, hex_id: "3468feb9-5a25-455b-82bd-196958ea3fd4", name: "Hex 164", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3083.57, y: 1858.43 },
	{ id: 164, hex_id: "7937bd5a-1399-46c4-b6a7-8c83ccd87eee", name: "Hex 165", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4052.14, y: 1687 },
	{ id: 165, hex_id: "10cd71c0-427b-4adb-999d-7e1337e1302d", name: "Hex 166", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 5002.43, y: 1429.86 },
	{ id: 166, hex_id: "364aa271-1668-4b4d-9f73-de83ad48fbeb", name: "Hex 167", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3159.57, y: 2492.71 },
	{ id: 167, hex_id: "e9768620-1bbd-4371-86d2-22a80bf3b65a", name: "Hex 168", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3411, y: 2772.71 },
	{ id: 168, hex_id: "05b1ceb5-c1a8-4eb0-8f4a-ebc027b63790", name: "Hex 169", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3428.14, y: 2984.14 },
	{ id: 169, hex_id: "2a923482-4474-48b2-8507-c840041796bc", name: "Hex 170", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3665.29, y: 3309.86 },
	{ id: 170, hex_id: "64e261fe-ba92-4d7e-95a3-49f2caae1904", name: "Hex 171", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3245.29, y: 3321.29 },
	{ id: 171, hex_id: "9de7595f-9002-4861-a36f-85e0cdb3e3fe", name: "Hex 172", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3033.86, y: 2784.14 },
	{ id: 172, hex_id: "8e0435fc-495b-4bcd-84d8-ba2e8fa95234", name: "Hex 173", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2719.57, y: 2818.43 },
	{ id: 173, hex_id: "f6bb9ad1-0754-4d8f-8974-03918af03df8", name: "Hex 174", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2848.14, y: 3081.29 },
	{ id: 174, hex_id: "14da4511-2472-4c98-875b-bce40014bcab", name: "Hex 175", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4265.29, y: 3269.86 },
	{ id: 175, hex_id: "284e8130-66ba-4770-92e4-e4c8072da7ba", name: "Hex 176", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4571, y: 3012.71 },
	{ id: 176, hex_id: "12981537-90d5-45e6-ba49-e16698b862e8", name: "Hex 177", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 5136.71, y: 2932.71 },
	{ id: 177, hex_id: "6c4b5b6e-0544-41fe-adfc-bfdadd2f1804", name: "Hex 178", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2739.57, y: 3298.43 },
	{ id: 178, hex_id: "05549f1f-04e9-491f-9786-a1faaa0a41a3", name: "Hex 179", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2688.14, y: 3158.43 },
	{ id: 179, hex_id: "14b26e61-d869-44f2-a368-8eeebef5a720", name: "Hex 180", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2636.71, y: 2989.86 },
	{ id: 180, hex_id: "bfce850e-fb0c-4278-959b-d4e795bab3c2", name: "Hex 181", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2539.57, y: 2741.29 },
	{ id: 181, hex_id: "06298dff-1e4d-403a-bc57-72f0728b536f", name: "Hex 182", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2633.86, y: 2612.71 },
	{ id: 182, hex_id: "e3890d31-cc70-4d4d-b166-4798f2ddf524", name: "Hex 183", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2776.71, y: 2692.71 },
	{ id: 183, hex_id: "9b484cec-08b5-4625-a4a3-57291e08ba52", name: "Hex 184", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3425.29, y: 2629.86 },
	{ id: 184, hex_id: "5dd5f765-550f-4ee2-a9c2-85763d715957", name: "Hex 185", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3611, y: 2681.29 },
	{ id: 185, hex_id: "28d7721b-cdb1-4acc-b935-d5d33b66e257", name: "Hex 186", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3271, y: 2821.29 },
	{ id: 186, hex_id: "1822015f-7259-4cdb-ad88-29c944ef1d67", name: "Hex 187", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3588.14, y: 2955.57 },
	{ id: 187, hex_id: "2a3bd6d1-1054-4858-91ec-ac0a9a310b07", name: "Hex 188", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3845.29, y: 2901.29 },
	{ id: 188, hex_id: "20a17881-434b-4e7b-97b9-01eb7d402332", name: "Hex 189", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3811, y: 2769.86 },
	{ id: 189, hex_id: "bc1f8f2b-3690-473c-8bf6-1b8f9cd04284", name: "Hex 190", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3865.29, y: 3104.14 },
	{ id: 190, hex_id: "8996a032-efbe-4907-895f-5ea610a1911b", name: "Hex 191", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3656.71, y: 3127 },
	{ id: 191, hex_id: "c9f54bf8-c940-44c4-a5ea-6c641cd3939d", name: "Hex 192", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 3893.86, y: 3247 },
	{ id: 192, hex_id: "5b6395f7-c14b-4e0f-a92e-1fb3a861678d", name: "Hex 193", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4056.71, y: 3064.14 },
	{ id: 193, hex_id: "a7439bb0-ee46-4105-9bff-861bc9b91265", name: "Hex 194", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4182.43, y: 2789.86 },
	{ id: 194, hex_id: "ca7fef44-d539-445b-a7e1-00813b53cb5a", name: "Hex 195", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4271, y: 2998.43 },
	{ id: 195, hex_id: "f6b6c7fd-8588-4e2c-9d4e-0bfcce774473", name: "Hex 196", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4516.71, y: 2852.71 },
	{ id: 196, hex_id: "e39fd54c-6ad6-4021-a9d5-30a32d8f90d7", name: "Hex 197", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4499.57, y: 2655.57 },
	{ id: 197, hex_id: "0cb44b0d-b39d-452a-b067-cc0dabf53ae3", name: "Hex 198", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4696.71, y: 3067 },
	{ id: 198, hex_id: "0b04885d-d692-45c4-be6c-3567f43e332b", name: "Hex 199", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 4876.71, y: 2909.86 },
	{ id: 199, hex_id: "30e90233-fdef-4931-9c3a-2b6ae35c53a7", name: "Hex 200", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 5002.43, y: 2692.71 },
	{ id: 200, hex_id: "2cd4ae4f-04d5-4795-83c5-78f17047b1f4", name: "Hex 201", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 5002.43, y: 3132.71 },
	{ id: 201, hex_id: "4e7c7013-3c58-424d-970a-f01e17a926f8", name: "Hex 202", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1543.57, y: 2675.57 },
	{ id: 202, hex_id: "2586de1a-c449-495d-a533-04199e8c82ac", name: "Hex 203", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1706.43, y: 2769.86 },
	{ id: 203, hex_id: "88b27831-1a99-415b-afbd-2eccb70fdf6d", name: "Hex 204", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1869.29, y: 2667 },
	{ id: 204, hex_id: "e390bde9-f115-4ec2-b17e-ed2b8a267d03", name: "Hex 205", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1943.57, y: 2827 },
	{ id: 205, hex_id: "f1be71b9-f3f5-454f-b7c9-42587735e338", name: "Hex 206", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1817.86, y: 2944.14 },
	{ id: 206, hex_id: "790e9f61-3c12-43d9-b46e-087509a27e37", name: "Hex 207", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1560.71, y: 3047 },
	{ id: 207, hex_id: "c59ae0aa-bfd0-451d-8ce0-45eca442e824", name: "Hex 208", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1472.14, y: 3218.43 },
	{ id: 208, hex_id: "3639617e-8c98-442e-aa45-d07d3fe99300", name: "Hex 209", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1789.29, y: 3158.43 },
	{ id: 209, hex_id: "90496f46-1d25-485b-97cc-ca1af9ad8c1b", name: "Hex 210", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 1992.14, y: 3201.29 },
	{ id: 210, hex_id: "3a5a3ce0-96c8-402c-abba-deb737b3a019", name: "Hex 211", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2052.14, y: 2969.86 },
	{ id: 211, hex_id: "9e720439-5166-41fe-afee-a45e02cb4e2a", name: "Hex 212", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2232.14, y: 2887 },
	{ id: 212, hex_id: "d13dc964-6297-42de-b6e8-b9ec22e032c8", name: "Hex 213", type: NORMAL, homeland: null, is_port: false, vp: 0, x: 2217.86, y: 2678.43 },
]

// Adjacency list: region index -> [connected region indices]
data.adjacency = [
	/*   0 9105dc28-ac41-484e-b9da-8af8e4a81a7e */ [2, 5, 6, 49],
	/*   1 6c827325-aa2c-41fa-9df4-2b15ff43ff67 */ [42, 45, 51],
	/*   2 0417b1d3-13cc-4b73-9f56-968e17ff62fc */ [0, 3, 4, 5, 44],
	/*   3 c9e73ed8-bcde-495d-b799-838ed251b529 */ [2, 4, 26, 46],
	/*   4 6ba165c0-4c14-4773-98d3-16d0a9b3dac3 */ [2, 3, 5, 15, 25],
	/*   5 1f662d63-138d-46f3-9dfd-8a10382d37c7 */ [0, 2, 4, 6, 15],
	/*   6 5b269d9a-2f83-4e5d-add5-9915630e45d7 */ [0, 5, 7, 12, 49],
	/*   7 23c9998b-f81e-44c0-9496-351fe8a76841 */ [6, 8, 48, 49],
	/*   8 4dde4499-4e8b-4b04-be00-3a5814493b5a */ [7, 9, 10, 12],
	/*   9 111cebef-060c-4c14-9fa9-98fe0b862c5a */ [8, 48, 158, 159],
	/*  10 8b9a29c7-b64b-496a-9dc1-6692e6547656 */ [8, 11, 158],
	/*  11 a050370d-92bb-4974-a7d3-9da34d7597c7 */ [10, 12, 13],
	/*  12 43dfb4d2-f424-4a65-a64e-7cd2ae3a36f5 */ [6, 8, 11, 15],
	/*  13 5ef49cdb-91bf-4491-8dbf-e59da2b79249 */ [11, 14, 158],
	/*  14 5945fd0e-5ef2-409f-b3eb-097449afe6a8 */ [13, 15, 17, 18],
	/*  15 0d639ba1-76df-4a4d-bb4e-af2491c6f226 */ [4, 5, 12, 14, 16],
	/*  16 e4dc9052-e2ed-434f-99cc-21ab802977f4 */ [15, 17, 25],
	/*  17 bc688f42-d2c2-4d8f-9ca5-a3c867d1a360 */ [14, 16, 18, 19, 20],
	/*  18 b8692445-bf68-484e-a1b3-a392e63ce6d4 */ [14, 17, 157, 158],
	/*  19 2f7d1a8f-fb20-4e9b-80d3-aa7a4c99b3d3 */ [17, 20, 24, 25],
	/*  20 e4da438e-deb4-4eb6-9d6e-9f04dbd13b02 */ [17, 19, 21],
	/*  21 4da8947f-5307-4a1c-815b-c0bdef37b34e */ [20, 22, 157],
	/*  22 718d7f31-fd84-4f9a-8751-80c361ad35b6 */ [21, 23, 157],
	/*  23 209e9600-1baf-4daa-9714-512176220e1a */ [22, 24, 27, 28, 157],
	/*  24 fc17ba6f-8846-4f2e-94e1-657440a60a2a */ [19, 23, 25, 26, 27],
	/*  25 b5ec7cd6-f8fd-4908-ac67-aea82c192bde */ [4, 16, 19, 24, 26],
	/*  26 e50bf8fd-ee81-4774-9200-d67f7112399a */ [3, 24, 25, 46],
	/*  27 64872535-a0b2-425e-bd0e-3b9d98cea77e */ [23, 24, 28, 30, 47],
	/*  28 fd32b8be-19fb-4b6b-9c6d-397528cc6627 */ [23, 27, 29, 139, 157],
	/*  29 16a05a44-4886-4e44-b4c1-9db155d12746 */ [28, 30],
	/*  30 ee70e1aa-ef1a-4221-b215-9a5c96b61c65 */ [27, 29, 31, 32],
	/*  31 efc75746-2de5-4313-837a-4cfb5a8a9c68 */ [30, 32, 33, 141],
	/*  32 f2f5824d-f3b2-4f35-8ce1-46b3278d1ff2 */ [30, 31, 33, 35, 47],
	/*  33 69323d1a-bbf9-49cb-8f9c-f2a203a0da6f */ [31, 32, 34, 39],
	/*  34 0ff3ac19-5684-46e1-a6fc-fb58b8f5ebc5 */ [33, 35, 38],
	/*  35 57f8f71b-c437-4181-9f7d-956863a2c591 */ [32, 34, 36, 38, 46],
	/*  36 b01451e7-e692-4581-8e34-71f8dbf86260 */ [35, 40, 43, 44],
	/*  37 091335c5-39ef-4807-8f94-19ea3f19b4f7 */ [41, 43, 57],
	/*  38 c197ece6-cb4c-49dc-8972-18e253d685c9 */ [34, 35, 39, 40],
	/*  39 6b89b94c-3cdd-40e2-8d7b-4000ec57de30 */ [33, 38, 162],
	/*  40 5530577b-0565-4f0a-bd96-f17a65269c1e */ [36, 38, 41, 162, 163],
	/*  41 997b4100-17ce-4d2c-926d-bc20ebdcca30 */ [37, 40, 60, 160, 163],
	/*  42 19c995fa-5dee-4e43-88f2-787b4064d412 */ [1, 43, 44, 45],
	/*  43 49da3b0d-087f-49ac-a27b-794f93de096c */ [36, 37, 42, 44, 45],
	/*  44 d08fa3dc-bf51-44e1-a4f1-4891ea65d885 */ [2, 36, 42, 43, 46],
	/*  45 51861bf3-47c5-4c24-9878-350d85a57d4e */ [1, 42, 43, 52, 55, 57, 64],
	/*  46 7dc7b2cf-f7e3-4896-be2c-5cec9f1678c4 */ [3, 26, 35, 44, 47],
	/*  47 cc2e78e6-865b-4eea-8875-c78ceb3295e8 */ [27, 32, 46],
	/*  48 f11a4fde-4ada-4603-945e-a4f787229b99 */ [7, 9, 49, 50, 159],
	/*  49 4dd45593-8f92-4a32-b7d8-ea279e552b34 */ [0, 6, 7, 48, 50, 51],
	/*  50 7b369423-6b30-4fa6-ac20-ceb131c56bf3 */ [48, 49, 51, 159],
	/*  51 e9d19c36-f1e6-4103-8e70-e7c18a5c0998 */ [1, 49, 50, 52, 54],
	/*  52 21dcc732-3f95-47f0-937f-aa11f3891be7 */ [45, 51, 53],
	/*  53 6f656aa5-0951-4036-b51a-be450b610600 */ [52, 54, 65],
	/*  54 b0783ecb-712a-4ce0-85e7-6eddcc86b4e4 */ [51, 53, 66, 159],
	/*  55 b8d4613b-0c34-4f94-a4d0-3b0596266390 */ [45, 56, 63, 64],
	/*  56 b16c5c6e-2073-4cf0-9e8e-d657aee8e25a */ [55, 57, 58, 61, 63],
	/*  57 d6ac627d-89e8-427a-9c4d-c6515aab383e */ [37, 45, 56, 58, 160],
	/*  58 45355ce9-2a81-4fa0-a00f-63166149eb86 */ [56, 57, 59, 160],
	/*  59 94aae20b-8335-4782-8310-4595957607d9 */ [58, 61, 62, 160],
	/*  60 2b854896-a684-4b2c-aa3f-514efa724322 */ [41, 160, 163],
	/*  61 24a345b1-60fc-443f-9d0b-efe154896e14 */ [56, 59, 62, 63],
	/*  62 2a93d76f-25db-4085-ba59-bcf08d50d437 */ [59, 61, 74, 160],
	/*  63 625b17a2-c3a1-48b5-9310-fa154dd2fa6f */ [55, 56, 61, 75],
	/*  64 d8947865-c90b-4ff2-b4e8-0b8218c3029a */ [45, 55, 65],
	/*  65 0eb7b766-f922-475b-bbfe-8bd3825cc8b3 */ [53, 64, 71],
	/*  66 3bec41eb-d6c4-42e6-986f-a0ab6fc4c83d */ [54, 70, 71, 159],
	/*  67 60e7e7f0-592f-4015-ab1b-674457caca25 */ [69, 70, 159],
	/*  68 dc130b2a-e69e-4f7d-b55d-47b0de40c800 */ [69, 159],
	/*  69 555abad1-6229-4a16-bfaf-8ceddc79286f */ [67, 68, 81, 82],
	/*  70 30987bf2-10f6-4e79-a526-1d7a28a24025 */ [66, 67, 71],
	/*  71 411a5244-bd7e-4f38-b39d-d94870aad59c */ [65, 66, 70, 72, 81],
	/*  72 4776abf8-07d4-44fe-aac6-e560058a0ca6 */ [71, 73],
	/*  73 8d3127ef-2dbe-4100-bb69-70423a728a7e */ [72, 79, 81],
	/*  74 8810930e-103c-4a9d-bab0-64c501957dcc */ [62, 75, 76],
	/*  75 47318dc0-e06e-4032-b83c-a290e0bedc1a */ [63, 74],
	/*  76 dcb39599-32f8-4303-87dc-01e2e27a9748 */ [74, 78, 160],
	/*  77 f377eeb4-dbb1-44ac-b72a-9676f29468bf */ [78, 90, 160],
	/*  78 e8dd5805-52e7-4283-85c8-a065b5ff2de5 */ [76, 77, 79],
	/*  79 7ebaa358-5ac7-4352-802d-fa671837ea65 */ [73, 78, 80, 84, 89],
	/*  80 778c560b-6b87-46c2-9dae-a9ab0934a0ef */ [79, 81, 83],
	/*  81 cf43a5f2-7345-4f01-9285-51e75da126f2 */ [69, 71, 73, 80],
	/*  82 3992da37-49c7-4031-aeda-2612728eafcf */ [69, 83, 86],
	/*  83 9639b132-2df7-44f3-9a1a-6797ad9ed7e9 */ [80, 82, 84],
	/*  84 70cd980d-8e9d-4df0-a223-c96cb3528f49 */ [79, 83, 85, 86],
	/*  85 0f768cd3-74d9-47eb-923a-b61b55ae23e5 */ [84, 86],
	/*  86 1a659397-ddac-4c79-af1a-64e49a188020 */ [82, 84, 85],
	/*  87 39c8cb93-21d3-4bb3-b689-a2bcb284629b */ [88, 99, 100],
	/*  88 be37c7fc-15b4-4d61-aeed-55f45c52ef7b */ [87, 89, 91, 99],
	/*  89 a21f579f-2016-4366-814c-d081ab093171 */ [79, 88],
	/*  90 6f2d698a-8326-44bd-8cc2-42ceb8f35aae */ [77, 91, 160],
	/*  91 49afa552-f814-42e0-9c16-aa942953778e */ [88, 90, 94, 99, 160, 164],
	/*  92 3a49a948-050b-47a5-aae6-05489b33e335 */ [155, 160, 164],
	/*  93 1be83ae1-c88a-4ce9-950d-419cdc3b57b3 */ [94, 95, 97, 164],
	/*  94 08b522af-281f-44b6-b550-07e10462882c */ [91, 93, 98, 99],
	/*  95 ca31b137-3217-4a1f-8a9b-479f1843a27a */ [93, 107],
	/*  96 88271550-02da-40e8-b15c-b0bed63425de */ [97, 106, 165],
	/*  97 91566a50-4133-484d-b8ab-33cdf0d7dd5e */ [93, 96, 98, 102],
	/*  98 90e28416-a7de-4d57-b1b5-8c6acd63edb9 */ [94, 97, 101],
	/*  99 0f041c89-4675-4557-b5ea-7b6bee8e44ee */ [87, 88, 91, 94, 101],
	/* 100 cdc51b09-26ce-4ce4-b9b3-4e8f4c6be626 */ [87, 101],
	/* 101 452399e1-49c3-4897-836f-b0d339e32bd3 */ [98, 99, 100, 102, 103],
	/* 102 54fd35af-96d4-4086-96b0-f940b9905219 */ [97, 101, 103, 165],
	/* 103 9a5e9b1c-3ce8-48a7-8531-56b48894d2a0 */ [101, 102, 165],
	/* 104 08446eeb-a305-4258-9743-21b9536b6345 */ [105, 165],
	/* 105 5f5df8ee-7e8c-4465-a37e-e0b4aa2ea3d9 */ [104, 165],
	/* 106 51e1b4ea-c5e1-4c1e-b620-a9be224201d7 */ [96, 108, 109, 165],
	/* 107 58289901-f714-43c3-87dc-2346585afecf */ [95, 108],
	/* 108 114098ee-4fdc-4509-96ed-7b20904305ff */ [106, 107, 112, 164],
	/* 109 99cdafe8-1f0e-48cb-94cb-bbc296e65714 */ [106, 110, 112],
	/* 110 4da4ec0d-92d1-4875-a9fa-19dd16b370f6 */ [109, 116, 165],
	/* 111 a9ebdf1c-4e29-457b-8553-0fcb546e3129 */ [112, 113, 115],
	/* 112 4870249d-befb-4950-a98c-a27acd404709 */ [108, 109, 111, 164],
	/* 113 a82e665b-f484-41de-bf7b-c66b21a91017 */ [111, 114, 164],
	/* 114 8572125a-bf05-48d4-9af9-9d1f74fb2497 */ [113, 115, 117, 119],
	/* 115 25d89d36-24ee-44a9-8af5-f733d598302c */ [111, 114, 116],
	/* 116 230642b2-c952-48a8-945f-e9002ca986af */ [110, 115, 117, 118],
	/* 117 02017f9d-f8ed-40e3-ab50-f09f67b13da0 */ [114, 116, 118, 165],
	/* 118 7694a952-a692-488e-9565-f46a2e20ddac */ [116, 117, 165],
	/* 119 a5ba283d-a9d4-42f0-9a0a-0a6c08d2b630 */ [114, 120],
	/* 120 85bf96e6-3fd6-4c35-b92e-5c49db7c5724 */ [119, 122, 165],
	/* 121 d7fced96-7ab4-461d-ab37-f8bf43e89684 */ [122, 165],
	/* 122 d3117e05-f27d-48fa-95b7-18ef480713b4 */ [120, 121, 123],
	/* 123 fb1896c5-469b-4879-9571-97373eb5351d */ [122, 163, 164],
	/* 124 6ec5ae84-cf7b-4294-a392-5267a333a3f4 */ [163],
	/* 125 4083369d-c8e3-4e53-a10c-8de7856c2407 */ [126, 163],
	/* 126 ec1b8f24-456a-4dc6-a6c1-b4ab90ee274f */ [125, 127, 128],
	/* 127 410acb1e-20d7-40f9-a0aa-b22511d4be8a */ [126, 128, 129, 130],
	/* 128 5f6136fd-6f01-4853-8b47-7029f6cdde1b */ [126, 127, 163],
	/* 129 c94850bf-0a0f-41ff-880d-c1c14769c6d7 */ [127, 130, 162, 163],
	/* 130 03460c32-bef2-4b66-bdfa-0fb38c21bda7 */ [127, 129, 131],
	/* 131 30436350-991c-404c-ba89-ee055e1f3da0 */ [130, 132, 162],
	/* 132 03903e19-80ae-4ed9-9c11-e9efddd63043 */ [131, 133],
	/* 133 b472d2d8-2d39-4cf5-a3b4-108df1226ca4 */ [132, 134, 162],
	/* 134 be10ef09-7d2c-4c69-9216-eea61b2cd668 */ [133, 135],
	/* 135 8a955d82-ed81-40f1-bac6-5c48340a6385 */ [134, 136, 143],
	/* 136 594bcb6e-3209-4018-b7c8-0e46e453f9d0 */ [135, 142, 162],
	/* 137 4c9aa788-0068-4243-a647-8ff176e7b21a */ [138, 139, 142, 162],
	/* 138 fc81db81-57a9-4f2c-998e-20d9da601d79 */ [137, 139, 142, 157],
	/* 139 767391ad-a9bf-476b-87c1-a5b587ec7a0e */ [28, 137, 138, 140, 157, 162],
	/* 140 2832d646-cca4-41b6-8d92-97d88e26f8d2 */ [139, 141, 162],
	/* 141 c4b6c7fb-37cc-41fc-bc4b-7d0b13778eff */ [31, 140, 162],
	/* 142 c02ce9dd-03eb-4ffe-b24a-71d8e97e9cf4 */ [136, 137, 138, 143, 145],
	/* 143 d9950e9c-051e-44c3-bf21-867e4116e733 */ [135, 142],
	/* 144 78645455-1049-4c3b-bbaa-ea364560874c */ [145, 149, 150],
	/* 145 96fa2d00-2437-4c2b-8a89-4aa2678b8b6b */ [142, 144, 146, 147],
	/* 146 0983e23e-8c8a-4085-ae0c-5c962098b655 */ [145, 147, 157],
	/* 147 4a25eb1c-f4af-446f-8fac-f805d435dbe3 */ [145, 146, 148, 157],
	/* 148 4c433406-6940-49b2-a454-818fde453293 */ [147, 149, 152, 157, 161],
	/* 149 adfcb405-de0d-4c72-a560-7db1f68bb58a */ [144, 148, 150, 151],
	/* 150 3f66f813-5b45-4417-a469-5778863c2fc9 */ [144, 149, 151],
	/* 151 9e323524-9a11-4532-896d-0473f7e8f01a */ [149, 150, 153],
	/* 152 caa004f1-c1db-4508-8e18-87eec251fe0f */ [148, 153, 161],
	/* 153 7b1471fb-cb44-4b56-a508-0cc0cd025bb2 */ [151, 152, 154, 161],
	/* 154 3e963651-e2d3-4026-b407-c650edcff3c5 */ [153, 161],
	/* 155 8c5b998c-babd-44b1-9f87-03c2f13d2cbb */ [92, 156],
	/* 156 a970f08e-20b0-46e9-bb40-69f3abdeaf86 */ [155, 160, 163],
	/* 157 b6455503-a68a-441d-b202-09b3233aadf9 */ [18, 21, 22, 23, 28, 138, 139, 146, 147, 148, 158, 161, 162],
	/* 158 184147cd-2568-4138-a7c2-c5bdead98dc7 */ [9, 10, 13, 18, 157, 159],
	/* 159 3f74088d-3cc8-43a2-b65f-169bd90fadd4 */ [9, 48, 50, 54, 66, 67, 68, 158],
	/* 160 15d0dd60-44b5-453f-a552-028b551ebbd2 */ [41, 57, 58, 59, 60, 62, 76, 77, 90, 91, 92, 156, 163],
	/* 161 1545f304-57db-40aa-9a86-a33159ec8df4 */ [148, 152, 153, 154, 157],
	/* 162 b2768f89-f212-43c9-9f9f-e56d9a7efe53 */ [39, 40, 129, 131, 133, 136, 137, 139, 140, 141, 157, 163],
	/* 163 3468feb9-5a25-455b-82bd-196958ea3fd4 */ [40, 41, 60, 123, 124, 125, 128, 129, 156, 160, 162, 164, 165],
	/* 164 7937bd5a-1399-46c4-b6a7-8c83ccd87eee */ [91, 92, 93, 108, 112, 113, 123, 163, 165],
	/* 165 10cd71c0-427b-4adb-999d-7e1337e1302d */ [96, 102, 103, 104, 105, 106, 110, 117, 118, 120, 121, 163, 164],
	/* 166 364aa271-1668-4b4d-9f73-de83ad48fbeb */ [167, 171],
	/* 167 e9768620-1bbd-4371-86d2-22a80bf3b65a */ [166, 168, 171],
	/* 168 05b1ceb5-c1a8-4eb0-8f4a-ebc027b63790 */ [167, 169, 170],
	/* 169 2a923482-4474-48b2-8507-c840041796bc */ [168, 170, 174],
	/* 170 64e261fe-ba92-4d7e-95a3-49f2caae1904 */ [168, 169, 171, 173],
	/* 171 9de7595f-9002-4861-a36f-85e0cdb3e3fe */ [166, 167, 170, 172],
	/* 172 8e0435fc-495b-4bcd-84d8-ba2e8fa95234 */ [171, 173],
	/* 173 f6bb9ad1-0754-4d8f-8974-03918af03df8 */ [170, 172],
	/* 174 14da4511-2472-4c98-875b-bce40014bcab */ [169, 175],
	/* 175 284e8130-66ba-4770-92e4-e4c8072da7ba */ [174, 176],
	/* 176 12981537-90d5-45e6-ba49-e16698b862e8 */ [175],
	/* 177 6c4b5b6e-0544-41fe-adfc-bfdadd2f1804 */ [],
	/* 178 05549f1f-04e9-491f-9786-a1faaa0a41a3 */ [],
	/* 179 14b26e61-d869-44f2-a368-8eeebef5a720 */ [],
	/* 180 bfce850e-fb0c-4278-959b-d4e795bab3c2 */ [],
	/* 181 06298dff-1e4d-403a-bc57-72f0728b536f */ [],
	/* 182 e3890d31-cc70-4d4d-b166-4798f2ddf524 */ [],
	/* 183 9b484cec-08b5-4625-a4a3-57291e08ba52 */ [],
	/* 184 5dd5f765-550f-4ee2-a9c2-85763d715957 */ [],
	/* 185 28d7721b-cdb1-4acc-b935-d5d33b66e257 */ [],
	/* 186 1822015f-7259-4cdb-ad88-29c944ef1d67 */ [],
	/* 187 2a3bd6d1-1054-4858-91ec-ac0a9a310b07 */ [],
	/* 188 20a17881-434b-4e7b-97b9-01eb7d402332 */ [],
	/* 189 bc1f8f2b-3690-473c-8bf6-1b8f9cd04284 */ [],
	/* 190 8996a032-efbe-4907-895f-5ea610a1911b */ [],
	/* 191 c9f54bf8-c940-44c4-a5ea-6c641cd3939d */ [],
	/* 192 5b6395f7-c14b-4e0f-a92e-1fb3a861678d */ [],
	/* 193 a7439bb0-ee46-4105-9bff-861bc9b91265 */ [],
	/* 194 ca7fef44-d539-445b-a7e1-00813b53cb5a */ [],
	/* 195 f6b6c7fd-8588-4e2c-9d4e-0bfcce774473 */ [],
	/* 196 e39fd54c-6ad6-4021-a9d5-30a32d8f90d7 */ [],
	/* 197 0cb44b0d-b39d-452a-b067-cc0dabf53ae3 */ [],
	/* 198 0b04885d-d692-45c4-be6c-3567f43e332b */ [],
	/* 199 30e90233-fdef-4931-9c3a-2b6ae35c53a7 */ [],
	/* 200 2cd4ae4f-04d5-4795-83c5-78f17047b1f4 */ [],
	/* 201 4e7c7013-3c58-424d-970a-f01e17a926f8 */ [204, 206],
	/* 202 2586de1a-c449-495d-a533-04199e8c82ac */ [203, 205],
	/* 203 88b27831-1a99-415b-afbd-2eccb70fdf6d */ [202, 204],
	/* 204 e390bde9-f115-4ec2-b17e-ed2b8a267d03 */ [201, 203, 205],
	/* 205 f1be71b9-f3f5-454f-b7c9-42587735e338 */ [202, 204],
	/* 206 790e9f61-3c12-43d9-b46e-087509a27e37 */ [201, 207, 210],
	/* 207 c59ae0aa-bfd0-451d-8ce0-45eca442e824 */ [206, 211],
	/* 208 3639617e-8c98-442e-aa45-d07d3fe99300 */ [209, 210],
	/* 209 90496f46-1d25-485b-97cc-ca1af9ad8c1b */ [208, 210],
	/* 210 3a5a3ce0-96c8-402c-abba-deb737b3a019 */ [206, 208, 209, 211],
	/* 211 9e720439-5166-41fe-afee-a45e02cb4e2a */ [207, 210, 212],
	/* 212 d13dc964-6297-42de-b6e8-b9ec22e032c8 */ [211],
]

// Sea connections are derived from adjacent port hexes.
data.sea_connections = [
	[0, 2],
	[0, 6],
	[2, 3],
	[3, 26],
	[18, 157],
	[19, 24],
	[19, 25],
	[21, 22],
	[21, 157],
	[22, 23],
	[22, 157],
	[23, 24],
	[23, 27],
	[23, 28],
	[23, 157],
	[24, 26],
	[24, 27],
	[24, 25],
	[25, 26],
	[27, 47],
	[27, 28],
	[28, 29],
	[28, 157]
]

// Mapping from the previous 25-region MVP index set to the current hex region index set.
data.legacy_region = [0, 1, 2, 3, 4, 5, 6, 13, 17, 158, 18, 21, 23, 24, 20, 22, 157, 19, 28, 29, 27, 25, 26, 47, 16]

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

for (var c = 1; c < data.cards.length; ++c) {
	data.cards[c].type ??= CARD_EVENT
	data.cards[c].actions ??= [ACTION_PLAY_CARD_OPS, ACTION_PLAY_EVENT]
	data.cards[c].image ??= "event_" + String(c).padStart(2, "0")
	data.cards[c].text ??= data.cards[c].name
}

for (var h = 0; h < data.home_cards.length; ++h) {
	data.home_cards[h].type ??= CARD_HOME
	data.home_cards[h].actions ??= [ACTION_PLAY_CARD_OPS, ACTION_PLAY_EVENT]
	data.home_cards[h].image ??= "home_" + String(data.home_cards[h].id).padStart(2, "0")
	data.home_cards[h].text ??= data.home_cards[h].name
}

for (var unit of data.units) {
	unit.kind ??= unit.type
	unit.quantity ??= 1
}

// Power events are persistent or temporary modifiers attached to a power.
// Concrete card text can later attach these ids to G.power_events[power].
data.events = [
	{
		id: "alhambra",
		name: "Alhambra",
		scope: EVENT_SCOPE_POWER,
		description: "Placeholder for a persistent power event or VP marker.",
		effects: [],
	},
	{
		id: "joanna",
		name: "Joanna",
		scope: EVENT_SCOPE_POWER,
		description: "Placeholder for a dynastic or succession event.",
		effects: [],
	},
	{
		id: "wedding",
		name: "Wedding",
		scope: EVENT_SCOPE_POWER,
		description: "Placeholder for a marriage event or VP marker.",
		effects: [],
	},
	{
		id: "reconquista",
		name: "Reconquista",
		scope: EVENT_SCOPE_POWER,
		description: "Placeholder for a military campaign event.",
		effects: [],
	},
	{
		id: "master_of_atlantic",
		name: "Master of the Atlantic",
		scope: EVENT_SCOPE_POWER,
		description: "Placeholder for exploration or naval supremacy effects.",
		effects: [],
	},
	{
		id: "morisco_uprising",
		name: "Morisco Uprising",
		scope: EVENT_SCOPE_REGION,
		description: "Placeholder for a regional unrest or uprising effect.",
		effects: [],
	},
]

// === SCENARIOS & INITIAL DEPLOYMENT ===

// 1470 scenario: starting positions { unit_id: region_id }
data.scenarios = {
	"Standard": {
		deployment: {
			0: 0,
			1: 1,
			2: 0,
			3: 1,
			4: 2,
			8: 0,
			15: 17,
			16: 17,
			17: 21,
			18: 17,
			19: 17,
			21: 21,
			27: 157,
			28: 22,
			29: 157,
			30: 22,
			31: 157,
			41: 23,
			42: 28,
			43: 23,
			44: 29,
			45: 23,
			47: 23,
			49: 28,
			50: 29,
		},
		commanders: {
			0: 0,
			4: 17,
			7: 157,
			10: 23,
		},
		control: {
			0: FRANCE,
			1: FRANCE,
			2: FRANCE,
			3: FRANCE,
			4: SPAIN,
			5: SPAIN,
			6: SPAIN,
			13: SPAIN,
			17: SPAIN,
			158: SPAIN,
			18: SPAIN,
			21: SPAIN,
			23: MUSLIM,
			24: SPAIN,
			20: SPAIN,
			22: PORTUGAL,
			157: PORTUGAL,
			19: PORTUGAL,
			28: MUSLIM,
			29: MUSLIM,
			27: MUSLIM,
			25: MUSLIM,
			26: SPAIN,
			47: SPAIN,
			16: SPAIN,
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

// Card types
data.CARD_EVENT = CARD_EVENT
data.CARD_HOME = CARD_HOME
data.CARD_MANDATORY = CARD_MANDATORY
data.CARD_COMBAT = CARD_COMBAT
data.CARD_RESPONSE = CARD_RESPONSE
data.CARD_OPS_ONLY = CARD_OPS_ONLY

// Atomic action ids
data.ACTION_PLAY_CARD_OPS = ACTION_PLAY_CARD_OPS
data.ACTION_PLAY_EVENT = ACTION_PLAY_EVENT
data.ACTION_PASS = ACTION_PASS
data.ACTION_RECRUIT_UNIT = ACTION_RECRUIT_UNIT
data.ACTION_MOVE_FORMATION = ACTION_MOVE_FORMATION
data.ACTION_FIELD_BATTLE = ACTION_FIELD_BATTLE
data.ACTION_SIEGE = ACTION_SIEGE
data.ACTION_BUILD_FORTRESS = ACTION_BUILD_FORTRESS
data.ACTION_NAVAL_MOVE = ACTION_NAVAL_MOVE
data.ACTION_EXPLORE = ACTION_EXPLORE
data.ACTION_DIPLOMACY = ACTION_DIPLOMACY

// Power relation values
data.RELATION_WAR = RELATION_WAR
data.RELATION_NEUTRAL = RELATION_NEUTRAL
data.RELATION_ALLIANCE = RELATION_ALLIANCE
data.RELATION_SELF = RELATION_SELF

// Event scopes
data.EVENT_SCOPE_POWER = EVENT_SCOPE_POWER
data.EVENT_SCOPE_REGION = EVENT_SCOPE_REGION
data.EVENT_SCOPE_GLOBAL = EVENT_SCOPE_GLOBAL

// Special locations
data.ELIMINATED = -1
data.AVAILABLE = -2

// CSS class mappings
data.POWER_CLASS = data.powers.map(p => p.class_name)

// === EXPORT ===

if (typeof module !== "undefined")
	module.exports = data
