// Returns a random integer between min and max
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Creates a repeating canvas pattern scaled to the given size
function scaledPattern(img, size) {
  var canvas = document.getElementById('cnv');
  var tempCanvas = document.createElement('canvas');
  var tCtx = tempCanvas.getContext('2d');

  tempCanvas.width = size;
  tempCanvas.height = size;
  tCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);

  var ctx = canvas.getContext('2d');
  return ctx.createPattern(tempCanvas, 'repeat');
}


/* VECTOR */

function Vector (x, y) {
  this.x = x; this.y = y;
}

Vector.mult = function (vec, scl) {
  return new Vector(vec.x * scl, vec.y * scl);
}

Vector.dist = function (v1, v2) {
  var dx = v2.x - v1.x;
  var dy = v2.y - v1.y;
  return Math.sqrt(dx*dx + dy*dy);
}
