//no longer works for 3.5-3.6 and up iirc?

export enum CmdIdGroup{
    UNKNOWN = "unknown",
    MISC = "misc",
    PLAYER = "player",
    SCENE = "scene",
    SCENE_2 = "scene2",
    FIGHT = "fight",
    QUEST = "quest",
    NPC = "npc",
    ITEM = "item",
    SHOP = "shop",
    GADGET = "gadget",
    DUNGEON = "dungeon",
    SKILL = "SKILL",
    ABILITY = "ability",
    PROPERTY = "property",
    MONSTER = "monster",
    MAIL = "mail",
    GACHA = "gacha",
    AVATAR = "avatar",
    MP = "mp",
    INVESTIGATION = "investigation",
    COOP = "coop",
    WATCHER = "watcher",
    PATHFINDING = "pathfinding",
    TOWER = "tower",
    SIGNIN = "signin",
    BATTLE_PASS = "battle_pass",
    ACHIVEMENT = "achivement",
    BLOSSOM = "blossom",
    REPUTATION = "reputation",
    OFFERING = "offering",
    ROUTINE = "routine",
    MECHANICUS = "mechanicus",
    SOCIAL = "social",
    RECHARGE = "recharge",
    MATCH = "match",
    CODEX = "codex",
    STAT = "stat",
    WIDGET = "widget",
    WIDGET_2 = "widget2",
    HUNTING = "hunting",
    SCENE_PLAY = "scene_play",
    HOME = "home",
    CHAT = "chat",
    REUNION = "reunion",
    ACTIVITY = "activity",
    ACTIVITY_2 = "activity_2",
    OP_ACTIVITY = "op_activity",
    MIRCALE_RING = "miracle_ring",
    MULTISTAGE = "multistage_play",
    DRAFT = "draft",
    GALLERY = "gallery",
    REGION_SEARCH = "region_search",
    H5_ACTIVITY = "h5_activity",
    REMINDER = "reminder",
    FISH = "fish",
    TOTHEMOON = "tothemoon",
    CUSTOM_DUNGEON = "custom_dungeon",
    REGIONAL_PLAY = "regional_play",
    UGC = "ugc",
    ARANARA = "aranara",
    GCG = "gcg",
    SHARE_CD = "share_cd",
    GROUP_LINK = "group_link",
}

function inRange(x: number, min: number, max: number) {
    return x >= min && x <= max;
}

