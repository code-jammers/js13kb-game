(() => {
  const html = htm.bind(preact.h);
  const { Component } = preact;
  const register = preactCustomElement;

  class SDGameMenu extends Component {
    static tagName = "sd-game-menu";
    static observedAttributes = ["open"];

    componentDidMount() {
      console.log("Component mounted");
    }

    componentDidUpdate() {
      console.log(this.props.open);
    }

    render({ open }) {
      return html`
        <style>
          .menu {
            border: 1px solid #333;
            padding: 20px;
            width: 200px;
            background-color: #f0f0f0;
            display: ${open ? "flex" : "none"};
            flex-direction: column;
            gap: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .menu button {
            padding: 10px;
            cursor: pointer;
            border: none;
            background-color: #333;
            color: #fff;
            border-radius: 4px;
            transition: background-color 0.2s;
          }

          .menu button:hover {
            background-color: #555;
          }

          #backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
            z-index: 1; /* Ensure it appears behind the popover */
            display: none; /* Hidden by default */
          }

          #backdrop.show {
            display: block; /* Show the backdrop when active */
          }
        </style>
        <div class="menu">
          <button class="menu-option">Start Game</button>
          <button class="menu-option">Options</button>
          <button class="menu-option">Exit</button>
        </div>
      `;
    }
  }

  register(SDGameMenu);
})();
