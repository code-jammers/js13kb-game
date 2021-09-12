LOADING_SCENE = "loading-scene";
LAUNCH_SCENE = "launch-scene";
GAME_SCENE = "game-scene";

ALL_SCENES = [
    LOADING_SCENE,
    LAUNCH_SCENE,
    GAME_SCENE
];

G/*AME_DATA*/ = {
  towers: "@M*O",//"*@M0OADY",
  waves: ["eA$Ypeasy","m|e|d","hard{||}"],
  wave: 0,
  ei: 0,//enemy index (usage: waves[wave][ei])
  bullets: [],
  allScenes : [...ALL_SCENES],
  currentScene: LOADING_SCENE,
  gameOver: false,
  tower_types : [
    "blaster",
    "thermal",
    "phaser",
    "quantum",
  ]
};


