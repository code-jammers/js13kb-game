var t2 = document.createElement("template");

t2.innerHTML = `<link href="components/sd-game-scene.css" rel="stylesheet"> GAME`;

class GameScene extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(t2.content.cloneNode(true));
    }
  }
}

customElements.define("sd-game-scene", GameScene);
