function removeOrphanBullets() {
  var rmidx = -1;
  GAME_DATA.bullets.forEach((bullet, i) => {
    if (!bullet.tower.isConnected) {
      rmidx = i;
    }
  });

  while (rmidx > -1) {
    var b = GAME_DATA.bullets[rmidx];
    GAME_DATA.bullets.splice(rmidx, 1);
    document.body.removeChild(b);
    rmidx = -1;
    GAME_DATA.bullets.forEach((bullet, i) => {
      if (!bullet.tower.isConnected) {
        rmidx = i;
      }
    });
  }
}

function create_bullet(tower, chg_x = 1, chg_y = 0) {
  var bullet = document.createElement("div");
  bullet.tower = tower;
  GAME_DATA.bullets.push(bullet);
  // bullet defaults
  bullet.idx = GAME_DATA.bullets.length - 1;
  bullet.style.position = "absolute";
  bullet.style.zIndex = "0";
  bullet.damage = 3;

  if (tower.getAttribute("quantum") !== null) {
    // higher damage for quantum towers
    // bullet rotation (ai aim assist)
    bullet.classList.add("bullet-quantum");
    bullet.damage = GAME_DATA.quantumDamage;
  }

  if (tower.getAttribute("phaser") !== null) {
    // laser beam straight line for phaser towers
    bullet.classList.add("bullet-phaser");
    bullet.damage = GAME_DATA.phaserDamage;
    bullet.slow = 0.00001; // percent pixel move per game loop iteration
  }

  if (tower.getAttribute("thermal") !== null) {
    // aoe attack but lower damage for thermal towers
    bullet.classList.add("bullet-thermal");
    bullet.damage = GAME_DATA.thermalDamage;
  }

  if (tower.getAttribute("blaster") !== null) {
    bullet.damage = GAME_DATA.blasterDamage;
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
  var mid_x = document.body.getBoundingClientRect().width / 2.0;
  bullet.style.zIndex = "100000";
  setInterval(() => {
    var reset = false;
    if (rect.y > bullet.y) {
      bullet.style.transform = bullet.lefttower
        ? "rotate(-45deg)"
        : "rotate(45deg)";
    } else if (rect.y < bullet.y - 50) {
      bullet.style.transform = bullet.lefttower
        ? "rotate(45deg)"
        : "rotate(-45deg)";
    }
    if (!bullet.lefttower && bullet.x < mid_x - 63) {
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      reset = true;
    }
    if (!bullet.lefttower && bullet.x >= mid_x - 63) {
      bullet.x -= chg_x;
      bullet.y += chg_y;
    }
    if (bullet.lefttower && bullet.x > mid_x + 63) {
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      reset = true;
    }
    if (bullet.lefttower && bullet.x <= mid_x + 63) {
      bullet.x += chg_x;
      bullet.y += chg_y;
    }
    if (bullet.reset) {
      bullet.reset = false;
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      bullet.style.left = bullet.x + "px";
      bullet.style.top = bullet.y + "px";
    }

    if (
      (reset || bullet.reset) &&
      window?.ene?.recentHits.includes(bullet.idx)
    ) {
      bullet.reset = false;
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      for (var i = 0; i < window?.ene?.recentHits.length; i++) {
        if (window?.ene?.recentHits[i] == bullet.idx) {
          window.ene.recentHits[i] = -1;
        }
      }
    }

    bullet.style.left = bullet.x + "px";
    bullet.style.top = bullet.y + "px";
  }, 10);
}
function create_tower(tower) {
  var tow = document.createElement("div");
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
    create_bullet(tow);
  });
  return tow;
}
