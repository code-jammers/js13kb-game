window.inside_rect = function (ir /*inside rect*/, or /*outside rect*/) {
  function inside(x, y) {
    return (
      x > or.left &&
      x < or.left + or.width &&
      y > or.top &&
      y < or.top + or.height
    );
  }
  var _in =
    inside(/*A: x,y*/ ir.left, ir.top) ||
    inside(/*B: x,y*/ ir.left + ir.width, ir.top) ||
    inside(/*C: x,y*/ ir.left, ir.top + ir.height) ||
    inside(/*D: x,y*/ ir.left + ir.width, ir.top + ir.height);
  var x_within = ir.left > or.left && ir.left + ir.width < or.left + or.width;
  var y_within = ir.top > or.top && ir.top + ir.height < or.top + or.height;
  var y_surrounds =
    (ir.top < or.top && ir.top + ir.height > or.top) ||
    (ir.top < or.top + or.height && ir.top + ir.height > or.top + or.height);
  var x_surrounds =
    (ir.left < or.left && ir.left + ir.width > or.left) ||
    (ir.left < or.left + or.width && ir.left + ir.width > or.left + or.width);
  return _in || (x_within && y_surrounds) || (y_within && x_surrounds);
};
window.rects_collide = function (r1, r2) {
  return window.inside_rect(r1, r2) || window.inside_rect(r2, r1);
};
