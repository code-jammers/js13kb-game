const sdLoadingSceneTemplate = document.createElement("template");

sdLoadingSceneTemplate.innerHTML = html`
  <style>
    loading-scene {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
    }

    loading-scene > div {
      font-family: monospace;
      font-size: 14px;
      margin-top: 4px;
    }
  </style>
  <loading-scene>
    <img src="assets/images/loader.gif" />
    <div>Loading...</div>
  </loading-scene>
`;

class LoadingScene extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(
        sdLoadingSceneTemplate.content.cloneNode(true)
      );
    }
  }
}

window.customElements.define("sd-loading-scene", LoadingScene);
