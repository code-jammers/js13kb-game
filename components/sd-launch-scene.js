const sdLaunchSceneTemplate = document.createElement("template");

sdLaunchSceneTemplate.innerHTML = html`
  <style>
    main-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    h1 {
      font-family: system-ui;
      font-size: 72px;
      line-height: 72px;
      letter-spacing: 5px;
      padding: 0;
      margin: 96px 0 0 0;
      max-width: 1040px;
    }

    p {
      font-family: monospace;
      padding: 0;
      margin: 24px 0 0 0;
      font-size: 18px;
      line-height: 26px;
      max-width: 50vh;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 40px;
        line-height: 40px;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        margin: 24px 10% 0 10%;
      }
    }

    sd-button {
      margin-top: 24px;
      max-width: 200px;
      width: 100%;
    }
    label {
      pointer-events: none;
    }
  </style>
  <main-content>
    <h1>Space Defense Engineers</h1>
    <p>
      Planetary protection strategy game. Acquire lucrative contracts and lead a
      fulfilling career defending planets from meeting their untimely demise.
    </p>

    <sd-button play label="Play"></sd-button>
    <sd-button outlined label="Controls"></sd-button>
  </main-content>
`;

class LaunchScene extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(
        sdLaunchSceneTemplate.content.cloneNode(true)
      );

      this.shadowRoot
        .querySelector("sd-button[play]")
        .addEventListener("onClick", () => {
          window.dispatchEvent(
            new CustomEvent("show-game", { bubbles: true, composed: true })
          );
        });

      this.shadowRoot
        .querySelector("sd-button[outlined]")
        .addEventListener("onClick", () => {
          window.dispatchEvent(
            new CustomEvent("show-controls", { bubbles: true, composed: true })
          );
        });
    }
  }
}

window.customElements.define("sd-launch-scene", LaunchScene);
window.dispatchEvent(
  new CustomEvent("has-connected", {
    bubbles: true,
    composed: true,
    detail: "sd-launch-scene",
  })
);
