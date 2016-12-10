function Edge (r1, r2, gridSize) {
  this.r1 = r1; this.r2 = r2; this.gridSize = gridSize;
  this.p1 = r1.center;
  this.p2 = r2.center;
  this.length = Vector.dist(this.p1, this.p2);
  this.horizontal = Math.random() >= 0.5; // Random boolean

  this.start = r1.randomPoint();
  this.end = r2.randomPoint();
}

Edge.prototype.equals = function (e2) {
  return (this.r1 === e2.r1 && this.r2 === e2.r2)
      || (this.r1 === e2.r2 && this.r2 === e2.r1);
}

Edge.prototype.otherRoom = function (r) {
  if (r === this.r1) return this.r2;
  if (r === this.r2) return this.r1;
  return;
}

Edge.prototype.render = function (ctx) {
  var start = Vector.mult(this.start, this.gridSize);
  var end = Vector.mult(this.end, this.gridSize);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
}

Edge.prototype.renderCorridor = function (ctx) {
  var start = Vector.mult(this.start, this.gridSize);
  var end = Vector.mult(this.end, this.gridSize);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(start.x + (this.gridSize/2), start.y + (this.gridSize/2));
  this.horizontal ? ctx.lineTo(start.x + (this.gridSize/2), end.y + (this.gridSize/2))
                  : ctx.lineTo(end.x + (this.gridSize/2), start.y + (this.gridSize/2));
  ctx.lineTo(end.x + (this.gridSize/2), end.y + (this.gridSize/2));
  
  var corridor = document.getElementById("corridor");
  var ptrn = scaledPattern(corridor, this.gridSize*4);
  ctx.strokeStyle = ptrn;
  ctx.lineWidth = this.gridSize;
  ctx.stroke();
  ctx.restore();
}
