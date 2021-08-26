const sdButtonTemplate = document.createElement("template");

sdButtonTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      overflow: hidden;
      position: relative;
      padding: 0 24px;
      font-size: 16px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      background: #f5f5f5;
      color: #212121;
      height: 40px;
      line-height: 40px;
      user-select: none;
      font-family: monospace;
      font-size: 2vh;
      text-transform: uppercase;
    }

    :host(:hover) {
      opacity: 0.8;
      transition: 0.2s ease;
    }

    label {
      pointer-events: none;
    }
  </style>
  <label></label>
`;

class Button extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(sdButtonTemplate.content.cloneNode(true));

    this._label = this._shadowRoot.querySelector("label");

    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("onClick", {
          detail: "Hello from within the Custom Element",
        })
      );
    });
  }

  connectedCallback() {
    if (this.hasAttribute("outlined")) {
      this.applyOutlineStyle();
    }
  }

  applyOutlineStyle() {
    this.style.background = "transparent";
    this.style.border = "1px solid #f5f5f5";
    this.style.color = "#f5f5f5";
  }

  get label() {
    return this.getAttribute("label");
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    this._label.innerHTML = this.label;
  }
}

window.customElements.define("sd-button", Button);
window.dispatchEvent(
  new CustomEvent("has-connected", {
    bubbles: true,
    composed: true,
    detail: "sd-button",
  })
);
