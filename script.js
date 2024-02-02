var xDim = 0;
var yDim = 0;
var side = 0;
var snake = [];
var apple = [];
var dx = 0;
var dy = 0;
var turnQueue = [];
var score = 0;
var gameOver = false;
var walls = [];
var appledx = 0;
var appledy = 0;
p5.disableFriendlyErrors = true;

var sliderRed;
var sliderGreen;
var sliderBlue;

function realSetup() {
  document.getElementById("gameStuff").style = "display: show; margin:0px"
  document.getElementById("header").style = "display: none"
  xDim = number(document.getElementById("size").value);
  yDim = number(document.getElementById("size").value);
  side = Math.min((window.innerWidth - 50) / (xDim + 2), (window.innerHeight - 95) / (yDim + 2));
  snake = [0, Math.floor(yDim / 2), 1, Math.floor(yDim / 2), 2, Math.floor(yDim / 2)];
  apple = [8, Math.floor(yDim / 2)];
  resizeCanvas(side * (xDim + 2), side * (yDim + 2));
  frameRate(number(document.getElementById("speed").value));
  
  var r = sliderRed.value();
  var g = sliderGreen.value();
  var b = sliderBlue.value();
  drawGame(r, g, b);
}

function number(str) {
  if (str == "7") {
    return 7;
  } else if (str == "10") {
    return 10;
  } else if (str == "15") {
    return 15;
  } if (str == "20") {
    return 20;
  }
}


function setup() {
  createCanvas(0, 0);

  sliderRed = createSlider(0, 255, 1, 1);
  sliderRed.parent('header');
  sliderGreen = createSlider(0, 255, 1, 1);
  sliderGreen.parent('header');
  sliderBlue = createSlider(0, 255, 1, 1);
  sliderBlue.parent('header');

  document.getElementById("gameStuff").style = "display: none"
  noLoop();
}


function draw() {
  var r = sliderRed.value();
  var g = sliderGreen.value();
  var b = sliderBlue.value();
  
  if (isLooping()) {
    moveSnake();
    drawGame(r, g, b);
    checkDead();
  }
}

//adds arrow key presses to an array for the moveSnake() function to know when to turn, and starts the game if the snake is not dead
function keyPressed() {
  if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
    turnQueue.push(keyCode);
    if (!gameOver) {
      loop();
    }
  }
}

//checks if the snake is eating the apple and if the snake should turn, and moves the snake one space
function moveSnake() {
  if (turnQueue.length > 0) {
    var needResolving = true;
    var turn = "";
  }
  while (needResolving) {
    turn = turnQueue.shift();
    needResolving = ((turn === LEFT_ARROW || turn === RIGHT_ARROW) && dx !== 0) || ((turn === UP_ARROW || turn === DOWN_ARROW) && dy !== 0);
    if (!needResolving) {
      if (turn === LEFT_ARROW) {
        dx = -1;
        dy = 0;
      } else if (turn === RIGHT_ARROW) {
        dx = 1;
        dy = 0;
      } else if (turn === UP_ARROW) {
        dy = -1;
        dx = 0;
      } else {
        dy = 1;
        dx = 0;
      }
    }
    if (turnQueue.length === 0) {
      break;
    }
  }
  snake.push(snake[snake.length - 2] + dx, snake[snake.length - 1] + dy);
  
  if (document.getElementById("weirdStuff").value === "2") {
    apple[0] += appledx;
    apple[1] += appledy;
    var bounce = inWall(apple[0], apple[1]);
    for (var l = 0; l < snake.length / 2 - 1; l++) {
      bounce = bounce || (apple[0] === snake[2 * l] && apple[1] === snake[2 * l + 1]);
     }
    if (bounce) {
      appledx *= -1;
      appledy *= -1;
      apple[0] += 2 * appledx;
      apple[1] += 2 * appledy;
    }
  }
  
  if (!(snake[snake.length - 2] === apple[0] && snake[snake.length - 1] === apple[1]) & !(snake[snake.length - 2] === apple[0] - appledx && snake[snake.length - 1] === apple[1] - appledy)) {
    snake.shift();
    snake.shift();
  } else {
    score++;
    var inSnake = true;
    if (document.getElementById("weirdStuff").value === "1") {
      var newWall = [];
      while (inSnake) {
        newWall = [Math.floor(Math.random() * xDim), Math.floor(Math.random() * yDim)];
        inSnake = false;
        for (var m = 0; m < snake.length / 2; m++) {
          if (snake[2 * m] === newWall[0] && snake[2 * m + 1] === newWall[1]) {
            inSnake = true;
          }
        }
        for (var u = 0; u < walls.length; u++) {
          if (walls[u][0] === newWall[0] && walls[u][1] === newWall[1]) {
            inSnake = true;
          }
        }
      }
      walls.push(newWall);
    }
    inSnake = true;
    while (inSnake) {
      apple = [Math.floor(Math.random() * xDim), Math.floor(Math.random() * yDim)];
      inSnake = false;
      for (var n = 0; n < snake.length / 2; n++) {
        if (snake[2 * n] === apple[0] && snake[2 * n + 1] === apple[1]) {
          inSnake = true;
        }
      }
      for (var x = 0; x < walls.length; x++) {
        if (walls[x][0] === apple[0] && walls[x][1] === apple[1]) {
          inSnake = true;
        }
      }
      if (document.getElementById("weirdStuff").value === "2") {
        if (Math.random() < .5) {
          appledx = Math.sign(Math.random()-.5);
          appledy = 0;
        } else {
          appledx = 0;
          appledy = Math.sign(Math.random()-.5);
        }
      }
    }
  }
}

