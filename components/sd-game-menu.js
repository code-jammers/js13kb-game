(() => {
  const html = htm.bind(preact.h);
  const { Component, createRef } = preact;
  const register = preactCustomElement;

  class SDGameMenu extends Component {
    static tagName = "sd-game-menu";
    static observedAttributes = ["page"];
    input = createRef();
    checkbox = createRef();

    componentDidUpdate() {
      const volume = localStorage.getItem("volume") ? Number(localStorage.getItem("volume")) : 50;
      const enableGameSound = localStorage.getItem("enableGameSound") === "true";

      this.input.current.value = volume;
      this.checkbox.current.checked = enableGameSound;
    }

    setGameSound(checked) {
      localStorage.setItem("enableGameSound", checked?.toString());
      window.dispatchEvent(new CustomEvent("enableGameSound-changed"));
    }

    setVolume(volume) {
      localStorage.setItem("volume", volume?.toString() || "0");
      window.dispatchEvent(new CustomEvent("volume-changed"));
    }

    render({ page }) {
      return html`
        <style>
          [popover] {
            padding: 0;
            outline: none;
            border-radius: 12px;
            border: none;
            z-index: 999999;
          }

          .menu {
            border: 4px solid #111;
            padding: 24px;
            width: 327px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background: #000;
          }

          .menu button {
            padding: 12px;
            cursor: pointer;
            border: none;
            background-color: #212121;
            color: #f5f5f5;
            border-radius: 0px;
            transition: background-color 0.2s;
            font-family: "Audiowide", sans-serif;
            font-weight: 400;
            font-style: normal;
            text-transform: uppercase;const volume = localStorage.getItem("volume") ? Number(localStorage.getItem("volume")) : 50;

          }

          .menu button:hover {
            background-color: rgba(238, 153, 18, 1);
            color: #212121;
          }

          .menu-title {
            font-size: 24px;
            color: rgba(238, 153, 18, 1);
            display: grid;
          }

          .menu-version {
            font-size: 16px;
            color: rgba(238, 153, 18, 0.5);
            text-transform: uppercase;
            font-family: "Iceland", sans-serif;
            place-self: end;
          }

          #menuButton {
            outline: none;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: grid;
            place-items: center;
            background-color: #212121;
            position: absolute;
            bottom: 24px;
            right: 24px;
            z-index: 2;
            cursor: pointer;
          }

          #menuButton svg {
            fill: rgba(238, 153, 18, 1);
          }

          #menuButton:hover {
            background-color: rgba(238, 153, 18, 1);
          }

          #menuButton:hover svg {
            fill: #212121;
          }

          #backdrop {
            position: fixed;
            top: 0;
            left: 0; width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9); /* Adjust opacity as needed */
            z-index: 1; /* Ensure it appears behind the popover */
            display: none; /* Hidden by default */
          }

          #backdrop.show {
            display: block; /* Show the backdrop when active */
          }

          input[type="checkbox"] {
            border: none;
            width: 20px;
            height: 20px;
            outline: none;
            place-self: end;
            accent-color: rgba(238, 153, 18, 1);
          }

          input[type="range"] {
            -webkit-appearance: none;
          }

          input[type="range"]:focus {
            outline: none;
          }

          input[type="range"]::-webkit-slider-runnable-track {
            background: #f5f5f5;
            height: 5px;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            background: rgba(238, 153, 18, 1);
            border-radius: 50%;
            height: 15px;
            width: 15px;
            margin-top: -5px;
          }

          .hidden {
            display: none;
          }
        </style>
        <div class="menu ${page !== "menu" ? "hidden" : ""}">
          <div class="menu-title">
            Space Defense Engineer
            <span class="menu-version">Version 0.0.1</span>
          </div>
          <button class="menu-option">Start Game</button>
          <button class="menu-option">Options</button>
          <button class="menu-option">Exit</button>
        </div>
        <div class="menu ${page !== "options" ? "hidden" : ""}">
          <div class="menu-title">Options</div>
          <span class="menu-version">Volume</span>
          <input oninput=${(event) => { this.setVolume(event.target.value) }} ref=${this.input} type="range" min="0" max="100" value="50" class="slider" />
          <span class="menu-version"> Enable Music/Sounds </span>
          <input oninput=${(event) => { this.setGameSound(event.target.checked) }} ref=${this.checkbox} type="checkbox" />
          <button class="menu-option">Back</button>
        </div>
      `;
    }
  }

  register(SDGameMenu);
})();
