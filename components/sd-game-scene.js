var t2 = document.createElement("template");

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <t-b>
    <div legend>
    <div blaster title="Single target turret. Standard space defense engineer issue.">
        Blaster 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div thermal title="Hot. Hot. Hot. High area of effect damage that literally incinerates enemies.">
        Thermal Detonator 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div phaser title="Lazer turret that blasts enemies in a line and disintegrates them.">
        Phaser 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div particle title="Zoom. Increases the fire rate of attached turrets.">
        Particle Accelerator 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div satellite title="Avanced intel gathering machine that increases the range of attached turrets.">
        Satellite 1<span one></span> 2<span two></span> 3<span three></span>
      </div>
      <div quantum title="Quantum drive that provides a damage boost and well as AI programming for rotation of attached turrets.">
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
    tbl.style.top = leadY + "px";
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
          menuItem.addEventListener("click", (e) => {
            e.stopPropagation();
            const amt = this.money - Number(td.getAttribute("cost"));
            this.setMoney(amt);
            if (td.towers == null) td.towers = "";
            td.towers += tower;

            /*if (td.towers.length > 1){  
	    setInterval(()=>{
		for (var i=0; i<td.childNodes.length; i++) {
		    var n=td.childNodes[i];
		    if (n.rot===undefined || n.rot == 0) continue;
		    if (n.rot > 0) td.childNodes[i].rot -= 1;
		    if (n.rot<0) td.childNodes[i].rot += 1;
		    console.log(n.rot);
		    
                    n.style.transform = "rotate("+n.rot+"deg)";
		}
	    }, 100);
	    }*/
            //setTimeout(()=>{
            var div = create_tower(tower, tower_decode(tower), td.towers); //document.createElement("div");
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
          menuItem.innerText = `${tower} tower ${td.getAttribute("cost")}`;
          menuItem.setAttribute("menu-item", true);
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
      if (tag == "L-G") {
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
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
