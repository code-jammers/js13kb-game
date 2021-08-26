const sdGameSceneTemplate=document.createElement("template");sdGameSceneTemplate.innerHTML=html`
  <style>
    :host {
      color: #f5f5f5;
    }
  </style>
  GAME
`;class GameScene extends HTMLElement{connectedCallback(){this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(sdGameSceneTemplate.content.cloneNode(!0)))}}window.customElements.define("sd-game-scene",GameScene),window.dispatchEvent(new CustomEvent("has-connected",{bubbles:!0,composed:!0,detail:"sd-game-scene"}));