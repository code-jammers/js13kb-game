var t2 = document.createElement("template");

setNotification = (text, timeout) => {
  try {
    var n = document.createElement("a");
    n.id="not";
    n.innerHTML = text;
    document.body.appendChild(n);
    setTimeout(() => {
      n.remove();
    }, timeout);
  } catch (error) {
    console.log(error);
  }
};

getTowerType = (tower) => {
  var decodedTower = tower_decode(tower);
  var typidx =
    parseInt(decodedTower[5] + "" + decodedTower[6] + "" + decodedTower[7], 2) %
    GAME_DATA.tower_types.length;
  return GAME_DATA.tower_types[typidx];
};

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <t-b>
    <div legend>
      <div
        blaster
        title="Single target turret. Standard space defense engineer issue."
      >
        Blaster 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div
        thermal
        title="Hot. Hot. Hot. High area of effect damage that literally incinerates enemies."
      >
        Thermal Detonator 1<span one></span> 2<span two></span> 3<span
          three
        ></span>
      </div>
      <div
        phaser
        title="Lazer turret that blasts enemies in a line and disintegrates them."
      >
        Phaser 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div
        quantum
        title="Quantum drive that provides a damage boost and well as AI programming for rotation of attached turrets."
      >
        Quantum Drive 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
    </div>
    <div money></div>
  </t-b>
  <s-c>
    <l-g></l-g>
    <m-g>
      <r-w></r-w>
      <s-p></s-p>
    </m-g>
    <r-g></r-g>
  </s-c>
