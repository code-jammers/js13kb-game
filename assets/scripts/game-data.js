LOADING_SCENE = "loading-scene";
GAME_SCENE = "game-scene";

ALL_SCENES = [
    LOADING_SCENE,
    GAME_SCENE
];

G/*AME_DATA*/ = {
  towers: "@M*O",//"*@M0OADY",
  waves: ["111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"],
  wave: 0,
  ei: 0,//enemy index (usage: waves[wave][ei])
  bullets: [],
  allScenes : [...ALL_SCENES],
  cs: LOADING_SCENE,
  gameOver: false,
  pDamage: 11,
  bDamage: 12,
  tDamage: 10,
  qDamage: 16,
  tower_types : [
    "blaster",
    "thermal",
    "phaser",
    "quantum",
  ]
};


