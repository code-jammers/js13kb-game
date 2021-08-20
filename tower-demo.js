function createBullet(tower) {
    var bullet=document.createElement("div");
    bullet.towerId=tower.id;
    bullet.innerHTML="*";
    bullet.style.position="absolute";
    bullet.classList.add("bullet");
    if (tower.frost) {
        bullet.style.color="#8fc2f0";
    } else {
        bullet.style.color="#df5151";
    }
    bullet.left=tower.getBoundingClientRect().left + (tower.getBoundingClientRect().width)/2;
    bullet.style.left=bullet.left  + "px";
    bullet.top=tower.getBoundingClientRect().top
    bullet.style.top=bullet.top + "px";
    bullet.style.zIndex=100000;
    document.body.appendChild(bullet);
    return bullet;
}
function positionBullet(bullet) {
    var roadTop=document.getElementById("road").getBoundingClientRect().top;
    var roadCenter=roadTop + ((document.getElementById("road").getBoundingClientRect().height)/2);

    if (bullet.top<roadCenter) {
        var tower=document.getElementById(bullet.towerId);
        bullet.left=tower.getBoundingClientRect().left + (tower.getBoundingClientRect().width)/2;
        bullet.style.left=bullet.left  + "px";
        bullet.top=tower.getBoundingClientRect().top
        bullet.style.top=bullet.top + "px";
        return;
    }
    bullet.left=bullet.left+10;
    bullet.style.left=(bullet.left)+"px";
    bullet.top=bullet.top-10;
    bullet.style.top=(bullet.top)+"px";
}

setInterval(function() {
    var bullets = document.getElementsByClassName("bullet");
    for (var i=0; i<bullets.length; i++) {
        positionBullet(bullets[i]);
    }
}, 300);
