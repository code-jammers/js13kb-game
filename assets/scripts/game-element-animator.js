window.GameElementAnimator = class {
  constructor(screenRect) {
    this.screenX1 = screenRect.left;
    this.screenY1 = screenRect.top;
    this.screenX2 = screenRect.left + screenRect.width;
    this.screenY2 = screenRect.top + screenRect.height;
  }

  buildShipBurn(x, y, shipEl, id, src) {
      let animatedBurnSprite = document.createElement("sd-animated-sprite");
      animatedBurnSprite.setAttribute("id", id);
      animatedBurnSprite.id = id;
      animatedBurnSprite.setAttribute("show", "false");
      animatedBurnSprite.setAttribute("w", 64);
      animatedBurnSprite.setAttribute("h", 64);
      animatedBurnSprite.setAttribute("count", 8);
      var shipRect = shipEl.getBoundingClientRect();

      animatedBurnSprite.setAttribute(
        "shiprectstr",
        `${shipRect.left},${shipRect.top},${shipRect.width},${shipRect.height}`,
      ); // can't pass rect obj through

      animatedBurnSprite.setAttribute(
        "bulletrectstr",
        `${shipRect.left+x},${shipRect.top+y},40,40`,
      );
      //animatedBurnSprite.setAttribute("shiprectstr","0,0,0,0");
      //animatedBurnSprite.setAttribute("bulletrectstr","0,0,0,0");
      animatedBurnSprite.setAttribute("index", 0);
      animatedBurnSprite.setAttribute("src", src);
      shipEl.appendChild(animatedBurnSprite);
  }

  animateDeadShip(dom, shipEl, deathTicks, maxDeathTicks) {

    if (deathTicks < 1) return;

    let imgDir = "./assets/images/space-rage/Explosions/";

    //let x_positions = [14, 34, 54, 74];
    //let y_positions = [74, 14, 34, 14];

    let x_positions = [50]; // [0, 64, 36, 36];
    let y_positions = [50]; // [0, 0, 36, 64];

    for (var i=0; i<x_positions.length; i++) {
        if (deathTicks >= maxDeathTicks-2) {
            let animatedBurnSprite = dom(`#shipburn${i}`);
            animatedBurnSprite?.remove();
            continue;
        }
        if (deathTicks == 1) {
            this.buildShipBurn(x_positions[i], y_positions[i], shipEl, "shipburn"+i, `${imgDir}/Smoke_Spritesheet.png`);
            continue;
        }

        if (deathTicks >= (i+1)*10) {
            let animatedBurnSprite = dom(`#shipburn${i}`);
            if (parseInt(animatedBurnSprite.getAttribute("index")) == 7) {
              animatedBurnSprite?.setAttribute("index", 7);
              animatedBurnSprite?.setAttribute("show", "true");
            } else {
              let adjDeathTicks = deathTicks;// + i*10; // different index timings
              let index = ((adjDeathTicks + "")[0]-1) % 8;
              animatedBurnSprite?.setAttribute("index", index);
              animatedBurnSprite?.setAttribute("show", "true");
            }
        }
    }

//     /* FIRST SHIP BURN */
//     if (deathTicks == 1) {
//       this.buildShipBurn(64, 0, shipEl, "shipburn", `${imgDir}/Smoke_Spritesheet.png`);
//       return;
//     }
//     
//     if(deathTicks == 20) {
//       let animatedBurnSprite = dom(`#shipburn`);
//       animatedBurnSprite.setAttribute("show", "true");
// 
//       // animatedBurnSprite.setAttribute("index", 0);
// 
//       // removed
//     }
//     if (deathTicks > 20) {
//       let animatedBurnSprite = dom(`#shipburn`);
//       let index = deathTicks > 9 ? (deathTicks + "")[0] % 8 : 0
//       animatedBurnSprite?.setAttribute(
//         "index",
//         index,
//       );
//       
//     }
// 
//     /* SECOND SHIP BURN */
//     if (deathTicks == 21) {
//       // this.buildShipBurn(0, 64, shipEl, "shipburn2", `${imgDir}/ExplosionRed_Spritesheet.png`);
//       this.buildShipBurn(0, 64, shipEl, "shipburn2", `${imgDir}/Smoke_Spritesheet.png`);
//     }
//     if (deathTicks == 31) {
//       let animatedBurnSprite = dom(`#shipburn2`);
// 
//       animatedBurnSprite.setAttribute("show", "true");
// 
//       // animatedBurnSprite.setAttribute("index", 0);
//     }
//     if (deathTicks > 31) {
//       let animatedBurnSprite = dom(`#shipburn2`);
//       let index = deathTicks > 9 ? (deathTicks + "")[0] % 8 : 0
//       animatedBurnSprite?.setAttribute(
//         "index",
//         index,
//       );
//         
//     }
// 
//     /* THIRD SHIP BURN */
//     if (deathTicks == 11) {
//       this.buildShipBurn(64, 64, shipEl, "shipburn3", `${imgDir}/Smoke_Spritesheet.png`);
//     }
//     if (deathTicks >= 31) {
//       let animatedBurnSprite = dom(`#shipburn3`);
//       animatedBurnSprite.setAttribute("show", "true");
//       let index = deathTicks > 9 ? (deathTicks + "")[0] % 8 : 0
//       animatedBurnSprite?.setAttribute(
//         "index",
//         index,
//       );
//     }
    

    //if (deathTicks == 488)
    //  console.log(dom(`#shipburn`));

  }

  animateBulletBoom(collisionEl) {
    collisionEl.style.transform = `scale(2)`;
  }

  animateBulletHit(collision, bEl, sEl) {
    const animatedCollisionSprite =
      document.createElement("sd-animated-sprite");
    animatedCollisionSprite.setAttribute("show", "true");
    //animatedCollisionSprite.setAttribute("frame", {index: 0, src: './assets/images/space-rage/Explosions/ExplosionLarge_Spritesheet.png', width: 12, height: 12});
    animatedCollisionSprite.setAttribute("index", 0);
    animatedCollisionSprite.setAttribute(
      "src",
      "assets/images/space-rage/Explosions/ExplosionLarge_Spritesheet.png",
    );
    animatedCollisionSprite.setAttribute("w", 64);
    animatedCollisionSprite.setAttribute("h", 64);
    animatedCollisionSprite.setAttribute("count", 13);
    animatedCollisionSprite.setAttribute("id", collision.id);
    //animatedCollisionSprite.id = collision.id;
    var shipRect = sEl.getBoundingClientRect();
    var bulletRect = bEl.getBoundingClientRect();

    animatedCollisionSprite.setAttribute(
      "shiprectstr",
      `${shipRect.left},${shipRect.top},${shipRect.width},${shipRect.height}`,
    ); // can't pass rect obj through

    animatedCollisionSprite.setAttribute(
      "bulletrectstr",
      `${bulletRect.left},${bulletRect.top},${bulletRect.width},${bulletRect.height}`,
    );

    sEl.appendChild(animatedCollisionSprite); // append collision animation to the ship element
  }

  animateCollisionTick(animatedCollisionSprite, ticks) {
    animatedCollisionSprite?.setAttribute(
      "index",
      ticks > 9 ? (ticks + "")[0] % 13 : 0,
    );
    /*if (animatedCollisionSprite != null)
      animatedCollisionSprite?.update128X128(0, './assets/images/space-rage/Explosions/ExplosionLarge_Spritesheet.png');*/
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
