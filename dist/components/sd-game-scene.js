var t2=document.createElement("template");t2.innerHTML=html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <s-c>
    <l-g></l-g>
    <m-g>
      <r-w></r-w>
      <s-p></s-p>
    </m-g>
    <r-g></r-g>
  </s-c>
`;class GameScene extends HTMLElement{buildTable(){const e=this.shadowRoot.querySelector("l-g"),t=this.shadowRoot.querySelector("r-g");var o=document.createElement("table");o.setAttribute("contextmenu","build");var r=document.createElement("tbody");o.appendChild(r);for(var n=e.clientWidth,a=e.clientHeight,d=0;n%100!=0;)--n,d+=1;for(var l=0;a%100!=0;)--a,l+=1;o.style.left=d+"px",o.style.top=l+"px";for(var s=0;s<a/100;s++){for(var c=document.createElement("tr"),i=0;i<n/100;i++){var m=document.createElement("td"),h=document.createElement("div");h.innerHTML="{"+GAME_DATA.towers[i]+"}",h.classList.add("tower"),m.appendChild(h),h.rot=0,c.appendChild(m)}r.appendChild(c)}e.appendChild(o),t.appendChild(o.cloneNode(!0))}buildMenu(){this.shadowRoot.querySelectorAll("td").forEach(e=>{e.addEventListener("click",e=>{var t=this.shadowRoot.querySelector("div[menu]");const o=t?.parentElement;t&&o&&o.removeChild(t);const r=e.srcElement,n=document.createElement("div");n.setAttribute("menu",!0),GAME_DATA.towers.split("").forEach(e=>{const t=document.createElement("div");t.innerText=`${e} tower $200`,t.setAttribute("menu-item",!0),n.appendChild(t)}),r.appendChild(n)})})}rotateTowers(){for(var e=this.shadowRoot.querySelectorAll(".tower"),t=0;t<e.length;t++){var o=e[t];"L-G"==o.parentNode.parentNode.parentNode.parentNode.parentNode.tagName?o.rot<91&&(o.rot+=1,o.style.transform="rotate("+o.rot+"deg)"):(void 0===o.rot&&(o.rot=0),-91<o.rot&&(--o.rot,o.style.transform="rotate("+o.rot+"deg)"))}}connectedCallback(){this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t2.content.cloneNode(!0)),window.setTimeout(()=>{this.buildTable(),this.buildMenu(),setInterval(()=>{this.rotateTowers()},10)},1e3))}}customElements.define("sd-game-scene",GameScene);