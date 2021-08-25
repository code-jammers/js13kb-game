const sdGameSceneTemplate = document.createElement("template");

sdGameSceneTemplate.innerHTML = html`
  <style>
    :host {
      color: #f5f5f5;
    }
  </style>
  GAME
`;

class GameScene extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(sdGameSceneTemplate.content.cloneNode(true));
    }
  }
}

window.customElements.define("sd-game-scene", GameScene);
window.dispatchEvent(
  new CustomEvent("has-connected", {
    bubbles: true,
    composed: true,
    detail: "sd-game-scene",
  })
);
