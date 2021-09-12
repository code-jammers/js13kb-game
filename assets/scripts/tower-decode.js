function tower_decode(tower_char) {
  var tc = tower_char;
  var bit_str = tc.charCodeAt(0).toString(2).padStart(8, "0");
  return bit_str;
}
function removeOrphanBullets() {
  GAME_DATA.bullets.forEach((bullet, i) => {
    console.log(bullet);
    if (!bullet.tower.isConnected) {
      GAME_DATA.bullets.splice(i, 1);
      document.body.removeChild(bullet);
    }
  });
}

function create_bullet(tow, chg_x = 1, chg_y = 0) {
  var b = document.createElement("div");
  b.tower = tow;
  GAME_DATA.bullets.push(b);
  // bullet defaults
  b.idx = GAME_DATA.bullets.length - 1;
  b.style.position = "absolute";
  b.style.zIndex = "0";
  b.damage = 20;
  b.style.width = "10px";
  b.style.height = "20px";

  if (tow.getAttribute("quantum") !== null) {
    // higher damage for quantum towers
    // bullet rotation (ai aim assist)
    b.style.width = "6px";
    b.style.height = "3px";
    b.style.border = "1px solid rgb(248, 190, 28)";
    b.style.background = "rgba(248, 190, 28, .5)";
    b.damage = 10;
    b.setback = 12;
  }

  if (tow.getAttribute("phaser") !== null) {
    // laser beam straight line for phaser towers
    b.style.width = "30px";
    b.style.height = "5px";
    b.style.border = "1px solid rgb(132, 255, 255)";
    b.style.background = "rgba(132, 255, 255, .5)";
    b.style.borderRadius = "0px";
    b.style.filter = "blur(4px)";
    b.damage = 5;
    b.setback = 8; //todo:check if nothing uses then remove this
    b.slow = 0.00001; // percent pixel move per game loop iteration
  }

  if (tow.getAttribute("thermal") !== null) {
    // aoe attack but lower damage for thermal towers
    b.style.width = "50px";
    b.style.height = "50px";
    b.style.border = "1px solid rgb(255, 73, 49)";
    b.style.filter = "blur(2px)";
    b.style.background = "rgba(255, 73, 49, .2)";
    b.style.borderRadius = "50%";
    b.damage = 3;
    b.setback = 8;
  }

  if (tow.getAttribute("blaster") !== null) {
    b.style.width = "6px";
    b.style.height = "3px";
    b.style.border = "1px solid rgb(255, 255, 255)";
    b.style.background = "rgba(255, 255, 255, .3)";
    b.damage = 3;
    b.setback = 8;
  }

  var rect = tow.getBoundingClientRect();
  var x = rect.x + rect.width / 2.0;
  var y = rect.y + rect.height / 2.0;
  b.style.left = x + "px"; //tow.parentNode.offsetLeft + 28 + "px";
  b.style.top = y + "px"; //tow.parentNode.offsetTop + 36 + "px";
  b.ox = x;
  b.oy = y;
  b.x = x; //tow.parentNode.offsetLeft + 28;
  b.y = y;
  //console.log(tow.parentNode.parentNode.parentNode.parentNode.parentNode.tagName);
  var tag = tow.parentNode.parentNode.parentNode.parentNode.parentNode.tagName; //td //tr //tbody //table //l-g or r-g
  console.log(tag);
  b.lefttower = tag.toUpperCase() == "L-G";
  document.body.appendChild(b);
  var mid_x = document.body.getBoundingClientRect().width / 2.0;
  // if (b.x > mid_x)
  //   b.style.boxShadow = window.getComputedStyle(tow).color + "-2px -1px";
  // else b.style.boxShadow = window.getComputedStyle(tow).color + "2px 1px";
  b.style.zIndex = "100000";
  setInterval(() => {
    var reset = false;
    if (rect.y > b.y) {
      b.style.transform = b.lefttower ? "rotate(-45deg)" : "rotate(45deg)";
    } else if (rect.y < b.y - 50) {
      b.style.transform = b.lefttower ? "rotate(45deg)" : "rotate(-45deg)";
    }
    if (!b.lefttower && b.x < mid_x - 63) {
      b.x = b.ox;
      b.y = b.oy;
      reset = true;
    }
    if (!b.lefttower && b.x >= mid_x - 63) {
      b.x -= chg_x;
      b.y += chg_y;
    }
    if (b.lefttower && b.x > mid_x + 63) {
      b.x = b.ox;
      b.y = b.oy;
      reset = true;
    }
    if (b.lefttower && b.x <= mid_x + 63) {
      b.x += chg_x;
      b.y += chg_y;
    }
    if ((reset || b.reset) && window.enemy.recentHits.includes(b.idx)) {
      if (b.reset) console.log("b reset");
      b.reset = false;
      b.x = b.ox;
      b.y = b.oy;
      for (var i = 0; i < window.enemy.recentHits.length; i++) {
        if (window.enemy.recentHits[i] == b.idx) {
          window.enemy.recentHits[i] = -1;
        }
      }
    } //TODO:clear out recent hits array at end of wave
    /*if (b.x > mid_x - 60) {
          if (!b.lefttower && b.x < mid_x-3-60) {b.x=b.ox;b.y=b.oy}
          else {b.x -= chg_x;b.y += chg_y}
      }
      else
          if (b.x > mid_x-3) {b.x=b.ox;b.y=b.oy;}
	  else {b.x += chg_x;b.y += chg_y}*/
    b.style.left = b.x + "px";
    b.style.top = b.y + "px";
  }, 10);
}
function create_tower(attrs, tss /*tower set string*/) {
  var coords = [[], [0, 100], [0, 0], [100, 0], [100, 100]];
  var fs = 44; //font-size
  var tow = document.createElement("div");
  var span = document.createElement("span");
  span.style.borderRadius = "50%";
  tow.appendChild(span);
  //var li=tss.split(ascii_char).length - 1 - 1;//level index
  //if (li>2)li=2;
  span.setAttribute("one", ""); //levels[li],"");
  if (tss.length == 1) {
    span.style.width = "65px";
    span.style.height = "65px";
    span.style.backgroundImage = "url('assets/images/sat.png')";
    span.style.backgroundRepeat = "no-repeat";
    span.style.backgroundPosition = "14px 11px";
    tow.style.zIndex = "1";
  }
  tow.style.fontSize = fs + "px";
  tow.rot = 0;
  var typidx =
    parseInt(attrs[5] + "" + attrs[6] + "" + attrs[7], 2) %
    GAME_DATA.tower_types.length;
  tow.setAttribute(GAME_DATA.tower_types[typidx], "");
  /*var special_tower = attrs[7] == "1";
  if (special_tower) {
    var frost_tower = attrs[6] == "1" || attrs[5] == "1";
    if (frost_tower) {
      tow.style.color = "lightblue";
    } else {
      tow.style.color = "red";
      //fire tower
    }
  }*/
  //tow.frost = (attrs[7] == '1');
  //if (tow.frost) {
  //    type="frost-tower";
  //}
  //var tow_cont=document.createElement(type);
  //tow_cont.appendChild(tow);
  //container.appendChild(tow_cont);
  setTimeout(() => {
    //bullet
    create_bullet(tow);
  }, 900 /*10 rotateTowers interval * 90 degree turn*/);
  return tow;
}

