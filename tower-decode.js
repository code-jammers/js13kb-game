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
