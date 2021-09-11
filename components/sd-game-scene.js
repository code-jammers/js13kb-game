var t2 = document.createElement("template");

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
      <div particle title="Zoom. Increases the fire rate of attached turrets.">
        Particle Accelerator 1<span one></span> 2<span two></span> 3<span
          three
        ></span>
      </div>
      <div
        satellite
        title="Avanced intel gathering machine that increases the range of attached turrets."
      >
        Satellite 1<span one></span> 2<span two></span> 3<span three></span>
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
    var waveNotification = document.createElement("a");
    waveNotification.innerHTML = "WAVE " + (GAME_DATA.wave + 1);
    waveNotification.style.fontSize = "88px";
    waveNotification.style.color = "green";
    waveNotification.style.zIndex = "1000000";
    waveNotification.style.width = "100%";
    waveNotification.style.position = "absolute";
    waveNotification.style.left = "0px";
    waveNotification.style.top = "40px";
    waveNotification.style.textAlign = "center";
    document.body.appendChild(waveNotification);
    setTimeout(function () {
      waveNotification.remove();
    }, 6000);
    const gc = ctx.shadowRoot.querySelector(query);
    var tbl = document.createElement("table");

    var tbd = document.createElement("tbody");
    tbl.appendChild(tbd);
    var cw = gc.clientWidth;
    var ch = gc.clientHeight;
    var lead = 0;
    //cw = cw % 10;
    while (/*cw % 10 !=5 &&*/ cw % 100 != 0) {
      cw -= 1;
      lead += 1;
    }
    var leadY = 0;
    while (/*ch % 10 !=5 &&*/ ch % 100 != 0) {
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
    for (var i = 0; i < ch / 100 /*5*/; i++) {
      var tr = document.createElement("tr");
      for (var j = 0; j < cw / 100 /*5*/; j++) {
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
        GAME_DATA.towers.split("").forEach((tower) => {
          const menuItem = document.createElement("div");
          var decodedTower = tower_decode(tower);
          var typidx =
            parseInt(
              decodedTower[5] + "" + decodedTower[6] + "" + decodedTower[7],
              2
            ) % GAME_DATA.tower_types.length;
          var type = GAME_DATA.tower_types[typidx];

          menuItem.setAttribute(type, "");
          menuItem.setAttribute("legend", "");
          menuItem.innerHTML = `<span three></span> ${td.getAttribute(
            "cost"
          )}`;
          menuItem.setAttribute("menu-item", true);
          menuItem.addEventListener("click", (e) => {
            e.stopPropagation();
            const amt = this.money - Number(td.getAttribute("cost"));
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
                  //for (var i=1;i<=cn.level;i++) {
                  //    setTimeout(function(){create_bullet(cn.childNodes[0])},cn.level*500);
                  //}
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
                if (bu.phase) {
                  bu.setback *= 2;
                }
              }
              this.closeMenu();
              return;
            } else td.towers += tower;

            //setTimeout(()=>{
            var div = create_tower(tower, tower_decode(tower), td.towers); //document.createElement("div");
            div.towerId = tower;
            div.classList.add("tower");
            td.appendChild(div);
            td.style.position = "relative";
            //div.innerHTML = `{${tower}}`;
            this.closeMenu();
            setInterval(() => {
              this.rotateTowers([div]);
            }, 10);
            //}, 2000);
          });
          menu.appendChild(menuItem);
        });
        el.appendChild(menu);
      });
    });
  }

  rotateTowers(towers) {
    //console.log(towers.length);
    //var gc2_left=window.getComputedStyle(gc2).left.replace("px","");
    //console.log(gc2_left);
    for (var i = 0; i < towers.length; i++) {
      var t = towers[i];
      /*console.log(
t.parentNode//td
.parentNode//tr
.parentNode//tbody
.parentNode//table
.parentNode//l-g or r-g
.tagName
);*/
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
      this.setMoney(5000);

      window.setTimeout(() => {
        this.buildTable("l-g", "left", this)("r-g", "right", this);
        this.buildMenu();
        //draw enemy ship/ufo
        var top = document.createElement("div");
        top.style.borderRadius = "50%";
        top.style.width = "100%";
        top.style.height = "100%";
        var mid = document.createElement("div");
        mid.style.width = "100%";
        mid.style.top = "32px";
        mid.style.position = "relative";
        mid.style.display = "block";
        mid.style.height = "6px";
        mid.style.backgroundColor = "green";

        var bot = document.createElement("div");
        bot.style.width = "18px";
        bot.style.height = "15px";
        bot.style.bottom = "-2px";
        bot.style.left = "6px";
        bot.style.position = "relative";
        bot.style.display = "block";

        /*var */ window.enemy = document.createElement("div");
        enemy.health =
          GAME_DATA.waves[GAME_DATA.wave][GAME_DATA.ei].charCodeAt(0);
        top.style.backgroundImage = "url(assets/images/rocket.png)";
        top.style.backgroundRepeat = "no-repeat";
        top.style.backgroundSize = "cover";
        top.style.transform = "rotate(180deg)";
        enemy.style.height = "30px";
        enemy.style.width = "30px";
        enemy.width = 30;
        enemy.height = 30;
        bot.style.borderRadius = "50%";
        // bot.style.backgroundColor = "rgba(0,0,0,0.3)"; //"red";
        top.origBg = "transparent";
        top.currBg = top.origBg;
        top.style.backgroundColor = top.origBg;
        //mid.innerHTML = enemy.health;
        mid.style.backgroundColor = "white"; //"green";
        top.appendChild(mid);
        mid.appendChild(bot);
        enemy.appendChild(top);
        enemy.style.position = "absolute";
        var brect = document.body.getBoundingClientRect();
        enemy.style.left = brect.width / 2.0 - 15 + "px";
        enemy.style.top = "40px";
        enemy.y = 40;
        enemy.x = brect.width / 2.0 - 15;
        enemy.recentHits = [];
        document.body.appendChild(enemy);
        // game loop
        var gmLpIntMs = 14; // game loop interval in milliseconds
        var blnkIt = 15; //blink iterations
        enemy.lastHitMs = -1 - gmLpIntMs * blnkIt;
        var gmLpId = setInterval(() => {
          if (GAME_DATA.gameOver) return;
          if (enemy.lastHitMs >= GAME_DATA.waveTimeMs - gmLpIntMs * blnkIt) {
            /*if (top.currBg!="red") top.currBg = "red";
            else top.currBg = top.origBg;*/
            //instead of toggling just keep it red during the blnkIt time frame:
            // top.currBg = "red";
          } else top.currBg = top.origBg;
          top.style.backgroundColor = top.currBg;
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
              h.innerHTML = " ";
              h.style.position = "absolute";
              h.style.borderRadius = "50%";
              h.style.width = "12px";
              h.style.height = "12px";
              h.width = 12;
              h.height = 12;
              h.style.border = "1px solid white";
              document.body.appendChild(h);
              h.deg = 0; //0-360
              return h;
            }
            function renderHench(h, i, active) {
              if (enemy.y <= 50) h.dead = null;
              if (active && h.dead == null) h.style.visibility = "visible";
              else h.style.visibility = "hidden";
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
              var ai = i; // adjusted-i
              if (i > 4) {
                var moves = h.deg % 360;
                h.deg = moves + 0.07;
                moves = Math.floor(moves);
                while (moves > 0) {
                  ai = (ai + 1) % offsets.length;
                  moves -= 1;
                }
              }
              var xs = offsets[ai][0] >= 0 ? 1 : -1; //x-sign
              var ys = offsets[ai][1] >= 0 ? 1 : -1; //y-sign
              var cxo = xs * (enemy.width / 2.0) + xs * (h.width / 2.0); //characters x offsets
              var cyo = ys * (enemy.height / 2.0) + ys * (h.height / 2.0); //characters y offsets
              var x = enemy.x + cxo + xs * offsets[ai][0];
              var y = enemy.y + cyo + ys * offsets[ai][1];
              h.x = x;
              h.y = y;
              h.style.left = x + "px";
              h.style.top = y + "px";
              h.style.backgroundColor = i < 4 ? "red" : "rgba(12, 160, 218, 1)";
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

          enemy.y += 1;
          enemy.style.top = enemy.y + "px";
          var removeidx = -1;
          for (var i = 0; i < GAME_DATA.bullets.length; i++) {
            var b = GAME_DATA.bullets[i];
            var brect = b.getBoundingClientRect(); //bullet rect
            var srect = enemy.getBoundingClientRect(); //ship rect
            var mpx = brect.left + brect.width / 2; //midpoint x
            var mpy = brect.top + brect.height / 2;
            var hpad = 4; //16;//horiz pad
            var vpad = 4; //18;//vert pad

            for (var j = 0; j < orbHench.length; j++) {
              var h = orbHench[j];
              if (h.dead) continue;
              var bmx = brect.left + brect.width / 2.0; //bullet mid x
              var bmy = brect.top + brect.height / 2.0; //bullet mid y
              //console.log (bmx,bmy,h.x,h.y);asdfjk;
              if (
                bmx - hpad > h.x &&
                bmx < h.x + hpad + h.width &&
                bmy > h.y - vpad &&
                bmy < h.y + h.height + vpad
              ) {
                removeidx = i;
                h.dead = {};
                break;
              }
            }
            for (var j = 0; j < stcHench.length; j++) {
              var h = stcHench[j];
              if (h.dead) continue;
              var bmx = brect.left + brect.width / 2.0; //bullet mid x
              var bmy = brect.top + brect.height / 2.0; //bullet mid y
              if (
                bmx > h.x &&
                bmx < h.x + h.width &&
                bmy > h.y &&
                bmy < h.y + h.height
              ) {
                removeidx = i;
                h.dead = {};
                break;
              }
            }
            if (removeidx > -1) {
              break;
              b.reset = true;
            }
            if (
              mpx + hpad >= srect.left &&
              mpx - hpad <= srect.left + srect.width &&
              mpy + vpad >= srect.top &&
              mpy - vpad <= srect.top + srect.height
              /*((brect.left > srect.left && brect.left<srect.left+srect.width)
                 ||(brect.left+brect.width < srect.left+srect.width && brect.left+brect.width>srect.left))
                && ((brect.top > srect.top && brect.top<srect.top+srect.height)
                ||(brect.top+brect.height < srect.top+srect.height && brect.top+brect.height>srect.top))*/ //todo:for better accuracy try instead to check if brect midpoint is within srect
            ) {
              if (enemy.recentHits.includes(i)) continue;
              if (b.phase) {
                enemy.y -= 8;
              }
              enemy.health -= b.damage; //20;
              removeidx = i;
              b.reset = true;
              //hit
              enemy.lastHitMs = GAME_DATA.waveTimeMs;
              break;
            }
          }
          if (removeidx > -1 && !enemy.recentHits.includes(removeidx)) {
            enemy.recentHits.push(removeidx);
          }
          /*          enemy.recentHits = removeidx;
          setTimeout(function(){enemy.recentHit=-1},1200);*/
          /*var removed = GAME_DATA.bullets[removeidx];
          if (removeidx > -1) GAME_DATA.bullets.splice(removeidx,1);*/
          if (enemy.health < 0) enemy.health = 0;
          // mid.innerHTML = enemy.health;
          /*setTimeout(function(){GAME_DATA.bullets.push(removed)},1000);*/
          GAME_DATA.waveTimeMs += gmLpIntMs;
        }, gmLpIntMs);
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
