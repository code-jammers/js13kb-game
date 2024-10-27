window.GameElementAnimator = class {
  constructor(screenRect) {
    this.screenX1 = screenRect.left;
    this.screenY1 = screenRect.top;
    this.screenX2 = screenRect.left + screenRect.width;
    this.screenY2 = screenRect.top + screenRect.height;
  }

  animateBulletBoom(collisionEl) {
    collisionEl.style.transform = `scale(2)`;
  }

  animateBulletHit(collision, bEl, sEl) {
    var factor = 0.2;

    var svgContainer = document.createElement("div");
    svgContainer.style.position = "absolute";
    svgContainer.style.width = "100px";
    svgContainer.style.height = "100px";
    svgContainer.style.left = "0px";
    svgContainer.style.top = "0px";
    svgContainer.id = collision.id;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns:svg", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", 100);
    svg.setAttribute("height", 100);
    var bulletType = bEl.className.replace("bullet-", "");
    var color = "#ffffff";
    var strokeColor = "#000000";
    if (bulletType == "phaser") {
      color = "rgb(132, 255, 179)";
      strokeColor = "#ff0000";
    } else if (bulletType == "blaster") {
      color = "rgb(20,20,20)";
      strokeColor = "#ffff00";
    } else if (bulletType == "thermal") {
      color = "#dd0000";
      strokeColor = "#ffff00";
    } else if (bulletType == "quantum") {
      color = "#ffff00";
      strokeColor = "#000000";
    }
    //svg.style.position = 'absolute';
    // svg.style.transform = `scale(${factor})`;

    svg.style.zIndex = 1000009;

    let center = (el) => {
      var elRect = el.getBoundingClientRect();
      return {
        x: (elRect.left * 1.0 + elRect.width * 1.0) / 2.0,
        y: (elRect.top * 1.0 + elRect.height * 1.0) / 2.0,
      };
    };

    var convertedPt = {
      x: center(bEl).x - center(sEl).x,
      y: center(bEl).y - center(sEl).y,
    };

    //svg.style.backgroundColor = "green";
    svg.style.transform = `scale(${factor})`;
    //svg.setAttribute('x', convertedPt.x);
    //svg.setAttribute('y', convertedPt.y);
    svg.innerHTML = `<path d="m0,38l37,0l11,-38l11,38l37,0l-30,23l11,38l-30,-23l-30,23l11,-38l-30,-23l0,0z" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="3" fill="${color}" stroke="${strokeColor}" />`;

    svgContainer.style.left = convertedPt.x + "px";
    svgContainer.style.top = convertedPt.y + "px";

    console.log(convertedPt);
    svgContainer.appendChild(svg);
    sEl.appendChild(svgContainer);
  }

  animateBulletTick(bulletDataObject, bulletEl, towerEl) {
    let chg_x = bulletDataObject.chgX;
    let chg_y = bulletDataObject.chgY;
    let bullet = bulletEl;
    let tower = towerEl;

    var rect = tower.getBoundingClientRect();
    var mid_x = this.screenX2 / 2.0;

    let lhs = bulletDataObject.gridSide == "lhs";

    var reset = false; // todo: remove flag
    if (rect.y > bullet.y) {
      bullet.style.transform = lhs ? "rotate(-45deg)" : "rotate(45deg)";
    } else if (rect.y < bullet.y - 50) {
      bullet.style.transform = lhs ? "rotate(45deg)" : "rotate(-45deg)";
    }
    if (!lhs && bullet.x < mid_x - 63) {
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      reset = true;
    }
    if (!lhs && bullet.x >= mid_x - 63) {
      bullet.x -= chg_x;
      bullet.y += chg_y;
    }
    if (lhs && bullet.x > mid_x + 63) {
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      reset = true;
    }
    if (lhs && bullet.x <= mid_x + 63) {
      bullet.x += chg_x;
      bullet.y += chg_y;
    }
    if (bullet.reset) {
      bullet.reset = false;
      bullet.x = bullet.ox;
      bullet.y = bullet.oy;
      bullet.style.left = bullet.x + "px";
      bullet.style.top = bullet.y + "px";
    }

    bullet.style.left = bullet.x + "px";
    bullet.style.top = bullet.y + "px";
  }
};
