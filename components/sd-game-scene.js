var t2 = document.createElement("template");

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <menu type="context" id="share">
    <menu label="share">
      <menuitem label="Twitter" onclick="shareViaTwitter()"></menuitem>
      <menuitem label="Facebook" onclick="shareViaFacebook()"></menuitem>
    </menu>
  </menu>
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
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(t2.content.cloneNode(true));
      window.setTimeout(() => {
        const gc = this.shadowRoot.querySelector("l-g");
        const gc2 = this.shadowRoot.querySelector("r-g");
        var tbl = document.createElement("table");
        tbl.setAttribute("contextmenu", "build");
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
        tbl.style.left = lead + "px";
        tbl.style.top = leadY + "px";
        for (var i = 0; i < ch / 100 /*5*/; i++) {
          var tr = document.createElement("tr");
          for (var j = 0; j < cw / 100 /*5*/; j++) {
            var td = document.createElement("td");
            //td.innerHTML = "{\\?\\}";

            //td.style.transform = "rotate(90deg)";
            var div = document.createElement("div");
            div.innerHTML = "{" + GAME_DATA.towers[j] + "}";
            div.classList.add("tower");
            td.appendChild(div);
            div.rot = 0;

            //	      td.innerHTML = "{\\?\\}";
            tr.appendChild(td);
          }
          tbd.appendChild(tr);
        }
        gc.appendChild(tbl);
        gc2.appendChild(tbl.cloneNode(true));
        this.shadowRoot.querySelectorAll("td").forEach((td) => {
          td.addEventListener("click", (e) => {
            const previousMenu = this.shadowRoot.querySelector('div[menu]');
            const previousMenuParent = previousMenu?.parentElement;
            if(previousMenu && previousMenuParent){
              previousMenuParent.removeChild(previousMenu);
            }
            const el = e.srcElement;
            const menu = document.createElement('div');
            menu.setAttribute('menu', true);
            const menuItem = document.createElement('div')
            menuItem.innerText = 'add frost tower';
            menuItem.setAttribute('menu-item', true);
            const menuItem2 = document.createElement('div')
            menuItem2.innerText = 'add fire tower';
            menuItem2.setAttribute('menu-item', true);
            menu.appendChild(menuItem);
            menu.appendChild(menuItem2);
            el.appendChild(menu);
          });
        });

        setInterval(() => {
          var towers = this.shadowRoot.querySelectorAll(".tower"); //document.getElementsByClassName("tower");
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
        }, 10);
      }, 1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