function inWall(x, y) {
  return x >= xDim || x < 0 || y >= yDim || y < 0;
}


//draws the grid, current score, snake and apple
function drawGame(r, g, b) {
  clear();
  textSize(18);
  for (var i = 0; i <= xDim; i++) {
    line(side * (i + 1), side, side * (i + 1), side * (yDim + 1));
  }
  for (var j = 0; j <= yDim; j++) {
    line(side, side * (j + 1), side * (xDim + 1), side * (j + 1));
  }
  fill(r, g, b) 

  for (var k = 0; k < snake.length / 2; k++) {
    rect(side * (snake[2 * k] + 1), side * (snake[2 * k + 1] + 1), side, side);
  }
  for (var l = 0; l < walls.length; l++) {
    rect(side * (walls[l][0] + 1), side * (walls[l][1] + 1), side, side);
  }
  fill(200, 0, 0);
  circle(side * (apple[0] + 1.5), side * (apple[1] + 1.5), side);
  document.getElementById("score").innerHTML = "Score: " + score + " <button onclick='restart()'>Restart</button>";
}


//ends the game and makes the head red if the snake has collided with the wall or itself
function checkDead() {
  gameOver = inWall(snake[snake.length - 2], snake[snake.length - 1]);
  for (var l = 0; l < snake.length / 2 - 2; l++) {
    gameOver = gameOver || (snake[snake.length - 2] === snake[2 * l] && snake[snake.length - 1] === snake[2 * l + 1]);
  }
  for (var u = 0; u < walls.length; u++) {
    if (walls[u][0] === snake[snake.length - 2] && walls[u][1] === snake[snake.length - 1]) {
      gameOver = true;
    }
   }
  if (gameOver) {
    noLoop();
    fill(200, 0, 0);
    rect(side * (snake[snake.length - 2] + 1), side * (snake[snake.length - 1] + 1), side, side);
  }
}

function restart() {
  var r = sliderRed.value();
  var g = sliderGreen.value();
  var b = sliderBlue.value();
  
  snake = [0, Math.floor(yDim / 2), 1, Math.floor(yDim / 2), 2, Math.floor(yDim / 2)];
  apple = [8, Math.floor(yDim / 2)];
  turnQueue = [];
  score = 0;
  gameOver = false;
  walls = [];
  dx = 0;
  dy = 0;
  drawGame(r, g, b);
}

