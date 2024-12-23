var t4 = document.createElement("template",document);

t4.innerHTML = ` <l-s><link href="components/sd-loading-scene.css" rel="stylesheet"> <img src="assets/images/loader.gif" /> <div>Loading...</div></l-s> `;

class LoadingScene extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(t4.content.cloneNode(true));
    }
  }
}

customElements.define("sd-loading-scene", LoadingScene);
