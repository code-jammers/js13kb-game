var t2=document.createElement("template");t2.innerHTML=html`
  <link href="components/sd-game-scene.css" rel="stylesheet" />
  <t-b>
    <div></div>
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
`;class GameScene extends HTMLElement{buildTable(e,t,o){const r=o.shadowRoot.querySelector(e);var e=document.createElement("table"),n=document.createElement("tbody");e.appendChild(n);for(var s=r.clientWidth,a=r.clientHeight,d=0;s%100!=0;)--s,d+=1;for(var l=0;a%100!=0;)--a,l+=1;"left"===t?e.style.left=d+"px":e.style.right=d+"px",e.style.top=l+"px";for(var i=0;i<a/100;i++){for(var c=document.createElement("tr"),h=0;h<s/100;h++){var m=document.createElement("td");m.setAttribute("cost","left"===t?100*(h+1):100*(s/100-h)),c.appendChild(m)}n.appendChild(c)}return r.appendChild(e),o.buildTable}closeMenu(){var e=this.shadowRoot.querySelector("div[menu]");const t=e?.parentElement;e&&t&&t.removeChild(e)}buildMenu(){this.shadowRoot.querySelectorAll("td").forEach(n=>{n.addEventListener("click",e=>{this.closeMenu();const t=e.srcElement,r=document.createElement("div");r.setAttribute("menu",!0),GAME_DATA.towers.split("").forEach(o=>{const e=document.createElement("div");e.addEventListener("click",e=>{e.stopPropagation();e=this.money-Number(n.getAttribute("cost"));this.setMoney(e),null==n.towers&&(n.towers=""),n.towers+=o;var t=create_tower(o,tower_decode(o),n.towers);t.classList.add("tower"),n.appendChild(t),n.style.position="relative",this.closeMenu(),setInterval(()=>{this.rotateTowers([t])},10)}),e.innerText=`${o} tower ${n.getAttribute("cost")}`,e.setAttribute("menu-item",!0),r.appendChild(e)}),t.appendChild(r)})})}rotateTowers(e){for(var t=0;t<e.length;t++){var o=e[t];"L-G"==o.parentNode.parentNode.parentNode.parentNode.parentNode.tagName?o.rot<91&&(o.rot+=1,o.style.transform="rotate("+o.rot+"deg)"):(void 0===o.rot&&(o.rot=0),-91<o.rot&&(--o.rot,o.style.transform="rotate("+o.rot+"deg)"))}}setMoney(e){this.money=e;const t=this.shadowRoot.querySelector("div[money]");t.innerText=e}connectedCallback(){this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t2.content.cloneNode(!0)),this.setMoney(5e3),window.setTimeout(()=>{this.buildTable("l-g","left",this)("r-g","right",this),this.buildMenu()},1e3))}}customElements.define("sd-game-scene",GameScene);