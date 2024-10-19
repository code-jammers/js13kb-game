LOADING_SCENE = "loading-scene";
GAME_SCENE = "game-scene";

ALL_SCENES = [LOADING_SCENE, GAME_SCENE];

GAME_DATA = {
  towers: "blaster,thermal,phaser,quantum", //"*@M0OADY",
  waves: [
    "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  ],
  wave: 0,
  ei: 0, //enemy index (usage: waves[wave][ei])
  bullets: [],
  allScenes: [...ALL_SCENES],
  cs: LOADING_SCENE,
  gameOver: false,
  phaserDamage: 8,
  blasterDamage: 10,
  thermalDamage: 6,
  quantumDamage: 14,
  tower_types: ["blaster", "thermal", "phaser", "quantum"],
};
