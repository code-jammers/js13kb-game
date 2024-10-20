function createBullet(tower, chgX = 1, chgY = 0) {
  var bullet = document.createElement("div");
  bullet.id = crypto.randomUUID();
  bullet.tower = tower;
  let chg_x = chgX;
  let chg_y = chgY;
  var b = { id: bullet.id, towerId: tower.id, chgX: chgX, chgY: chgY };
  GAME_DATA.bullets.push(b);
  // bullet defaults
  bullet.idx = GAME_DATA.bullets.length - 1;
  bullet.style.position = "absolute";
  bullet.style.zIndex = "0";
  b.damage = 3;

  if (tower.getAttribute("quantum") !== null) {
    // higher damage for quantum towers
    // bullet rotation (ai aim assist)
    bullet.classList.add("bullet-quantum");
    b.damage = GAME_DATA.quantumDamage;
  }

  if (tower.getAttribute("phaser") !== null) {
    // laser beam straight line for phaser towers
    bullet.classList.add("bullet-phaser");
    b.damage = GAME_DATA.phaserDamage;
    b.slow = 0.00001; // percent pixel move per game loop iteration
  }

  if (tower.getAttribute("thermal") !== null) {
    // aoe attack but lower damage for thermal towers
    bullet.classList.add("bullet-thermal");
    b.damage = GAME_DATA.thermalDamage;
  }

  if (tower.getAttribute("blaster") !== null) {
    b.damage = GAME_DATA.blasterDamage;
    bullet.classList.add("bullet-blaster");
  }

  var rect = tower.getBoundingClientRect();
  var x = rect.x + rect.width / 2.0;
  var y = rect.y + rect.height / 2.0;
  bullet.style.left = x + "px"; //tow.parentNode.offsetLeft + 28 + "px";
  bullet.style.top = y + "px"; //tow.parentNode.offsetTop + 36 + "px";
  bullet.ox = x;
  bullet.oy = y;
  bullet.x = x;
  bullet.y = y;
  var tag =
    tower.parentNode.parentNode.parentNode.parentNode.parentNode.tagName; //td //tr //tbody //table //l-g or r-g
  bullet.lefttower = tag.toUpperCase() == "L-G";
  dba(bullet);
  // var mid_x = document.body.getBoundingClientRect().width / 2.0;
  bullet.style.zIndex = "100000";
}
function createTower(tower) {
  var towerId = crypto.randomUUID();
  var tow = document.createElement("div");
  GAME_DATA.dtowers.push({ id: towerId });
  var span = document.createElement("span");
  tow.appendChild(span);
  span.setAttribute("one", ""); //levels[li],"");
  span.style.width = "65px";
  span.style.height = "65px";
  var img = document.createElement("img");
  img.src = `assets/images/${tower}.png`;
  span.appendChild(img);
  tow.style.zIndex = "1";
  tow.rot = 0;

  tow.setAttribute(tower, "");
  setTimeout(() => {
    tow.id = towerId;
    createBullet(tow);
  });
  return tow;
}
