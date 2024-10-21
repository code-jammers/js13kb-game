(() => {
  const html = htm.bind(preact.h);
  const { Component } = preact;
  const register = preactCustomElement;

  class SDNotification extends Component {
    static tagName = "sd-notification";
    static observedAttributes = ["name"];

    render({ header, text, show, color }) {
      return html`
        <style>
          .sd-notification {
            position: absolute;
            right: 16px;
            top: 102px;
            border-radius: 12px;
            padding: 12px;
            z-index: 2;
            background: #000;
            transform: opacity 1s;
            pointer-events: none;
            font-family: system-ui;
            text-align: center;
            box-shadow: 0 1px 2px 2px rgba(255, 255, 255, 0.2);
          }

          .sd-notification h1 {
            padding: 0;
            margin: 0;
            color: ${color};
            font-size: 22px;
          }

          .sd-notification p {
            padding: 0;
            font-family: monospace;
            font-size: 13px;
            color: #f5f5f5;
            max-width: 250px;
            margin: 6px auto 0 auto;
            text-align: center;
          }

          .sd-notification[show] {
            opacity: 1;
          }
        </style>
        <div class="sd-notification" show=${show}>
          <h1>${header}</h1>
          <p>${text}</p>
        </div>
      `;
    }
  }

  register(SDNotification);
})();
