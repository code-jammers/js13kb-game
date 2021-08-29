var t2 = document.createElement("template");

t2.innerHTML = html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
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
      window.setTimeout(()=>{
      const gc = this.shadowRoot.querySelector("l-g");
      const gc2 = this.shadowRoot.querySelector("r-g");
      var tbl = document.createElement("table");
      var tbd = document.createElement("tbody");
      tbl.appendChild(tbd);
      var cw = gc.clientWidth;
      var ch = gc.clientHeight;
      var lead=0;
      //cw = cw % 10;
      while (/*cw % 10 !=5 &&*/ cw % 100 != 0) {
          cw -= 1;
	  lead += 1;
      }
      var leadY=0;
      while (/*ch % 10 !=5 &&*/ ch % 100 != 0) {
          ch -= 1;
	  leadY += 1;
      }
      tbl.style.left = lead + "px";
      tbl.style.top = leadY + "px";
      for (var i=0; i<(ch/100/*5*/); i++) {
          var tr=document.createElement("tr");
          for (var j=0; j<(cw/100/*5*/); j++) {
              var td=document.createElement("td");
	      td.innerHTML = "@";
	      td.style.fontSize = "8px";
	      td.style.border = "1px solid rgba(255,255,200,0.5)";
	      td.style.width="100px";
	      td.style.height="100px";
	      tr.appendChild(td);
          }
          tbd.appendChild(tr);
      }
      gc.appendChild(tbl);
      gc2.appendChild(tbl.cloneNode(true));
          },1000);
    }
  }
}

customElements.define("sd-game-scene", GameScene);
