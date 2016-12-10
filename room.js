// Ian Sikes

// Constructor for a Room object
function Room (x, y, w, h, gridSize) {
  this.x = x; this.y = y; this.w = w; this.h = h; this.gridSize = gridSize;
  this.edges = [];
  this.center = new Vector(Math.round(w/2)+x, Math.round(h/2)+y);
}

// Returns scaled dimensions of the room for use in rendering
Room.prototype.scaledDimensions = function () {
  return {
    x: this.x * this.gridSize,
    y: this.y * this.gridSize,
    w: this.w * this.gridSize,
    h: this.h * this.gridSize,
  };
}

// Returns true if r2 is within this room
Room.prototype.intersects = function (r2) {
  return this.x <= (r2.x + r2.w)
      && r2.x   <= (this.x + this.w)
      && this.y <= (r2.y + r2.h)
      && r2.y   <= (this.y + this.h);
}

// Adds the edge to the room without creating duplicates
Room.prototype.addEdge = function (e) {
  for (var i = 0; i < this.edges.length; i++) {
    if (e.equals(this.edges[i])) {
      return;
    }
  }
  this.edges.push(e);
}

// Sorts edges by ascending length
Room.prototype.sortEdges = function () {
  this.edges.sort(function (a, b) {
    return (a.length - b.length);
  });
}

// Returns a random point inside the room (for aesthetic randomness)
Room.prototype.randomPoint = function () {
  return this.center; // TODO
}

// Renders the floor of the room
Room.prototype.render = function (ctx) {
  var floor = document.getElementById("floor");
  var dim = this.scaledDimensions();
  var ptrn = scaledPattern(floor, this.gridSize*4);
  
  ctx.save();
  ctx.fillStyle = ptrn;
  ctx.fillRect(dim.x+this.gridSize, dim.y+this.gridSize, dim.w-this.gridSize, dim.h-this.gridSize);
  ctx.restore();
}

// Renders the walls of the room
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

// Renders decorations such as entrance/exit, if any
Room.prototype.renderDecorations = function (ctx) {
  var img;
  if (this.exit) {
    img = document.getElementById("exit");
  }
  else if (this.entrance) {
    img = document.getElementById("entrance");
  }
  else {
    return;
  }

  var dim = this.scaledDimensions();

  ctx.save();
  ctx.drawImage(img, dim.x+dim.w/2, dim.y+dim.h/2, this.gridSize*2, this.gridSize*2);
}
