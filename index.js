var MAX_ATTEMPTS = 2000;
var opts = {
  GRID_SIZE: 8,
  MAX_ROOMS: 8,
  MIN_SIZE: 4,
  MAX_SIZE: 14,
  LOOPS: 2,
  DRAW_GRID: false,
};
var gridSizeSldr, maxRoomsSldr, minSizeSldr, maxSizeSldr;

var rooms = [];
var edges = [];
var ROWS, COLS;
var canvas, ctx, regenBtn;


setup();
run();

function setup () {
  canvas = document.getElementById('cnv');
  ctx = canvas.getContext('2d');
  regenBtn = document.getElementById('regenerate');
  regenBtn.addEventListener('click', run);

  gridSizeSldr = document.getElementById('grid-size');
  maxRoomsSldr = document.getElementById('max-rooms');
  minSizeSldr = document.getElementById('min-size');
  maxSizeSldr = document.getElementById('max-size');
}

function updateOptions () {
  opts.GRID_SIZE = Number(gridSizeSldr.value);
  opts.MAX_ROOMS = Number(maxRoomsSldr.value);
  opts.MIN_SIZE = Number(minSizeSldr.value);
  opts.MAX_SIZE = Number(maxSizeSldr.value);
}

function run () {
  updateOptions();
  ROWS = Math.round(canvas.width / opts.GRID_SIZE);
  COLS = Math.round(canvas.height / opts.GRID_SIZE);
  generateDungeon();
  renderDungeon(ctx);
}

// Setup the download button
document.getElementById('download').addEventListener('click', function() {
  this.href = canvas.toDataURL('png');
}, false);

/////////////////////
// RENDERING
/////////////////////

function renderBackground () {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var bg = document.getElementById('bg');
  var pattern = scaledPattern(bg, opts.GRID_SIZE*4);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function renderDungeon (ctx) {
  renderBackground();
  rooms.forEach(function (r) {
    r.renderWalls(ctx);
  });
  edges.forEach(function (e) {
    e.renderCorridor(ctx);
  })
  rooms.forEach(function (r) {
    r.render(ctx);
  });
}


/////////////////////
// GENERATION
/////////////////////

function generateDungeon() {
  rooms = [];
  edges = [];

  placeRooms();
  triangulate();
  edges = buildMST().concat(addExtraEdges());
}


// Generates a Delaunay triangulation between the rooms
// Creates edges connecting the rooms
function triangulate() {
  // Create triangulation
  var triangulation = Delaunay.triangulate(rooms.map(function (room) {
    return [room.center.x, room.center.y];
  }));

  // Make 3 new edges for every triangle (set of 3 points in the triangulation)
  for (var i = 0; i < triangulation.length; i += 3) {
    var r = [
      rooms[triangulation[i]],
      rooms[triangulation[i+1]],
      rooms[triangulation[i+2]]
    ];

    var e = [
      new Edge(r[0], r[1], opts.GRID_SIZE),
      new Edge(r[1], r[2], opts.GRID_SIZE),
      new Edge(r[2], r[0], opts.GRID_SIZE)
    ];

    edges.push(e[0], e[1], e[2]);
    r[0].addEdge(e[0]); r[0].addEdge(e[2]);
    r[1].addEdge(e[0]); r[1].addEdge(e[1]);
    r[2].addEdge(e[1]); r[2].addEdge(e[2]);
  }
}


// Constructs a minimum spanning tree from the rooms and edges,
// using Prim's algorithm, with distance as the edge weight
function buildMST () {
  var mstEdges = [];
  // Sort the edges so looping over them will be ordered (short->long)
  rooms.forEach(function (r) {
    r.sortEdges();
  });

  // Create a frontier of rooms added to the MST
  var frontier = [rooms[0]];
  frontier[0].visited = true;
  var finished = false;
  
  while (!finished) {
    finished = true;
    var nextEdge = null;
    var nextRoom = null;

    frontier.forEach(function (room) {
      for (var i = 0; i < room.edges.length; i++) {
        var edge = room.edges[i];
        if (!edge.visited && !edge.otherRoom(room).visited) {
          if (!nextEdge || nextEdge.length > edge.length) {
            finished = false;
            nextEdge = edge;
            nextRoom = edge.otherRoom(room);
            break;
          }
        }
      }
    });

    if (nextEdge && nextRoom) {
      nextEdge.visited = true;
      nextRoom.visited = true;
      mstEdges.push(nextEdge);
      frontier.push(nextRoom);
    }
  }
  return mstEdges;
}


// Adds some random non-MST edges back to the map to make it less linear
function addExtraEdges () {
  var extraEdges = [];
  var attempts = 0;
  while (extraEdges.length < opts.LOOPS && attempts < MAX_ATTEMPTS) {
    var room = rooms[randInt(0, rooms.length-1)];
    var edge = room.edges[randInt(0, room.edges.length-1)];
    if (!edge.visited) {
      extraEdges.push(edge);
    }
  }
  return extraEdges;
}


// Tries to put a randomly sized room in a random location until it
// finds a location that doesn't intersect with existing rooms
function placeRoom() {
  var attempts = 0;
  var isValidRoom = false;
  var r;
  while (!isValidRoom && attempts < MAX_ATTEMPTS) {
    isValidRoom = true;
    const x = randInt(1, COLS - opts.MAX_SIZE - 1);
    const y = randInt(1, ROWS - opts.MAX_SIZE - 1);
    const w = randInt(opts.MIN_SIZE, opts.MAX_SIZE);
    const h = randInt(opts.MIN_SIZE, opts.MAX_SIZE);

    r = new Room(x, y, w, h, opts.GRID_SIZE);
    rooms.forEach(function (room) {
      if (room.intersects(r)) {
        isValidRoom = false;
      }
    });

    attempts++;
  }
  return r;
}

function placeRooms() {
  for (var i = 0; i < opts.MAX_ROOMS; i++) {
    var r = placeRoom();
    if (r) rooms.push(r);
  }
}
