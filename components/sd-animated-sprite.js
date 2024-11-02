(() => {
  const html = htm.bind(preact.h);
  const { Component } = preact;
  const register = preactCustomElement;

  class SDAnimatedSprite extends Component {
    static tagName = "sd-animated-sprite";
    static observedAttributes = ["name"];

    constructor() {
      super();
      this.state = { frame: { index: null, src: null, width: null, height: null  } };
    }

    update128X128(index, src) {
      this.setState({ frame: { index: index, src: src, width: 128, height: 128 } });
    }

// before: getSnapshotBeforeUpdate
// after: componentDidUpdate(prevProps, prevState, snapshot)

    render({ show }) {
      //this.props.frames;
      let imgPath = this.state.frame.src;
      let width = this.state.frame.width;
      let height = this.state.frame.height;
      return html`
        <style>
          .sd-animated-sprite[show] {
            opacity: 1;
          }
          .sd-animated-sprite img {
            height: ${height};
            width: ${width};
          }
        </style>
        <div class="sd-animated-sprite" show=${show} height=${height} width=${width}>
          <img src="${imgPath}">
        </div>
      `;
    }
  }

  register(SDAnimatedSprite);
})();
