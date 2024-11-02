(() => {
  const html = htm.bind(preact.h);
  const { Component } = preact;
  const register = preactCustomElement;

  class SDAnimatedSprite extends Component {
    static tagName = "sd-animated-sprite";
    static observedAttributes = ["name", "index"];

    /*constructor() {
      super();
      this.update128X128 = this.update128X128.bind(this);
      this.state = { frame: { index: null, src: null, width: null, height: null  } };
    }*/

    /*
    update128X128(index, src) {
      this.setState({ frame: { index: index, src: src, width: 128, height: 128 } });
    }
    */

// before: getSnapshotBeforeUpdate
// after: componentDidUpdate(prevProps, prevState, snapshot)

    render({ src, show, w, h, index, count }) {
      //this.props.frames;
      var frame = { src: src, width: w, height: w };
      let imgPath = frame.src;
      let width = frame.width;
      let height = frame.height;
      console.log(index*count*width);
      return html`
        <style>
          .sd-animated-sprite[show] {
            opacity: 1;
          }
          .sd-animated-sprite div[yes] {
            height: ${height}px;
            width: ${width}px;
            background-image: url("${imgPath}");
            background-size: ${width*count}px ${height}px;
            background-position: top 0px left ${index*(width)}px;
            z-index: 1000000;
          }
        </style>
        <div class="sd-animated-sprite" show=${show}>
          <div yes></div>
        </div>
      `;
    }
  }

  register(SDAnimatedSprite);
  //const proto = customElements.get(SDAnimatedSprite.tagName).prototype;
  //proto.update128X128 = SDAnimatedSprite.prototype.update128X128;
})();
