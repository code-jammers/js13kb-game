window.GameReferee = class {
    constructor(screenRect) {
        this.screenX1 = screenRect.left;
        this.screenY1 = screenRect.top;
        this.screenX2 = screenRect.left+screenRect.width;
        this.screenY2 = screenRect.top+screenRect.height;
    }
 
    endOfLifeBulletType(bulletRect, enemyRect, rectsCollideFn) {
        if (rectsCollideFn(bulletRect, enemyRect)) {
            return 'hit';
        } else if (rectsCollideFn(bulletRect, { left: -1000, top: -1000, width: 1000+this.screenX1, height: 1000+this.screenY1 }) ||
            rectsCollideFn(bulletRect, { left: this.screenX2, top: this.screenY2, width: 1000, height: 1000 })
        ) {
            return 'miss';
        } else {
            return null; // still active
        }
    }
};
