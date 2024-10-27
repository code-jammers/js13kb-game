window.GameReferee = class {
  constructor(screenRect) {
    this.screenX1 = screenRect.left;
    this.screenY1 = screenRect.top;
    this.screenX2 = screenRect.left + screenRect.width;
    this.screenY2 = screenRect.top + screenRect.height;
  }

  midpointMiss(b) {
    var bullet = b;
    let lhs = b.gridSide == "lhs";
    var mid_x = this.screenX2 / 2.0;
    if (!lhs && bullet.left < mid_x - 63) {
      return true;
    }
    if (lhs && bullet.left > mid_x + 63) {
      return true;
    }
    return false;
  }

  endOfLifeBulletType(b, bulletRect, enemyRect, rectsCollideFn) {
    if (rectsCollideFn(bulletRect, enemyRect)) {
      return "hit";
    } else if (
      rectsCollideFn(bulletRect, {
        left: -1000,
        top: -1000,
        width: 1000 + this.screenX1,
        height: 1000 + this.screenY1,
      }) ||
      rectsCollideFn(bulletRect, {
        left: this.screenX2,
        top: this.screenY2,
        width: 1000,
        height: 1000,
      }) ||
      this.midpointMiss(b)
    ) {
      return "miss";
    } else {
      return null; // still active
    }
  }

  adjustShipFromHit(
    ship,
    bullet,
    wave,
    bulletType,
    slowDamagePercent,
    previouslyHitInFrame,
  ) {
    if (bulletType === "phaser" && !previouslyHitInFrame) {
      console.log("slow damage issued (1x max per frame)");
      ship.y -= 5; //-= 8;
    }
    var levelModifier = wave * 0.2 + 1;
    ship.health -= bullet.damage - levelModifier;
    if (slowDamagePercent != null) {
      ship.velocityTrack = slowDamagePercent;
    }
    if (ship.health <= 0) ship.health = 0;
  }
};
