function tower_decode(tower_char) {
  var tc = tower_char;
  var bit_str = tc.charCodeAt(0).toString(2).padStart(8, "0");
  return bit_str;
}
function removeOrphanBullets() {
  var rmidx = -1;
  G.bullets.forEach((bullet, i) => {
    if (!bullet.tower.isConnected) {
      rmidx = i;
    }
  });

  while (rmidx > -1) {
    var b = G.bullets[rmidx];
    G.bullets.splice(rmidx, 1);
    document.body.removeChild(b);
    rmidx = -1;
    G.bullets.forEach((bullet, i) => {
      if (!bullet.tower.isConnected) {
        rmidx = i;
      }
    });
  }
}

function create_bullet(tow, chg_x = 1, chg_y = 0) {
  var b = dcr("div");
  b.tower = tow;
  G.bullets.push(b);
  // bullet defaults
  b.idx = G.bullets.length - 1;
  b.style.position = "absolute";
  b.style.zIndex = "0";
  b.damage = 3;

  if (tow.getAttribute("quantum") !== null) {
    // higher damage for quantum towers
    // bullet rotation (ai aim assist)
    b.classList.add("b-q");
    b.damage = G.qDamage;
  }

  if (tow.getAttribute("phaser") !== null) {
    // laser beam straight line for phaser towers
    b.classList.add("b-p");
    b.damage = G.pDamage;
    b.slow = 0.00001; // percent pixel move per game loop iteration
  }

  if (tow.getAttribute("thermal") !== null) {
    // aoe attack but lower damage for thermal towers
    b.classList.add("b-t");
    b.damage = G.tDamage;
  }

  if (tow.getAttribute("blaster") !== null) {
    b.damage = G.bDamage;
    b.classList.add("b-b");
  }

  var rect = tow.getBoundingClientRect();
  var x = rect.x + rect.width / 2.0;
  var y = rect.y + rect.height / 2.0;
  b.style.left = x + "px"; //tow.parentNode.offsetLeft + 28 + "px";
  b.style.top = y + "px"; //tow.parentNode.offsetTop + 36 + "px";
  b.ox = x;
  b.oy = y;
  b.x = x;
  b.y = y;
  var tag = tow.parentNode.parentNode.parentNode.parentNode.parentNode.tagName; //td //tr //tbody //table //l-g or r-g
  b.lefttower = tag.toUpperCase() == "L-G";
  dba(b);
  var mid_x = document.body.getBoundingClientRect().width / 2.0;
  b.style.zIndex = "100000";
  setInterval(() => {
    var reset = false;
    if (rect.y > b.y) {
      b.style.transform = b.lefttower ? "rotate(-45deg)" : "rotate(45deg)";
    } else if (rect.y < b.y - 50) {
      b.style.transform = b.lefttower ? "rotate(45deg)" : "rotate(-45deg)";
    }
    if (!b.lefttower && b.x < mid_x - 63) {
      b.x = b.ox;
      b.y = b.oy;
      reset = true;
    }
    if (!b.lefttower && b.x >= mid_x - 63) {
      b.x -= chg_x;
      b.y += chg_y;
    }
    if (b.lefttower && b.x > mid_x + 63) {
      b.x = b.ox;
      b.y = b.oy;
      reset = true;
    }
    if (b.lefttower && b.x <= mid_x + 63) {
      b.x += chg_x;
      b.y += chg_y;
    }
    if (b.reset) {
      b.reset = false;
      b.x = b.ox;
      b.y = b.oy;
      b.style.left = b.x + "px";
      b.style.top = b.y + "px";
    }
    if ((reset || b.reset) && ene.recentHits.includes(b.idx)) {
      b.reset = false;
      b.x = b.ox;
      b.y = b.oy;
      for (var i = 0; i < ene.recentHits.length; i++) {
        if (ene.recentHits[i] == b.idx) {
          ene.recentHits[i] = -1;
        }
      }
    }
    b.style.left = b.x + "px";
    b.style.top = b.y + "px";
  }, 10);
}
function create_tower(attrs, tss /*tower set string*/) {
  var tow = dcr("div");
  var span = dcr("span");
  span.style.borderRadius = "50%";
  tow.appendChild(span);
  span.setAttribute("one", ""); //levels[li],"");
  if (tss.length == 1) {
    span.style.width = "65px";
    span.style.height = "65px";
    span.style.backgroundImage = "url('assets/images/sat.png')";
    span.style.backgroundRepeat = "no-repeat";
    span.style.backgroundPosition = "14px 11px";
    tow.style.zIndex = "1";
  }
  tow.rot = 0;
  var typidx =
    parseInt(attrs[5] + "" + attrs[6] + "" + attrs[7], 2) %
    G.tower_types.length;
  tow.setAttribute(G.tower_types[typidx], "");
  setTimeout(() => {
    create_bullet(tow);
  });
  return tow;
}
