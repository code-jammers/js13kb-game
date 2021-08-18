setInterval(function() {
    function cleanup() {
        var b1=document.getElementById("bullet1");
        var b2=document.getElementById("bullet2");
        if (b1!=null)b1.remove();
        if (b2!=null)b2.remove();
    }    cleanup();
    var bullet=document.createElement("div");
    bullet.innerHTML="*";
    bullet.style.position="absolute";
    bullet.id="bullet1";
    bullet.style.color="#df5151";

    var bullet2=document.createElement("div");
    bullet2.innerHTML="*";
    bullet2.style.position="absolute";
    bullet2.id="bullet2";
    bullet2.style.color="#8fc2f0";

    var t1=document.getElementById("tower1");
    var t2=document.getElementById("tower2");

    if (t1 == null)return; if (t2==null)return;
    bullet.left=t1.getBoundingClientRect().left + (t1.getBoundingClientRect().width)/2;
    bullet.style.left=bullet.left  + "px";
    bullet.top=t1.getBoundingClientRect().top
    bullet.style.top=bullet.top + "px";

    bullet2.left=t2.getBoundingClientRect().left + (t2.getBoundingClientRect().width)/2;
    bullet2.style.left=bullet2.left  + "px";
    bullet2.top=t2.getBoundingClientRect().top+10;
    bullet2.style.top=bullet2.top + "px";

    document.body.appendChild(bullet);
    document.body.appendChild(bullet2);

}, 3500);

setInterval(function() {
    var b1=document.getElementById("bullet1");
    var b2=document.getElementById("bullet2");
    if (b1==null)return;
    if (b2==null)return;
    b1.left=b1.left+10;
    b1.style.left=(b1.left)+"px";
    b1.top=b1.top-10;
    b1.style.top=(b1.top)+"px";

    b2.left=b2.left+10;
    b2.style.left=(b2.left)+"px";
    b2.top=b2.top-10;
    b2.style.top=(b2.top)+"px";
}, 500);