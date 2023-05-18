var boxes = [];
var start = 0;
var end = 0;
var cell_width = 0;
var total_rows = 35;
var running = false;

import PriorityQueue from "./PriorityQueue.js";
function setup() {
  var is_height = true;
  if (windowWidth > windowHeight) {
    is_height = true;
    var cnv = createCanvas(windowHeight, windowHeight);
  } else {
    is_height = false;
    var cnv = createCanvas(windowWidth, windowWidth);
  }

  if (is_height) {
    cnv.position(windowWidth / 2 - windowHeight / 2);
  }

  var BLACK = color(0, 0, 0);
  var WHITE = color(255, 255, 255);
  var RED = color(255, 0, 0);
  var GREEN = color(0, 255, 0);
  var BLUE = color(0, 0, 255);
  var GREY = color(128, 128, 128);
  var PURPLE = color(192, 0, 192);
  var OTHER_BLUE = color(0, 128, 128);
  var ORANGE = color(255, 140, 0);
  var CORAL = color(255, 127, 80);
  var DARK_PURPLE = color(128, 0, 128);

  var START_COLOR = ORANGE;
  var END_COLOR = BLUE;
  var BARRIER_COLOR = BLACK;
  var WEIGHT_COLOR = GREY;
  var PATH_COLOR = PURPLE;
  var DARK_PATH_COLOR = DARK_PURPLE;
  var OPEN_COLOR = GREEN;
  var CLOSE_COLOR = RED;
  var VISITED_COLOR = OTHER_BLUE;

  var DEFAULT = WHITE;
  class Node {
    constructor(x, y, row, col, cell_width) {
      this.x = x;
      this.y = y;
      this.row = row;
      this.col = col;
      this.color = DEFAULT;
      this.id = [row, col];
      this.cell_width = cell_width;
      this.weighted = false;
      fill(this.color);
      square(this.x, this.y, cell_width);
    }
    is_default() {
      return this.color == DEFAULT ? true : false;
    }
    is_start() {
      return this.color == START_COLOR ? true : false;
    }
    is_end() {
      return this.color == END_COLOR ? true : false;
    }
    is_open() {
      return this.color == OPEN_COLOR ? true : false;
    }
    is_close() {
      return this.color == CLOSE_COLOR ? true : false;
    }
    is_barrier() {
      return this.color == BARRIER_COLOR ? true : false;
    }
    is_path() {
      return this.color == PATH_COLOR || this.color == DARK_PATH_COLOR
        ? true
        : false;
    }
    is_weight() {
      return this.color == WEIGHT_COLOR ? true : false;
    }
    is_visited() {
      return this.color == VISITED_COLOR ? true : false;
    }
    make_default() {
      this.weighted = false;
      this.color = DEFAULT;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_barrier() {
      this.color = BARRIER_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_start() {
      this.color = START_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_end() {
      this.color = END_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_open() {
      this.color = OPEN_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_close() {
      this.color = CLOSE_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_path() {
      this.color = PATH_COLOR;
      if (this.weighted) this.color = DARK_PATH_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_weighted() {
      this.weighted = true;
      this.color = WEIGHT_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }
    make_visited() {
      this.color = VISITED_COLOR;
      fill(this.color);
      square(this.x, this.y, this.cell_width);
    }

    get_neighbors() {
      let neighbors = [];
      if (this.row > 0 && !boxes[this.row - 1][this.col].is_barrier())
        neighbors.push(boxes[this.row - 1][this.col]);
      if (this.col > 0 && !boxes[this.row][this.col - 1].is_barrier())
        neighbors.push(boxes[this.row][this.col - 1]);
      if (
        this.row < total_rows - 1 &&
        !boxes[this.row + 1][this.col].is_barrier()
      )
        neighbors.push(boxes[this.row + 1][this.col]);
      if (
        this.col < total_rows - 1 &&
        !boxes[this.row][this.col + 1].is_barrier()
      )
        neighbors.push(boxes[this.row][this.col + 1]);
      return neighbors;
    }
    get_neighbors_maze() {
      let neighbors = [];
      if (this.row > 1) neighbors.push(boxes[this.row - 2][this.col]);
      if (this.col > 1) neighbors.push(boxes[this.row][this.col - 2]);
      if (this.row < total_rows - 2)
        neighbors.push(boxes[this.row + 2][this.col]);
      if (this.col < total_rows - 2)
        neighbors.push(boxes[this.row][this.col + 2]);
      return neighbors;
    }
  }

  cell_width = width / total_rows;
  let row = 0;
  let col = 0;
  running = true;
  for (let y = 0; y < width; y += cell_width) {
    boxes[row] = [];
    col = 0;
    for (let x = 0; x < width; x += cell_width) {
      boxes[row].push(new Node(x, y, row, col, cell_width, boxes));
      col += 1;
    }
    row += 1;
  }
  running = false;
}

function draw() {
  if (!running) {
    mouseActions();
    keyboardActions();
  }
}

function keyboardActions() {
  if (keyIsPressed) {
    if (keyIsDown(82)) {
      reset();
      return true;
    }
    if (keyIsDown(32) && !running) {
      if (start != 0 && end != 0) {
        clearearlier();
        Djikstra(start, end);
        return true;
      }
    }
    if (keyIsDown(67)) {
      clearearlier();
      return true;
    }
    if (keyIsDown(77) && !running) {
      DFS_Maze_generator(start, end);
      visited_to_default();
      return true;
    }
  }
  return false;
}
function mouseActions() {
  if (mouseIsPressed) {
    let row = floor(mouseY / cell_width);
    let col = floor(mouseX / cell_width);
    try {
      let node = boxes[row][col];
      if (mouseButton == LEFT && !keyIsDown(17)) {
        if (node.is_default());
        else return;
        if (start == 0) {
          node.make_start();
          start = node;
          return;
        } else if (end == 0) {
          if (node.is_start()) return;
          else {
            node.make_end();
            end = node;
            return;
          }
        } else {
          if (node.is_default()) {
            if (keyIsDown(87)) node.make_weighted();
            else node.make_barrier();
            return;
          }
        }
      } else if (mouseButton == CENTER) {
        reset();
      } else if (
        (mouseButton == LEFT && keyIsDown(17)) ||
        mouseButton == RIGHT
      ) {
        if (node.is_start()) {
          start = 0;
          node.make_default();
          return;
        } else if (node.is_end()) {
          end = 0;
          node.make_default();
          return;
        }
        node.make_default();
      }
    } catch (e) {}
  }
}
function clearearlier() {
  let row = 0;
  running = true;
  for (let y = 0; y < width; y += cell_width) {
    let col = 0;
    for (let x = 0; x < width; x += cell_width) {
      if (
        boxes[row][col].is_close() ||
        boxes[row][col].is_open() ||
        boxes[row][col].is_path()
      )
        if (boxes[row][col].weighted) boxes[row][col].make_weighted();
        else boxes[row][col].make_default();
      col += 1;
    }
    row += 1;
  }
  running = false;
}
function reset() {
  start = 0;
  end = 0;
  let row = 0;
  running = true;
  for (let y = 0; y < width; y += cell_width) {
    let col = 0;
    for (let x = 0; x < width; x += cell_width) {
      boxes[row][col].make_default();
      col += 1;
    }
    row += 1;
  }
  running = false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generate_path(parent_node, start, current) {
  running = true;
  if (current == start) return;
  current = parent_node[current];
  if (keyboardActions()) return false;
  if (current != start) {
    boxes[current[0]][current[1]].make_path();
    await sleep(12);
  }
  if (keyboardActions()) return false;
  generate_path(parent_node, start, current);
  running = false;
}

async function Djikstra(start, end) {
  let count = 0;
  let open_nodes = new PriorityQueue();
  let open_nodes_track = new Set();
  running = true;
  open_nodes_track.add(start.id);
  open_nodes.push([0, count, start.id]);
  let parent_node = {};
  let g_score = {};
  let f_score = {};
  for (let row in boxes) {
    for (let col in boxes[row]) {
      let node = boxes[row][col];
      g_score[node.id] = Infinity;
    }
  }
  g_score[start.id] = 0;

  while (!open_nodes.isEmpty()) {
    if (keyboardActions()) return false;
    let current = open_nodes.pop();
    let pos = current[2];
    current = boxes[pos[0]][pos[1]];
    open_nodes_track.delete(current.id);

    if (current == end) {
      generate_path(parent_node, start.id, end.id);
      current.make_end();
      running = false;
      return true;
    }
    let current_neighbors = current.get_neighbors();
    for (let current_neighbor in current_neighbors) {
      if (keyboardActions()) return false;

      let neighbor = current_neighbors[current_neighbor];
      let temp_g = g_score[current.id] + 1;
      if (neighbor.weighted) temp_g += 1;

      if (temp_g < g_score[neighbor.id]) {
        if (keyboardActions()) return false;
        parent_node[neighbor.id] = current.id;
        g_score[neighbor.id] = temp_g;
        open_nodes.push([g_score[neighbor.id], count++, neighbor.id]);
        open_nodes_track.add(neighbor.id);

        neighbor.make_open();

        if (keyboardActions()) return false;

        await sleep(15);
      }
    }
    if (current != start) {
      current.make_close();
      await sleep(15);
    }
  }
  running = false;
  return false;
}
function windowResized() {
  if (windowWidth > windowHeight) {
    resizeCanvas(windowHeight, windowHeight);
  } else {
    resizeCanvas(windowWidth, windowWidth);
  }
}

function visited_to_default() {
  start = 0;
  end = 0;
  let row = 0;
  running = true;
  for (let y = 0; y < width; y += cell_width) {
    let col = 0;
    for (let x = 0; x < width; x += cell_width) {
      if (boxes[row][col].is_visited()) boxes[row][col].make_default();

      col += 1;
    }
    row += 1;
  }
  running = false;
}

function make_all_barriers() {
  start = 0;
  end = 0;
  let row = 0;
  running = true;
  for (let y = 0; y < width; y += cell_width) {
    let col = 0;
    for (let x = 0; x < width; x += cell_width) {
      boxes[row][col].make_barrier();
      col += 1;
    }
    row += 1;
  }
  running = false;
}

function get_odd() {
  let num = Math.floor(Math.random() * total_rows);
  if (num % 2) return num;
  return get_odd();
}

async function DFS_Maze_generator(start, end) {
  running = true;
  make_all_barriers();
  let row = get_odd();
  let col = get_odd();

  let current = boxes[row][col];
  let maze = new Array();
  maze.push(current);
  current.make_visited();

  while (maze.length != 0) {
    let num = Math.floor(Math.random() * maze.length);
    let current = maze[num];
    maze.splice(num, 1);

    let neighbors = current.get_neighbors_maze();
    let not_visited_neighbors = new Array();
    for (let neighbor_pos in neighbors) {
      let neighbor = neighbors[neighbor_pos];
      if (!neighbor.is_visited()) {
        not_visited_neighbors.push(neighbor);
        break;
      }
    }
    if (not_visited_neighbors.length != 0) {
      maze.push(current);
      let to_be_added =
        not_visited_neighbors[
          Math.floor(Math.random() * not_visited_neighbors.length)
        ];
      boxes[(to_be_added.id[0] + current.id[0]) / 2][
        (to_be_added.id[1] + current.id[1]) / 2
      ].make_visited();
      to_be_added.make_visited();
      maze.push(to_be_added);
    }
  }
  running = false;
  return;
}

window.setup = setup;
window.draw = draw;
