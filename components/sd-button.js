var t1 = document.createElement("template");

t1.innerHTML = `
  <link href="components/sd-button.css" rel="stylesheet">
  <label></label>
`;

class Button extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(t1.content.cloneNode(true));

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

customElements.define("sd-button", Button);

