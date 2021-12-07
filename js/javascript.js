// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameSpeed = 1;
let gameover = false;
let flag = true;
ctx.font = "40px cursive";

//Mouse Interaction
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};
canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

//Player
const playerLeft = new Image();
playerLeft.src = "./images/fish_left.png";
const playerRight = new Image();
playerRight.src = "./images/fish_right.png";
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  draw() {
    // if (mouse.click) {
    //   ctx.lineWidth = 0.2;
    //   ctx.beginPath();
    //   ctx.moveTo(this.x, this.y);
    //   ctx.lineTo(mouse.x, mouse.y);
    //   ctx.stroke();
    // }
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 55,
        this.spriteWidth / 4,
        this.spriteHeight / 3
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 55,
        this.spriteWidth / 4,
        this.spriteHeight / 3
      );
    }
    ctx.restore();
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dy, dx);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
    if(gameFrame % 10 == 0){
      this.frame++;
      if(this.frame >= 12) this.frame = 0;
      if(this.frame == 3 || this.frame == 7 || this.frame ==11){
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if(this.frame < 3) this.frameY = 0;
      else if(this.frame < 7) this.frameY =1;
      else if(this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
  }
}
const player = new Player();

//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "./images/bubble_frame_1.png";
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);
    // ctx.stroke();
    ctx.drawImage(
      bubbleImage,
      this.x - 68,
      this.y - 68,
      this.radius * 2.7,
      this.radius * 2.7
    );
  }
}
const gamestart = document.createElement("audio");
gamestart.src = "./audio/gamestart.mp3";
const BubblePop1 = document.createElement("audio");
BubblePop1.src = "./audio/pop1.ogg";
const BubblePop2 = document.createElement("audio");
BubblePop2.src = "./audio/pop2.wav";
const gameoversound = document.createElement("audio");
gameoversound.src = "./audio/gameover.wav";

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
    } else if (
      bubblesArray[i].distance <
      bubblesArray[i].radius + player.radius
    ) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") {
          BubblePop1.play();
        } else {
          BubblePop2.play();
        }
        score += 1;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        i--;
      }
    }
  }
}

//Background
const background = new Image();
background.src = "./images/background1.png";

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};
function handleBackground() {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) {
    BG.x1 = BG.width;
  }
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) {
    BG.x2 = BG.width;
  }
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

//Enimies
const enemyImage = new Image();
enemyImage.src = "./images/enemy_fish.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 48;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteHeight = 397;
    this.spriteWidth = 418;
  }
  draw() {
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x-50,
      this.y-55,
      this.spriteWidth/4,
      this.spriteHeight/4
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if(gameFrame % 5 == 0){
      this.frame++;
      if(this.frame >= 12) this.frame = 0;
      if(this.frame == 3 || this.frame == 7 || this.frame ==11){
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if(this.frame < 3) this.frameY = 0;
      else if(this.frame < 7) this.frameY =1;
      else if(this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
    //collision with player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if(distance < this.radius + player.radius){
      document.getElementById('pause').style.display='none';
      document.getElementById('new-game').style.width='105px';
      document.getElementById('new-game').style.display='block';
      gameoversound.play();
      handleGameOver();
    }
  }
}
const enemy1 = new Enemy();
function handleEnemies() {
  enemy1.draw();
  enemy1.update();
}

function handleGameOver(){
  ctx.fillStyle = 'white';
  ctx.fillText('GAME OVER, you reached score ' + score,100,250);
  gameover = true;
}

//Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  handleBubbles();
  player.update();
  player.draw();
  handleEnemies();
  
  ctx.fillStyle = "black";
  ctx.fillText("score: " + score, 10, 50);
  gameFrame++;
  if(flag && !gameover){
    // console.log(gameover)
    console.log(flag)
  requestAnimationFrame(animate);
  }
}

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
