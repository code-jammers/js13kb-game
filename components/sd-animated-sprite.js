(() => {
  const html = htm.bind(preact.h);
  const { Component } = preact;
  const register = preactCustomElement;

  class SDAnimatedSprite extends Component {
    static tagName = "sd-animated-sprite";
    static observedAttributes = [
      "name",
      "index",
      "show" /* "shiprectstr", "bulletrectstr"*/,
    ];

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

    center(elRect) {
      return {
        x: (elRect.left * 1.0 + elRect.width * 1.0) / 2.0,
        y: (elRect.top * 1.0 + elRect.height * 1.0) / 2.0,
      };
    }

    render({ src, show, w, h, index, count, shiprectstr, bulletrectstr }) {
      //this.props.frames;
      var frame = { src: src, width: w, height: w };
      let imgPath = frame.src;
      let width = frame.width;
      let height = frame.height;
      //console.log(index*count*width);
      // console.log(bulletRectStr, shipRectStr);
      var sVals = shiprectstr.split(",");
      var bVals = bulletrectstr.split(",");
      var shipRect = {
        left: parseInt(sVals[0]),
        top: parseInt(sVals[1]),
        width: parseInt(sVals[2]),
        height: parseInt(sVals[3]),
      };
      var bulletRect = {
        left: parseInt(bVals[0]),
        top: parseInt(bVals[1]),
        width: parseInt(bVals[2]),
        height: parseInt(bVals[3]),
      };
      var halfWidth = parseInt(w / 2.0);
      var halfHeight = parseInt(h / 2.0);
      var convertedPt = {
        x:
          /*this.center(bulletRect).x*/ bulletRect.left -
          shipRect.left -
          halfWidth,
        y:
          /*this.center(bulletRect).y*/ bulletRect.top -
          shipRect.top -
          halfHeight,
      };

      return html`
        <style>
          .sd-animated-sprite[show] {
            opacity: 1;
          }
          .sd-animated-sprite {
            left: ${convertedPt.x}px;
            top: ${convertedPt.y}px;
            position: absolute;
          }
          .sd-animated-sprite div[yes] {
            height: ${height}px;
            width: ${width}px;
            background-image: url("${imgPath}");
            background-size: ${width * count}px ${height}px;
            background-position: top 0px left ${index * width}px;
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
