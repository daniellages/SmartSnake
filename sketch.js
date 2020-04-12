// Program made by Daniel Lages
// Github: https://github.com/daniellages
// SmartSnake repository: https://github.com/daniellages/SmartSnake
// Remember to insert your modelURL from Teachable Machine in line 15

// The video
let video;
let flipVideo;

// Storing the label
let label = "waiting...";

// The classifier
let classifier;
let modelURL = '';  // <-- Insert your modelURL from Teachable Machine

// STEP 1: Load the model
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

// Snake Game Variables
let snake;
let rez = 10; // It is basically the speed of the game
let food;
let w;  // width
let h;  // height

// Canvas Size
let canvasWidth = 1080; // <-- Change the size of the canvas as you like!
let canvasHeight = 810;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.hide();
  // Mirro the video since we trained it that way!
  flipVideo = ml5.flipImage(video);

  // STEP 2: Start classifying
  classifyVideo();

  // Snake Game
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();
}

// STEP 2 classify!
function classifyVideo() {
  // Flip the video!
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, gotResults);
}

// Snake Game
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

// Control the game based on the label
function controlSnake() {
  if (label === "left") {
    snake.setDir(-1, 0);
  } else if (label === "right") {
    snake.setDir(1, 0);
  } else if (label === "down") {
    snake.setDir(0, 1);
  } else if (label === "up") {
    snake.setDir(0, -1);
  }
}

function draw() {
  background(255);

  // Draw the video
  image(flipVideo, 0, 0);
  textSize(32);
  fill(0);
  text(label, 10, 50);

  // Draw Score
  let score = snake.scoreboard();
  textSize(32);
  fill (0);
  text(score, 30, 50);

  // Draw the game
  scale(rez);
  if (snake.eat(food)) {
    foodLocation();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    setup();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}

// STEP 3: Get the classification
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  // Control the snake and classify again
  controlSnake();
  classifyVideo();
}