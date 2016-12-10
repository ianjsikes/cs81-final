function Room (x, y, w, h, gridSize) {
  this.x = x; this.y = y; this.w = w; this.h = h; this.gridSize = gridSize;
  this.edges = [];
  this.center = new Vector(Math.round(w/2)+x, Math.round(h/2)+y);
}

Room.prototype.scaledDimensions = function () {
  return {
    x: this.x * this.gridSize,
    y: this.y * this.gridSize,
    w: this.w * this.gridSize,
    h: this.h * this.gridSize,
  };
}

Room.prototype.neighbors = function () {
  return this.edges.map(function (edge) {
    return (edge.r1 !== this) ? edge.r1 : edge.r2;
  });
}

Room.prototype.shortestEdge = function () {
  return this.edges.reduce(function (min, curr) {
    return (curr.length < min.length) ? curr : min;
  });
}

Room.prototype.intersects = function (r2) {
  return this.x <= (r2.x + r2.w)
      && r2.x   <= (this.x + this.w)
      && this.y <= (r2.y + r2.h)
      && r2.y   <= (this.y + this.h);
}

Room.prototype.addEdge = function (e) {
  for (var i = 0; i < this.edges.length; i++) {
    if (e.equals(this.edges[i])) {
      return;
    }
  }
  this.edges.push(e);
}

Room.prototype.sortEdges = function () {
  this.edges.sort(function (a, b) {
    return (a.length - b.length);
  });
}

Room.prototype.randomPoint = function () {
  return this.center; // TODO
}

Room.prototype.render = function (ctx) {
  var floor = document.getElementById("floor");
  var dim = this.scaledDimensions();
  var ptrn = scaledPattern(floor, this.gridSize*4);
  
  ctx.save();
  ctx.fillStyle = ptrn;
  ctx.fillRect(dim.x+this.gridSize, dim.y+this.gridSize, dim.w-this.gridSize, dim.h-this.gridSize);
  ctx.restore();
}

Room.prototype.renderWalls = function (ctx) {
  var wall = document.getElementById("wall");
  var dim = this.scaledDimensions();
  var ptrn = scaledPattern(wall, this.gridSize*4);

  ctx.save();
  ctx.strokeStyle = ptrn;
  ctx.lineWidth = this.gridSize;
  ctx.strokeRect(dim.x+(this.gridSize/2), dim.y+(this.gridSize/2), dim.w, dim.h);
  ctx.restore();
}