/*document.addEventListener('DOMContentLoaded', function() {
    var towers=GAME_DATA.towers;
    for (var i=0;i<towers.length;i++) {
	var t = create_tower( towers[i], tower_decode(towers[i]) );
        t.id="tower"+i;
        createBullet(t);
    }
});*/

// _sid=0;//stack id
// function stack() {
//    if (_sid==6) document.getElementById("stack").style.visibility="hidden";
//    if (_sid==4) {_sid++;}
//     var i=_sid;
//     var deg=-45;
//     var rbr=document.getElementById("tower0").parentElement.getBoundingClientRect();//raw bounding rect
//     var br={left:rbr.left, top:rbr.top}
//    if (_sid>=5)br.left+=200;
//     var coords=[{x:11,y:-23},{x:29,y:-3},{x:12,y:-3},{x:29,y:13}];
//     if (br.left<400) {
//         br.left+=400;
//         br.top+=25;
//     }

//     var fs=35;//font-size
//     var opac=(i==0)?1:1.0/(i+1);

//    var limit=-1;
//    if (_sid>=4)limit=4;
//    var bt=(_sid>=4)?5:0;//base tower

//     while (i>limit) {
//         var t=document.getElementById("tower"+i);
//         t.parentElement.style.left=br.left + "px";
//         t.parentElement.style.top=br.top + "px";
//         t.parentElement.style.position="absolute";
//         //t.style.transform="rotate("+deg+"deg)";
//         t.style.fontSize="35pt";//(opac*fs)+"pt";
//         t.style.opacity=opac;
//         if (i!=bt) {
//             t.innerHTML = t.innerHTML.replace("{","").replace("}","");
//             t.parentElement.style.left = br.left+"px";//br.left+(fs*_sid)+"px";
//             t.style.fontSize="15pt";
//             var coord = coords[i%4];

//             t.style.left = coord.x+"px";
//             t.style.top = coord.y + "px";
//             //t.parentElement.style.marginLeft = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
//             //t.parentElement.style.marginTop = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";

//         }
//         i--;
//         deg-=45;
//         //fs += 25;
//         opac += 1.0/_sid;
//     }
//     var t=document.getElementById("tower"+(_sid+1));
//     //t.parentElement.style.marginLeft = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
//     //t.parentElement.style.marginTop = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
//     t.parentElement.style.position="absolute";
//     t.parentElement.style.left=br.left +"px";
//     t.parentElement.style.top=br.top +"px";

//     //t.style.transform="rotate("+deg+"deg)";
//     t.style.fontSize="15pt";
//     t.innerHTML = t.innerHTML.replace("{","").replace("}","");
//     t.style.opacity=0.5;

//     var coord = coords[(_sid+1)%4];
//     t.style.left = coord.x+"px";
//     t.style.top = coord.y + "px";

//     _sid += 1;
//     //var t=document.getElementById("tower"+_sid);
//     //t.style.transform="rotate(-45deg)";
//     //t.style.transform="rotate(-45deg)";
// }
