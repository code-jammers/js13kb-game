var uuid = 1;
global.window = {};
global.crypto = {
  randomUUID: () => "crypto-" + uuid++,
};
global.document = {
  createElement: () => ({ style: {}, className: "", appendChild: () => false }),
  createElementNS: () => ({ style: {}, setAttribute: () => ({}) }),
};
require("../assets/scripts/game-math.js");
require("../assets/scripts/game-element-animator.js");
require("../assets/scripts/game-referee.js");
require("../assets/scripts/game-sync.js");

var towerEl = {
  getBoundingClientRect: () => ({ left: 1, top: 1, width: 1, height: 1 }),
};

var scenarios = [
  {
    name: "bullet inside ship rect creates collision",
    shipRect: [2, 2, 6, 6],
    bulletRect: [4, 4, 2, 2],
    data: { wave: 0, bullets: [{ id: 0 }], bulletCollisions: [] },
    expect: (d) => d.bulletCollisions.length == 1,
  },
  {
    name: "bullet outside ship rect does not create collision",
    shipRect: [2, 2, 6, 6],
    bulletRect: [1, 1, 1, 1],
    data: { wave: 0, bullets: [{ id: 0 }], bulletCollisions: [] },
    expect: (d) => d.bulletCollisions.length == 0,
  },
  {
    name: "bullet out of window bounds does not create collision",
    shipRect: [2, 2, 6, 6],
    bulletRect: [-1, -1, 1, 1],
    data: { wave: 0, bullets: [{ id: 0 }], bulletCollisions: [] },
    expect: (d) => d.bulletCollisions.length == 0,
  },
  {
    name: "after collision animation ends, collision game data is removed",
    shipRect: [2, 2, 6, 6],
    bulletRect: [-1, -1, 1, 1], // off-screen so new collision is not created
    data: { wave: 0, bullets: [{ id: 0 }], bulletCollisions: [{ ticks: 500 }] },
    expect: (d) => d.bulletCollisions.length == 0,
  },
];

var body = {
  getBoundingClientRect: function () {
    return { left: 0, top: 0, width: 10, height: 10 };
  },
};

for (let scenario of scenarios) {
  var pass = false;
  var bulletEl = {
    className: "",
    style: {},
    tower: towerEl,
    getBoundingClientRect: () => {
      return {
        left: scenario.bulletRect[0],
        top: scenario.bulletRect[1],
        width: scenario.bulletRect[2],
        height: scenario.bulletRect[3],
      };
    },
    remove: () => false,
  };
  var shipEl = {
    appendChild: () => false,
    getBoundingClientRect: () => {
      return {
        left: scenario.shipRect[0],
        top: scenario.shipRect[1],
        width: scenario.shipRect[2],
        height: scenario.shipRect[3],
      };
    },
  };

  global.createBullet = function (tower, chgX = 1, chgY = 0) {
    var bullet = document.createElement("div");
    bullet.id = crypto.randomUUID();
    bullet.tower = tower;
    let chg_x = chgX;
    let chg_y = chgY;
    var b = { id: bullet.id, towerId: tower.id, chgX: chgX, chgY: chgY };
    scenario.data.bullets.push(b);
  };

  try {
    window.gameSync(
      /*dom:*/ (selector) => {
        if (selector == "body") return body;
        if (selector == "#ene") return shipEl;
        return bulletEl;
      },
      /*data:*/ scenario.data,
    );
    pass = scenario.expect(scenario.data);
  } finally {
    console.log(
      "TEST - " + scenario.name + "........." + (pass ? "PASS" : "FAIL"),
    );
  }
}
