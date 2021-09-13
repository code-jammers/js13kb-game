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
  pDamage: 10,
  bDamage: 10.8,
  tDamage: 9,
  qDamage: 15,
  tower_types : [
    "blaster",
    "thermal",
    "phaser",
    "quantum",
  ]
};


