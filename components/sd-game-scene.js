const notificationManager = new NotificationManager();
const musicManager = new MusicManager();

var t2 = document.createElement("template");

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <planet-health-bar>
    <span>PLANET HEALTH</span>
  </planet-health-bar>
  <information-panel
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
      <button id="menuButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#5f6368"
        >
          <path
            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
          />
        </svg>
      </button>
    </div>
  </information-panel>
  <defense-grid
    ><l-g></l-g><m-g><r-w></r-w></m-g><r-g></r-g
  ></defense-grid>
  <sd-game-menu popover id="gameMenu"></sd-game-menu>
  <div id="backdrop" style="display:none"></div>
`;

class GameScene extends HTMLElement {
  constructor() {
    super();
    this.mm = null;
  }

  buildTable(query, side, ctx) {
    notificationManager.sendNotification(
      `Attack ${GAME_DATA.wave + 1}`,
      "Build towers to defend this planet from invasion",
      6000,
      "rgba(238, 153, 18, 1)"
    );
    const gc = ctx.shadowRoot.querySelector(query);
    var table = document.createElement("table");

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
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
      table.style.left = lead + "px";
    } else {
      table.style.right = lead + "px";
    }
    table.style.top = leadY / 2 + "px";
    table.style.bottom = leadY / 2 + "px";
    for (var i = 0; i < ch / 100; i++) {
      var tr = document.createElement("tr", document);
      for (var j = 0; j < cw / 100; j++) {
        var td = document.createElement("td", document);
        td.setAttribute(
          "cost",
          side === "left" ? (j + 1) * 100 : (cw / 100 - j) * 100
        );
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    gc.appendChild(table);
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
        let towers = GAME_DATA.towers.split(",");
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

        towers.forEach((tower) => {
          const mi = document.createElement("div");
          mi.setAttribute(tower, "");
          mi.setAttribute("legend", "");
          const tpCost = Number(td.getAttribute("cost"));
          const cost =
            tower === "blaster"
              ? tpCost
              : tower === "thermal"
              ? tpCost * 1.5
              : tower === "phaser"
              ? tpCost * 2
              : tpCost * 2.5;
          mi.innerHTML = `<span ${nextLevel}></span> ${cost}`;
          mi.setAttribute("menu-item", true);
          mi.addEventListener("click", (e) => {
            e.stopPropagation();
            if (cost > this.money) {
              notificationManager.sendNotification(
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
                  createBullet(cn, chg.x, chg.y);
                  break;
                }
              }
              for (var i = 0; i < GAME_DATA.bullets.length; i++) {
                var bu = GAME_DATA.bullets[i]; //bullet upgrade
                bu.damage += 1.3;
              }
              this.closeMenu();
              return;
            } else td.towers += tower;

            var div = createTower(tower, td.towers); //document.createElement("div");
            div.towerId = tower;
            div.classList.add("tower");
            td.appendChild(div);
            td.style.position = "relative";
            this.closeMenu();
          });
          menu.appendChild(mi);
        });

        if (isUpgrading) {
          const cost = Number(td.getAttribute("cost"));
          const mi = document.createElement("div");
          mi.setAttribute("blaster", "");
          mi.setAttribute("legend", "");
          mi.style.color = "red";
          mi.innerHTML = `<span sell></span> sell ${cost}`;
          mi.setAttribute("menu-item", true);
          mi.addEventListener("click", (e) => {
            e.stopPropagation();
            const amt = this.money + cost;
            this.setMoney(amt);
            td.towers = "";
            td.children[0].remove();
            //removeOrphanBullets();
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
    // document.body?.addEventListener("click", () => {
    //   if (!this.mm) {
    //     this.mm = new MusicManager();
    //     this.mm.this.mm.playBackgroundMusic();
    //   }
    // });

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(t2.content.cloneNode(true));

      const menuElement = this.shadowRoot.querySelector("#gameMenu");
      const triggerElement = this.shadowRoot.querySelector("#menuButton");
      const backdropElement = this.shadowRoot.querySelector("#backdrop");
      new GameMenu(menuElement, triggerElement, backdropElement);

      this.lastEnemyImage = 1;

      if (this.clientWidth < 800) {
        this.setMoney(10000);
      } else {
        this.setMoney(5000);
      }

      setTimeout(() => {
        this.buildTable("l-g", "left", this)("r-g", "right", this);
        this.buildMenu();
        setTimeout(() => {
          var top = document.createElement("div");
          top.id = "sst";
          var mid = document.createElement("div");
          mid.id = "ssm";
          var bot = document.createElement("div");
          bot.id = "ssb";
          /*var */ window.ene = document.createElement("div");
          ene.velocity = 1; // 1px per game loop iteration
          ene.velocityTrack = 1;
          ene.health = 100;
          ene.id = "ene";
          ene.width = 100;
          ene.height = 100;
          // mid.style.backgroundColor = "white"; //"green";
          top.appendChild(mid);
          mid.appendChild(bot);
          ene.appendChild(top);
          var brect = document.body.getBoundingClientRect();
          ene.style.left = brect.width / 2.0 - 50 + "px";
          ene.style.top = "0px";
          ene.y = 0;
          ene.x = brect.width / 2.0 - 15;
          ene.recentHits = [];
          dba(ene);
          let wave = 3;
          let sPassed = 0;
          // game loop
          var gameLoopInterval = setInterval(() => {
            if (GAME_DATA.gameOver) return;
            this.shadowRoot.querySelector(
              "[main-title]"
            ).innerText = `Space Defense Engineer (level ${Math.floor(
              wave / 3
            )}/${GAME_DATA.waves?.[0].length / 3})`;
            if (ene.y > document.body.getBoundingClientRect().height) {
              sPassed += 1;
              const planetHealthBar =
                this.shadowRoot.querySelector("planet-health-bar");
              planetHealthBar.style.width = `${100 - sPassed * 5}%`;
              if (sPassed >= 20) {
                gameOver(false);
              }
            }
            if (
              ene.y > document.body.getBoundingClientRect().height ||
              ene.health <= 0
            ) {
              GAME_DATA.ei += 1;
              ene.y = 40;
              ene.recentHits = [];
              ene.health = 100;

              if (wave < GAME_DATA.waves[0].length) {
                wave++;

                if (wave % 3 === 0) {
                  let newMoney;
                  if (this.clientWidth < 800) {
                    newMoney = 2000 + wave * 5;
                    this.setMoney(this.money + newMoney);
                  } else {
                    newMoney = 1000 + wave * 5;
                    this.setMoney(this.money + newMoney);
                  }

                  notificationManager.sendNotification(
                    `Level ${wave / 3}`,
                    `Contract Paid + $${newMoney}`,
                    3000,
                    "rgba(238, 153, 18, 1)"
                  );

                  var enemyImage = document.querySelector("#sst");
                  if (this.lastEnemyImage === 1) {
                    this.lastEnemyImage = 2;
                    enemyImage.style.backgroundImage =
                      "url('assets/images/ship.png')";

                    document.body.style.background =
                      "url('assets/images/background1.png')";
                  } else if (this.lastEnemyImage === 2) {
                    this.lastEnemyImage = 3;
                    enemyImage.style.backgroundImage =
                      "url('assets/images/ship2.png')";
                    document.body.style.background =
                      "url('assets/images/background2.png')";
                  } else if (this.lastEnemyImage === 3) {
                    this.lastEnemyImage = 1;
                    enemyImage.style.backgroundImage =
                      "url('assets/images/ship3.png')";
                    document.body.style.background =
                      "url('assets/images/background3.png')";
                  }
                }
              } else {
                gameOver(true);
              }
            }
            function gameOver(win) {
              clearInterval(gameLoopInterval);
              GAME_DATA.gameOver = true;
              notificationManager.sendNotification(
                win ? "Success!" : "Fired!",
                win
                  ? "You have fulfilled your contract by successfully defending this planet."
                  : "You have failed to defend this planet.",
                250000,
                win ? "green" : "red"
              );
              return;
            }

            bot.style.width = ene.health;

            ene.y += Math.min(Math.floor(ene.velocityTrack), 1); //1;
            ene.velocityTrack += ene.velocityTrack;
            ene.velocityTrack = Math.min(ene.velocityTrack, 1);
            ene.style.top = ene.y + "px";

            GAME_DATA.wave = wave;
            // 'body' selector will return document.body
            window.gameSync(
              /*dom:*/ (selector) => {
                if (selector.startsWith("#") && selector.includes("-"))
                  selector = "#" + CSS.escape(selector.substring(1));
                var domEl = document.querySelector(selector);
                if (!domEl)
                  return document.querySelector("sd-game-scene").shadowRoot.querySelector(selector);
                return domEl;
              },
              /*data:*/ GAME_DATA
            );
          }, 10);
        }, 6000);
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
