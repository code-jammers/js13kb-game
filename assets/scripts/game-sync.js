window.removeArrayIndices = function (array, indices, cb) {
  indices.sort((a, b) => b - a); // desc order
  for (let i of indices) {
    cb(i); // callback must happen before the splice, so caller
    array.splice(i, 1); // can use the array data before it is removed
  }
  while (indices.length > 0) {
    indices.splice(0, 1);
  }
};

/*
 * Game Sync
 *     Keeps GAME_DATA objects and dom elements in sync.
 *         Call it in a game loop iteration
 *         Test it from the node command line with a custom dom callback
 */
window.gameSync = function (dom, data) {
  var bodyRect = dom("body").getBoundingClientRect();
  var gameReferee = new window.GameReferee(bodyRect);
  var gameElementAnimator = new window.GameElementAnimator(bodyRect);
  var rmIdx = [];
  var hitIssued = false;
  var ene = dom("#ene");
  for (var i = 0; i < data.bullets.length; i++) {
    var currentBullet = data.bullets[i];
    var bulletEl = dom("#" + currentBullet.id);
    if (bulletEl == null) continue;
    var bulletBoundingRect = bulletEl.getBoundingClientRect(); //bullet rect
    var enemyBoundingRect = ene.getBoundingClientRect(); //ship rect
    var bulletEOL = gameReferee.endOfLifeBulletType(
      bulletBoundingRect,
      enemyBoundingRect,
      window.rects_collide,
    );
    switch (bulletEOL) {
      case "hit":
        var collision = { id: crypto.randomUUID(), ticks: 1 };
        data.bulletCollisions.push(collision);
        gameElementAnimator.animateBulletHit(collision, bulletEl, ene);
        var bulletType = bulletEl.className.replace("bullet-", "");
        gameReferee.adjustShipFromHit(
          ene,
          currentBullet,
          data.wave,
          bulletType,
          bulletEl.slow,
          hitIssued,
        );
        hitIssued ||= true;
      // fall through
      case "miss":
        rmIdx.push(i);
        break;
      default:
        break;
    }
    gameElementAnimator.animateBulletTick(
      currentBullet,
      bulletEl,
      bulletEl.tower,
    );
  }
  window.removeArrayIndices(data.bullets, rmIdx, (i) => {
    var b = data.bullets[i];
    var bId = b.id;
    var tId = b.towerId;
    var bulletEl = dom("#" + bId);
    var towerEl = bulletEl.tower;
    createBullet(towerEl, b.chgX, b.chgY);
    console.log("restarting bullet", bulletEl);
    bulletEl.remove();
  });

  for (var i = 0; i < data.bulletCollisions.length; i++) {
    var collision = data.bulletCollisions[i];
    collision.ticks += 1;
    if (collision.ticks >= 80) rmIdx.push(collision);
    if (collision.ticks >= 75) {
      var collisionElement = dom(`#${collision.id}`);
      if (!!collisionElement) {
        gameElementAnimator.animateBulletBoom(collisionElement);
      }
    }
  }
  window.removeArrayIndices(data.bulletCollisions, rmIdx, (i) => {
    var collision = data.bulletCollisions[i];
    dom(`#${collision.id}`)?.remove();
  });
};