`;

class GameScene extends HTMLElement {
  buildTable(query, side, ctx) {
    var skipToWave = new URL(location.href).searchParams.get("wave");
    if (skipToWave != null) GAME_DATA.wave = parseInt(skipToWave);
    setNotification(`Level ${GAME_DATA.wave + 1}`, 4000);
    const gc = ctx.shadowRoot.querySelector(query);
    var tbl = document.createElement("table");

    var tbd = document.createElement("tbody");
    tbl.appendChild(tbd);
    var cw = gc.clientWidth;
    var ch = gc.clientHeight;
    var lead = 0;
    while (cw % 100 != 0) {
      cw -= 1;
      lead += 1;
    }
    var leadY = 0;
    while (ch % 100 != 0) {
      ch -= 1;
      leadY += 1;
    }
    if (side === "left") {
      tbl.style.left = lead + "px";
    } else {
      tbl.style.right = lead + "px";
    }
    tbl.style.top = leadY / 2 + "px";
    tbl.style.bottom = leadY / 2 + "px";
    for (var i = 0; i < ch / 100; i++) {
      var tr = document.createElement("tr");
      for (var j = 0; j < cw / 100; j++) {
        var td = document.createElement("td");
        td.setAttribute(
          "cost",
          side === "left" ? (j + 1) * 100 : (cw / 100 - j) * 100
        );
        tr.appendChild(td);
      }
      tbd.appendChild(tr);
    }
    gc.appendChild(tbl);
    return ctx.buildTable;
  }

  closeMenu() {
    const previousMenu = this.shadowRoot.querySelector("div[menu]");
    const previousMenuParent = previousMenu?.parentElement;
    if (previousMenu && previousMenuParent) {
      previousMenuParent.removeChild(previousMenu);
    }
  }

  buildMenu() {
    this.shadowRoot.querySelectorAll("td").forEach((td) => {
      td.addEventListener("click", (e) => {
        this.closeMenu();
        const el = e.srcElement;
        const menu = document.createElement("div");
        menu.setAttribute("menu", true);
        console.log(td?.towers);
        let towers = GAME_DATA.towers.split("");
        let isUpgrading = false;
        let nextLevel =
          td.querySelector("span")?.getAttribute("one") === ""
            ? "two"
            : td.querySelector("span")?.getAttribute("two") === ""
            ? "three"
            : td.querySelector("span")?.getAttribute("three") === ""
            ? "four"
            : null;
        if (!nextLevel) {
          nextLevel = "one";
        }
        console.log(nextLevel);

        if (Boolean(td.towers)) {
          towers = towers.filter((l) => td.towers.includes(l));
          isUpgrading = true;
        }

        if (nextLevel === "four") {
          towers = [];
        }

        towers.forEach((tower) => {
          const menuItem = document.createElement("div");
          var type = getTowerType(tower);
          menuItem.setAttribute(type, "");
          menuItem.setAttribute("legend", "");
          const tpCost = Number(td.getAttribute("cost"));
          const cost =
            type === "blaster"
              ? tpCost
              : type === "thermal"
              ? tpCost * 1.5
              : type === "phaser"
              ? tpCost * 2
              : tpCost * 2.5;
          menuItem.innerHTML = `<span ${nextLevel}></span> ${cost}`;
          menuItem.setAttribute("menu-item", true);
          menuItem.addEventListener("click", (e) => {
            e.stopPropagation();
            if (cost > this.money) {
              setNotification(`Insufficient Funds`, 4000);
              this.closeMenu();
              return;
            }
            const amt = this.money - cost;
            this.setMoney(amt);
            if (td.towers == null) td.towers = "";
            if (td.towers.includes(tower)) {
              //upgrade
              for (var i = 0; i < td.childNodes.length; i++) {
                var cn = td.childNodes[i]; //child node
                if (cn.towerId === tower) {
                  cn.childNodes[0].removeAttribute("one");
                  cn.childNodes[0].removeAttribute("two");
                  if (cn.level === undefined) cn.level = 1;
                  cn.level += 1;
                  var levels = ["zero", "one", "two", "three"];
                  cn.childNodes[0].setAttribute(levels[cn.level], "");
                  var chg = [
                    -999,
                    { x: 1, y: 1 },
                    { x: 1, y: -1 },
                    { x: 2, y: 0 },
                  ][((parseInt(cn.level) + 1) % 3) + 1];
                  create_bullet(cn, chg.x, chg.y);
                  break;
                }
              }
              for (var i = 0; i < GAME_DATA.bullets.length; i++) {
                var bu = GAME_DATA.bullets[i]; //bullet upgrade
                bu.damage += 5;
              }
              this.closeMenu();
              return;
            } else td.towers += tower;

            var div = create_tower(tower_decode(tower), td.towers); //document.createElement("div");
            div.towerId = tower;
            div.classList.add("tower");
            td.appendChild(div);
            td.style.position = "relative";
            this.closeMenu();
          });
          menu.appendChild(menuItem);
        });

        if (isUpgrading) {
          const cost = Number(td.getAttribute("cost")) - 100;
          const menuItem = document.createElement("div");
          menuItem.setAttribute("blaster", "");
          menuItem.setAttribute("legend", "");
          menuItem.innerHTML = `<span sell></span> sell ${cost}`;
          menuItem.setAttribute("menu-item", true);
          menuItem.addEventListener("click", (e) => {
            e.stopPropagation();
            const amt = this.money + cost;
            this.setMoney(amt);
            td.towers="";
            td.children[0].remove();
            removeOrphanBullets();
            this.closeMenu();
          });
          menu.appendChild(menuItem);
        }
        el.appendChild(menu);
      });
    });
  }

  rotateTowers(towers) {
    for (var i = 0; i < towers.length; i++) {
      var t = towers[i];
      var tag =
        t.parentNode.parentNode.parentNode.parentNode.parentNode.tagName; //td //tr //tbody //table //l-g or r-g
      if (tag.toUpperCase() == "L-G") {
        if (t.rot < 91) {
          t.rot += 1;
          t.style.transform = "rotate(" + t.rot + "deg)";
        }
      } else {
        if (t.rot === undefined) t.rot = 0;
        if (t.rot > -91) {
          t.rot -= 1;
          t.style.transform = "rotate(" + t.rot + "deg)";
        }
      }
    }
  }

  setMoney(amt) {
    this.money = amt;
    const moneyEl = this.shadowRoot.querySelector("div[money]");
    if (amt < 1000) {
      moneyEl.style.color = "red";
    } else if (amt < 3000) {
      moneyEl.style.color = "yellow";
    } else {
      moneyEl.style.color = "green";
    }
    moneyEl.innerText = `$${amt.toFixed(2)}`;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(t2.content.cloneNode(true));
      this.setMoney(10000);

      window.setTimeout(() => {
        this.buildTable("l-g", "left", this)("r-g", "right", this);
        this.buildMenu();
        //draw enemy ship/ufo
        var top = document.createElement("div");
        top.id="sst";

        var mid = document.createElement("div");
        mid.id="ssm";

        var bot = document.createElement("div");
        bot.id="ssb";

        /*var */ window.enemy = document.createElement("div");
        enemy.velocity = 1; // 1px per game loop iteration
        enemy.velocityTrack = 1.0;
        enemy.health =
          GAME_DATA.waves[GAME_DATA.wave][GAME_DATA.ei].charCodeAt(0);
        enemy.id="ene";
        enemy.width = 30;
        enemy.height = 30;
        mid.style.backgroundColor = "white"; //"green";
        top.appendChild(mid);
        mid.appendChild(bot);
        enemy.appendChild(top);
        var brect = document.body.getBoundingClientRect();
        enemy.style.left = brect.width / 2.0 - 15 + "px";
        enemy.style.top = "40px";
        enemy.y = 40;
        enemy.x = brect.width / 2.0 - 15;
        enemy.recentHits = [];
        document.body.appendChild(enemy);
        // game loop
        var gmLpId = setInterval(() => {
          if (GAME_DATA.gameOver) return;
          if (
            enemy.y > document.body.getBoundingClientRect().height ||
            enemy.health <= 0
          ) {
            GAME_DATA.ei += 1;
            enemy.y = 40;
            enemy.recentHits = [];
            if (GAME_DATA.ei >= GAME_DATA.waves[GAME_DATA.wave].length) {
              //game over
              clearInterval(gmLpId);
              GAME_DATA.gameOver = true;
              document.location.href =
                "?wave=" + ((GAME_DATA.wave + 1) % GAME_DATA.waves.length);
              return;
            }
            enemy.health =
              GAME_DATA.waves[GAME_DATA.wave][GAME_DATA.ei].charCodeAt(0);
          }

          //draw henchmen ships
          function drawHenchmenShips() {
            function createHench() {
              var h = document.createElement("div");
              h.classList.add("hen");
              var img = document.createElement("img");
              img.src = "assets/images/rocket.png";
              img.classList.add("hei");
              h.appendChild(img);
              h.width = 12;
              h.height = 12;
              document.body.appendChild(h);
              h.deg = 0; //0-360
              return h;
            }
            function renderHench(h, i, active) {
              if (enemy.y <= 50) h.dead = null;
              if (active && h.dead == null) h.style.visibility = "visible";
              else {
                h.style.visibility = "hidden";
                h.dead = true;
              }
              var offsets = [
                [-15, 0],
                [-15, -15],
                [0, -15],
                [15, -15],
                [15, 0],
                [15, 15],
                [0, 15],
                [-15, 15],
              ];
              var xs = offsets[i][0] >= 0 ? 1 : -1; //x-sign
              var ys = offsets[i][1] >= 0 ? 1 : -1; //y-sign
              var cxo = xs * (enemy.width / 2.0) + xs * (h.width / 2.0); //characters x offsets
              var cyo = ys * (enemy.height / 2.0) + ys * (h.height / 2.0); //characters y offsets
              var x = enemy.x + cxo + xs * offsets[i][0];
              var y = enemy.y + cyo + ys * offsets[i][1];
              h.x = x;
              h.y = y;
              h.style.left = x + "px";
              h.style.top = y + "px";
            }
            var bits = tower_decode(
              GAME_DATA.waves[GAME_DATA.wave][GAME_DATA.ei]
            );
            var orbHenchCnt = 0;
            var stcHenchCnt = 0;
            for (var i = 0; i < 4; i++) {
              if (bits[i] == "1") {
                orbHenchCnt += 1;
              }
            }
            for (var i = 4; i < 8; i++) {
              if (bits[i] == "1") {
                stcHenchCnt += 1;
              }
            }
            if (window.stcHench == null) window.stcHench = [];
            if (window.orbHench == null) window.orbHench = [];
            while (window.stcHench.length < 4) {
              window.stcHench.push(createHench());
            }
            while (window.orbHench.length < 4) {
              window.orbHench.push(createHench());
            }
            for (var i = 0; i < 8; i++) {
              var h = i < 4 ? window.stcHench[i] : window.orbHench[i % 4];
              var active =
                i < 4 ? stcHenchCnt >= i + 1 : orbHenchCnt >= (i % 4) + 1;
              renderHench(h, i, active);
            }
          }
          drawHenchmenShips();

          if (enemy.health < 50) enemy.style.color = "red";
          else enemy.style.color = "green";

          if (enemy.health > 80) {
            mid.style.backgroundColor = "green";
          } else if (enemy.health > 50) {
            mid.style.backgroundColor = "yellow";
          } else {
            mid.style.backgroundColor = "red";
          }
          mid.style.width = enemy.health / 2;
          mid.style.right = `${enemy.health / 2 - 42}`;

          enemy.y += Math.min(Math.floor(enemy.velocityTrack), 1); //1;
          enemy.velocityTrack += enemy.velocityTrack;
          enemy.velocityTrack = Math.min(enemy.velocityTrack, 1);
          enemy.style.top = enemy.y + "px";
          var removeidx = -1;
          for (var i = 0; i < GAME_DATA.bullets.length; i++) {
            var b = GAME_DATA.bullets[i];
            var brect = b.getBoundingClientRect(); //bullet rect
            var srect = enemy.getBoundingClientRect(); //ship rect
            for (var j = 0; j < 8/*orbHench.length*/; j++) {
              var h = j<4?stcHench[j]:orbHench[j%4];
              if (h.dead) continue;
              if (
                rects_collide({left:h.x, top:h.y+h.height, width:h.width, height:h.height}, brect)
              ) {
                removeidx = i;
                h.dead = true;
                break;
              }
            }
            if (removeidx > -1) {
              b.reset = true;
              b.x=b.ox;b.y=b.oy;b.style.left=b.x+"px";b.style.top=b.y+"px";
              break;
            }
            if (rects_collide(brect,srect)
            ) {
              if (enemy.recentHits.includes(i)) continue;
              if (b.phase) {
                enemy.y -= 8;
              }
              enemy.health -= b.damage; //20;
              removeidx = i;
              //hit
              if (b.slow != null) {
                enemy.velocityTrack = b.slow;
              }
              break;
            }
          }
          if (removeidx > -1 && !enemy.recentHits.includes(removeidx)) {
            enemy.recentHits.push(removeidx);
          }
          if (enemy.health < 0) enemy.health = 0;
        }, 14);
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
