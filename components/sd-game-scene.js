var t2 = document.createElement("template");

let showingNotification = false;
let notifications = [];
setNotification = (text, subtext, timeout, color) => {
  if (showingNotification) {
    if (text !== notifications?.[0]?.text) {
      notifications.push({ text, subtext, timeout, color });
    }
    return;
  }
  try {
    showingNotification = true;
    var n = dcr("a");
    n.id = "not";
    n.innerHTML = `<div>${text}</div><div sub>${subtext}</div>`;
    n.style.color = color;
    dba(n);
    setTimeout(() => {
      n.remove();
      showingNotification = false;
      if (notifications.length > 0) {
        setNotification(
          notifications[0].text,
          notifications[0].subtext,
          notifications[0].timeout,
          notifications[0].color
        );
        notifications.shift();
      }
    }, timeout);
  } catch (_) {}
};

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <t-a><span>PLANET HEALTH</span>
</t-b>
</t-a>
  <t-b
    ><div legend>
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
    <div>
    <div main-title>Space Defense Engineer</div>
    <div money></div>
</div>
    </t-b
  ><s-c
    ><l-g></l-g><m-g><r-w></r-w><s-p></s-p></m-g><r-g></r-g
  ></s-c>
`;

class GameScene extends HTMLElement {
  buildTable(query, side, ctx) {
    setNotification(
      `Level ${G.wave + 1}`,
      "Build towers to defend this planet from invasion",
      6000,
      "rgba(238, 153, 18, 1)"
    );
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
      var tr = dcr("tr", document);
      for (var j = 0; j < cw / 100; j++) {
        var td = dcr("td", document);
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
        const menu = dcr("div");
        menu.setAttribute("menu", true);
        let towers = G.towers.split("");
        let isUpgrading = false;
        const s = td.querySelector("span");
        let nextLevel =
          s?.getAttribute("one") === ""
            ? "two"
            : s?.getAttribute("two") === ""
            ? "three"
            : s?.getAttribute("three") === ""
            ? "four"
            : null;
        if (!nextLevel) {
          nextLevel = "one";
        }

        if (Boolean(td.towers)) {
          towers = towers.filter((l) => td.towers.includes(l));
          isUpgrading = true;
        }

        if (nextLevel === "four") {
          towers = [];
        }

        towers.forEach((t) => {
          const mi = dcr("div");
          var dt = tower_decode(t);
          var typidx =
            parseInt(dt[5] + "" + dt[6] + "" + dt[7], 2) % G.tower_types.length;
          var type = G.tower_types[typidx];
          mi.setAttribute(type, "");
          mi.setAttribute("legend", "");
          const tpCost = Number(td.getAttribute("cost"));
          const cost =
            type === "blaster"
              ? tpCost
              : type === "thermal"
              ? tpCost * 1.5
              : type === "phaser"
              ? tpCost * 2
              : tpCost * 2.5;
          mi.innerHTML = `<span ${nextLevel}></span> ${cost}`;
          mi.setAttribute("menu-item", true);
          mi.addEventListener("click", (e) => {
            e.stopPropagation();
            if (cost > this.money) {
              setNotification(
                `Insufficient Funds`,
                "Defeating waves will earn you money",
                4000,
                "red"
              );
              this.closeMenu();
              return;
            }
            const amt = this.money - cost;
            this.setMoney(amt);
            if (td.towers == null) td.towers = "";
            if (td.towers.includes(t)) {
              //upgrade
              for (var i = 0; i < td.childNodes.length; i++) {
                var cn = td.childNodes[i]; //child node
                if (cn.towerId === t) {
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
              for (var i = 0; i < G.bullets.length; i++) {
                var bu = G.bullets[i]; //bullet upgrade
                // bu.damage += 5;
              }
              this.closeMenu();
              return;
            } else td.towers += t;

            var div = create_tower(tower_decode(t), td.towers); //dcr("div");
            div.towerId = t;
            div.classList.add("tower");
            td.appendChild(div);
            td.style.position = "relative";
            this.closeMenu();
          });
          menu.appendChild(mi);
        });

        if (isUpgrading) {
          const cost = Number(td.getAttribute("cost")) - 100;
          const mi = dcr("div");
          mi.setAttribute("blaster", "");
          mi.setAttribute("legend", "");
          mi.innerHTML = `<span sell></span> sell ${cost}`;
          mi.setAttribute("menu-item", true);
          mi.addEventListener("click", (e) => {
            e.stopPropagation();
            const amt = this.money + cost;
            this.setMoney(amt);
            td.towers = "";
            td.children[0].remove();
            removeOrphanBullets();
            this.closeMenu();
          });
          menu.appendChild(mi);
        }
        el.appendChild(menu);
      });
    });
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
      this.setMoney((this.clientWidth * 14) / 2);

      setTimeout(() => {
        this.buildTable("l-g", "left", this)("r-g", "right", this);
        this.buildMenu();
        //draw ene ship/ufo
        var top = dcr("div");
        top.id = "sst";

        var mid = dcr("div");
        mid.id = "ssm";

        var bot = dcr("div");
        bot.id = "ssb";

        /*var */ window.ene = dcr("div");
        ene.velocity = 1; // 1px per game loop iteration
        ene.velocityTrack = 1.0;
        ene.health = 100;
        ene.id = "ene";
        ene.width = 30;
        ene.height = 30;
        mid.style.backgroundColor = "white"; //"green";
        top.appendChild(mid);
        mid.appendChild(bot);
        ene.appendChild(top);
        var brect = document.body.getBoundingClientRect();
        ene.style.left = brect.width / 2.0 - 15 + "px";
        ene.style.top = "40px";
        ene.y = 40;
        ene.x = brect.width / 2.0 - 15;
        ene.recentHits = [];
        dba(ene);
        let wave = 3;
        // game loop
        var gmLpId = setInterval(() => {
          if (G.gameOver) return;
          if (ene.y > document.body.getBoundingClientRect().height) {
            const pHP = this.shadowRoot.querySelector("t-a");
            pHP.style.width = `${100 - (G.ei + 1) * 5}%`;
            if (pHP.style.width === "0%") {
              gameOver(false);
            }
          }
          if (
            ene.y > document.body.getBoundingClientRect().height ||
            ene.health <= 0
          ) {
            G.ei += 1;
            ene.y = 40;
            ene.recentHits = [];
            ene.health = 100 + (wave / 3) * 3;
            wave++;
            if (wave % 3 === 0) {
              setNotification(
                `Level ${wave / 3}`,
                `Contract Paid + $${(wave / 3) * 400}`,
                3000,
                "rgba(238, 153, 18, 1)"
              );
              this.setMoney(this.money + (wave / 3) * 500);
            }
            if (G.ei >= G.waves[G.wave].length) {
              gameOver(true);
            }
          }
          function gameOver(win) {
            clearInterval(gmLpId);
            G.gameOver = true;
            setNotification(
              win ? "Success!" : "Fired!",
              win
                ? "You have fulfilled your contract by successfully defending this planet."
                : "You have failed to defend this planet.",
              250000,
              win ? "green" : "red"
            );
            return;
          }

          //draw henchmen ships
          function drawHenchmenShips() {
            function createHench() {
              var h = dcr("div");
              h.classList.add("hen");
              var img = dcr("img");
              img.src = "assets/images/rocket.png";
              img.classList.add("hei");
              h.appendChild(img);
              h.width = 12;
              h.height = 12;
              dba(h);
              h.deg = 0; //0-360
              return h;
            }
            function renderHench(h, i, active) {
              if (ene.y <= 50) h.dead = null;
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
              var cxo = xs * (ene.width / 2.0) + xs * (h.width / 2.0); //characters x offsets
              var cyo = ys * (ene.height / 2.0) + ys * (h.height / 2.0); //characters y offsets
              var x = ene.x + cxo + xs * offsets[i][0];
              var y = ene.y + cyo + ys * offsets[i][1];
              h.x = x;
              h.y = y;
              h.style.left = x + "px";
              h.style.top = y + "px";
            }
            var orbHenchCnt = 3;
            var stcHenchCnt = 3;
            if (window.stcHench == null) window.stcHench = [];
            if (window.orbHench == null) window.orbHench = [];
            while (stcHench.length < 4) {
              stcHench.push(createHench());
            }
            while (orbHench.length < 4) {
              orbHench.push(createHench());
            }
            for (var i = 0; i < 8; i++) {
              var h = i < 4 ? stcHench[i] : orbHench[i % 4];
              var active =
                i < 4 ? stcHenchCnt >= i + 1 : orbHenchCnt >= (i % 4) + 1;
              renderHench(h, i, active);
            }
          }
          drawHenchmenShips();

          if (ene.health < 50) ene.style.color = "red";
          else ene.style.color = "green";

          if (ene.health > 80) {
            mid.style.backgroundColor = "green";
          } else if (ene.health > 50) {
            mid.style.backgroundColor = "yellow";
          } else {
            mid.style.backgroundColor = "red";
          }
          mid.style.width = ene.health / 4;

          ene.y += Math.min(Math.floor(ene.velocityTrack), 1); //1;
          ene.velocityTrack += ene.velocityTrack;
          ene.velocityTrack = Math.min(ene.velocityTrack, 1);
          ene.style.top = ene.y + "px";
          var removeidx = -1;
          for (var i = 0; i < G.bullets.length; i++) {
            var b = G.bullets[i];
            var brect = b.getBoundingClientRect(); //bullet rect
            var srect = ene.getBoundingClientRect(); //ship rect
            for (var j = 0; j < 8 /*orbHench.length*/; j++) {
              var h = j < 4 ? stcHench[j] : orbHench[j % 4];
              if (h.dead) continue;
              if (
                rects_collide(
                  {
                    left: h.x,
                    top: h.y + h.height,
                    width: h.width,
                    height: h.height,
                  },
                  brect
                )
              ) {
                removeidx = i;
                h.dead = true;
                break;
              }
            }
            if (removeidx > -1) {
              b.reset = true;
              b.x = b.ox;
              b.y = b.oy;
              b.style.left = b.x + "px";
              b.style.top = b.y + "px";
              break;
            }
            if (rects_collide(brect, srect)) {
              if (ene.recentHits.includes(i)) continue;
              if (b.phase) {
                ene.y -= 8;
              }
              ene.health -= b.damage; //20;
              removeidx = i;
              //hit
              if (b.slow != null) {
                ene.velocityTrack = b.slow;
              }
              break;
            }
          }
          if (removeidx > -1 && !ene.recentHits.includes(removeidx)) {
            ene.recentHits.push(removeidx);
          }
          if (ene.health < 0) ene.health = 0;
        }, 14);
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
