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

    const animatedCollisionSprite = document.createElement("sd-animated-sprite");
    animatedCollisionSprite.setAttribute("show", "true");
    animatedCollisionSprite.id = collision.id;
    
    animatedCollisionSprite.update128X128(0, './assets/images/space-rage/Explosions/ExplosionLarge_Spritesheet.png');

    sEl.appendChild(animatedCollisionSprite); // append collision animation to the ship element
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