export function getCmdIdGroup(cmdId: number): CmdIdGroup{
    if (inRange(cmdId, 0, 100)) return CmdIdGroup.MISC;
    if (inRange(cmdId, 101, 200)) return CmdIdGroup.PLAYER;
    if (inRange(cmdId, 201, 300)) return CmdIdGroup.SCENE;
    if(inRange(cmdId, 3001, 3500)) return CmdIdGroup.SCENE_2;
    if (inRange(cmdId, 301, 400)) return CmdIdGroup.FIGHT;
    if (inRange(cmdId, 401, 500)) return CmdIdGroup.QUEST;
    if (inRange(cmdId, 501, 600)) return CmdIdGroup.NPC;
    if (inRange(cmdId, 601, 700)) return CmdIdGroup.ITEM;
    if (inRange(cmdId, 701, 800)) return CmdIdGroup.SHOP;
    if (inRange(cmdId, 801, 900)) return CmdIdGroup.GADGET;
    if (inRange(cmdId, 901, 1000)) return CmdIdGroup.DUNGEON;
    if (inRange(cmdId, 1001, 1100)) return CmdIdGroup.SKILL;
    if (inRange(cmdId, 1001, 1200)) return CmdIdGroup.ABILITY;
    if (inRange(cmdId, 1201, 1300)) return CmdIdGroup.PROPERTY;
    if (inRange(cmdId, 1301, 1400)) return CmdIdGroup.MONSTER;
    if (inRange(cmdId, 1401, 1500)) return CmdIdGroup.MAIL;
    if (inRange(cmdId, 1501, 1600)) return CmdIdGroup.GACHA;
    if (inRange(cmdId, 1601, 1800)) return CmdIdGroup.AVATAR;
    if (inRange(cmdId, 1801, 1850)) return CmdIdGroup.MP;
    if (inRange(cmdId, 1901, 1930)) return CmdIdGroup.INVESTIGATION;
    if (inRange(cmdId, 1951, 2000)) return CmdIdGroup.COOP;
    if (inRange(cmdId, 2001, 2200)) return CmdIdGroup.ACTIVITY;
    if (inRange(cmdId, 8001, 9000)) return CmdIdGroup.ACTIVITY;
    if (inRange(cmdId, 20001, 25000)) return CmdIdGroup.ACTIVITY_2;
    if (inRange(cmdId, 2201, 2300)) return CmdIdGroup.WATCHER;
    if (inRange(cmdId, 2301, 2400)) return CmdIdGroup.PATHFINDING;
    if (inRange(cmdId, 2401, 2500)) return CmdIdGroup.TOWER;
    if (inRange(cmdId, 2501, 2600)) return CmdIdGroup.SIGNIN;
    if (inRange(cmdId, 2601, 2650)) return CmdIdGroup.BATTLE_PASS;
    if (inRange(cmdId, 2651, 2700)) return CmdIdGroup.ACHIVEMENT;
    if (inRange(cmdId, 2701, 2800)) return CmdIdGroup.BLOSSOM;
    if (inRange(cmdId, 2801, 2900)) return CmdIdGroup.REPUTATION;
    if (inRange(cmdId, 2901, 2925)) return CmdIdGroup.OFFERING;
    if (inRange(cmdId, 3501, 3550)) return CmdIdGroup.ROUTINE;
    if (inRange(cmdId, 3901, 4000)) return CmdIdGroup.MECHANICUS;
    if (inRange(cmdId, 4001, 4100)) return CmdIdGroup.SOCIAL;
    if (inRange(cmdId, 4101, 4150)) return CmdIdGroup.RECHARGE;
    if (inRange(cmdId, 4151, 4200)) return CmdIdGroup.MATCH;
    if (inRange(cmdId, 4201, 4210)) return CmdIdGroup.CODEX;
    if (inRange(cmdId, 4211, 4250)) return CmdIdGroup.STAT;
    if (inRange(cmdId, 4251, 4300)) return CmdIdGroup.WIDGET;
    if (inRange(cmdId, 5900, 6100)) return CmdIdGroup.WIDGET_2;
    if (inRange(cmdId, 4301, 4350)) return CmdIdGroup.HUNTING;
    if (inRange(cmdId, 4351, 4450)) return CmdIdGroup.SCENE_PLAY;
    if (inRange(cmdId, 4451, 4900)) return CmdIdGroup.HOME;
    if (inRange(cmdId, 4951, 5050)) return CmdIdGroup.CHAT;
    if (inRange(cmdId, 5051, 5100)) return CmdIdGroup.REUNION;
    if (inRange(cmdId, 5101, 5200)) return CmdIdGroup.OP_ACTIVITY;
    if (inRange(cmdId, 5201, 5250)) return CmdIdGroup.MIRCALE_RING;
    if (inRange(cmdId, 5301, 5400)) return CmdIdGroup.MULTISTAGE;
    if (inRange(cmdId, 5401, 5500)) return CmdIdGroup.DRAFT;
    if (inRange(cmdId, 5501, 5600)) return CmdIdGroup.GALLERY;
    if (inRange(cmdId, 5501, 5650)) return CmdIdGroup.REGION_SEARCH;
    if (inRange(cmdId, 5651, 5700)) return CmdIdGroup.H5_ACTIVITY;
    if (inRange(cmdId, 5701, 5750)) return CmdIdGroup.REMINDER;
    if (inRange(cmdId, 5751, 5800)) return CmdIdGroup.GROUP_LINK;
    if (inRange(cmdId, 5801, 5850)) return CmdIdGroup.FISH;
    if (inRange(cmdId, 6101, 6200)) return CmdIdGroup.TOTHEMOON;
    if (inRange(cmdId, 6201, 6250)) return CmdIdGroup.CUSTOM_DUNGEON;
    if (inRange(cmdId, 6251, 6300)) return CmdIdGroup.REGIONAL_PLAY;
    if (inRange(cmdId, 6301, 6350)) return CmdIdGroup.UGC;
    if (inRange(cmdId, 6351, 6400)) return CmdIdGroup.ARANARA;
    if (inRange(cmdId, 7001, 8000)) return CmdIdGroup.GCG;
    if (inRange(cmdId, 9001, 9100)) return CmdIdGroup.SHARE_CD;
    return CmdIdGroup.UNKNOWN;
}

