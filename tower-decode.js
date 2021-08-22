function tower_decode(tower_char) {
    var tc=tower_char;
    var bit_str=tc.charCodeAt(0).toString(2).padStart(8,'0');
    return bit_str;
}

function create_tower(ascii_char, attrs) {
    var container=document.getElementById("container");
    var type="fire-tower";
    var tow=document.createElement("div");
    tow.innerHTML = "{"+ascii_char+"}";
    tow.frost = (attrs[7] == '1');
    if (tow.frost) {
        type="frost-tower";
    }
    var tow_cont=document.createElement(type);
    tow_cont.appendChild(tow);
    container.appendChild(tow_cont);
    return tow;
}

document.addEventListener('DOMContentLoaded', function() {
    var towers=GAME_DATA.towers;
    for (var i=0;i<towers.length;i++) {
	var t = create_tower( towers[i], tower_decode(towers[i]) );
        t.id="tower"+i;
        createBullet(t);
    }
});

_sid=0;//stack id
function stack() {
   if (_sid==6) document.getElementById("stack").style.visibility="hidden";
   if (_sid==4) {_sid++;}
    var i=_sid;
    var deg=-45;
    var rbr=document.getElementById("tower0").parentElement.getBoundingClientRect();//raw bounding rect
    var br={left:rbr.left, top:rbr.top}
   if (_sid>=5)br.left+=200;
    var coords=[{x:11,y:-23},{x:29,y:-3},{x:12,y:-3},{x:29,y:13}];
    if (br.left<400) {
        br.left+=400;
        br.top+=25;
    }

    var fs=35;//font-size
    var opac=(i==0)?1:1.0/(i+1);

   var limit=-1;
   if (_sid>=4)limit=4;
   var bt=(_sid>=4)?5:0;//base tower

    while (i>limit) {
        var t=document.getElementById("tower"+i);
        t.parentElement.style.left=br.left + "px";
        t.parentElement.style.top=br.top + "px";
        t.parentElement.style.position="absolute";
        //t.style.transform="rotate("+deg+"deg)";
        t.style.fontSize="35pt";//(opac*fs)+"pt";
        t.style.opacity=opac;
        if (i!=bt) {
            t.innerHTML = t.innerHTML.replace("{","").replace("}","");
            t.parentElement.style.left = br.left+"px";//br.left+(fs*_sid)+"px";
            t.style.fontSize="15pt";
            var coord = coords[i%4];

            t.style.left = coord.x+"px";
            t.style.top = coord.y + "px";
            //t.parentElement.style.marginLeft = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
            //t.parentElement.style.marginTop = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";

        }
        i--;
        deg-=45;
        //fs += 25;
        opac += 1.0/_sid;
    }
    var t=document.getElementById("tower"+(_sid+1));
    //t.parentElement.style.marginLeft = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
    //t.parentElement.style.marginTop = _sid+"px";//br.left+"px";//+(fs*(_sid+1)/3)+"px";
    t.parentElement.style.position="absolute";
    t.parentElement.style.left=br.left +"px";
    t.parentElement.style.top=br.top +"px";

    //t.style.transform="rotate("+deg+"deg)";
    t.style.fontSize="15pt";
    t.innerHTML = t.innerHTML.replace("{","").replace("}","");
    t.style.opacity=0.5;

    var coord = coords[(_sid+1)%4];
    t.style.left = coord.x+"px";
    t.style.top = coord.y + "px";


    _sid += 1;
    //var t=document.getElementById("tower"+_sid);
    //t.style.transform="rotate(-45deg)";
    //t.style.transform="rotate(-45deg)";
}