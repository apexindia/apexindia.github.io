let gameSpaceWidth;
let gameSpaceHeight;
let timer;
let drag = false;
let score = 0;
let dx = dy = 5;
const pdx = 48;


window.addEventListener('load', init);
window.addEventListener('resize', init);
window.addEventListener('keydown', handleKeys);

function init () {
    this.ball = document.querySelector('#ball');
    this.paddle = document.querySelector('#paddle');
    this.scoreDisplay = document.querySelector('#score');
    this.gameSpace = document.querySelector('#game-space'); 
    
    this.paddleLeft = paddle.getBoundingClientRect().left;
    this.ballLeft = ball.getBoundingClientRect().left;
    this.ballTop = ball.getBoundingClientRect().top;
    this.paddleWidth = paddle.getBoundingClientRect().width;

    gameSpace.addEventListener('mousedown', mouseDown);
    gameSpace.addEventListener('mousemove', mouseMove);
    gameSpace.addEventListener('mouseup', mouseUp);
    gameSpace.addEventListener('touchstart', mouseDown);
    gameSpace.addEventListener('touchmove', mouseDown);
    gameSpace.addEventListener('touchend', mouseDown);

    layoutPage();
    timer = requestAnimationFrame(play);
}

function layoutPage () {
    gameSpaceWidth = innerWidth - 20;
    gameSpaceHeight = innerHeight - 20;
    [gameSpace.style.width, gameSpace.style.height] = [`${gameSpaceWidth}px`, `${gameSpaceHeight}px`];
}

function handleKeys (e) {
    const key = e.keyCode;
   if((key === 37 || key === 65) && paddleLeft > 0){
        paddleLeft -= pdx; 
    } else if ((key === 39 || key === 68) && paddleLeft < gameSpaceWidth - paddleWidth ){ 
        paddleLeft += pdx;
    } 
    if (paddleLeft < 0){
        paddleLeft = 0;
    }
    if (paddleLeft > gameSpaceWidth - paddleWidth){
        paddleLeft = gameSpaceWidth - paddleWidth - 2;
    }
    paddle.style.left = paddleLeft + 'px';
}

function play () {
    renderView();
    detectCollisions();
    changeGameSpeed();
    if(ballTop < gameSpaceHeight - 51) {
        timer = requestAnimationFrame(play);
    } else {
         gameOver();
    }
}

function renderView () {
    ballLeft += dx;
    ballTop += dy;
    [ball.style.left, ball.style.top] = [`${ballLeft}px`, `${ballTop}px`];
    score += 5;
    scoreDisplay.textContent = score;
}

function detectCollisions () {
    if(collisionX()){
        dx *= -1;
    }
    if (collisionY()){
        dy *= -1;
    }
}

function collisionX() {
    if(ballLeft < 8 || ballLeft > gameSpaceWidth - 20)
        return true;
    return false;
}

function collisionY() {
   if(ballTop < 8)
        return true;
    if(ballTop > gameSpaceHeight - 64){
        /*if(ballLeft >= paddleLeft - 2 && ballLeft < paddleLeft + paddleWidth +2)
            return true;*/
        if(ballLeft > paddleLeft + paddleWidth / 4  && ballLeft < paddleLeft + paddleWidth * 3 / 4){
            dx = dx > 0 ? 5 : -5;
            return true; 
        }  else if (ballLeft > paddleLeft - paddleWidth / 20 && ballLeft < paddleLeft + paddleWidth / 4){
            dx = dx > 0 ? 8 : -8; 
            return true;
        } else if (ballLeft > paddleLeft + paddleWidth * 3 / 4 && ballLeft < paddleLeft + paddleWidth + paddleWidth / 20){
            dx = dx > 0 ? 8 : -8;
            return true;
        }
    }
    return false;
}

function changeGameSpeed () {
    if(score % 2000 === 0){
        if(dy > 0)
            dy += 2;
        else 
            dy -= 2;
    }
}

function gameOver () {
    cancelAnimationFrame(timer);
    // window.removeEventListener('keydown', handleKeys);
    document.querySelector('.score-board').style.backgroundColor = 'red';
}

function mouseDown (e) {
    drag = true;
}

function mouseUp (e) {
    drag = false;
}

function mouseMove (e) {
      if(drag){
          e.preventDefault();
          paddleLeft = e.clientX - paddleWidth / 2 || e.targetTouches[0].pageX - paddleWidth / 2;
          if(paddleLeft < 0)
            paddleLeft = 0;
          if(paddleLeft > (gameSpaceWidth - paddleWidth))
            paddleLeft = gameSpaceWidth - paddleWidth - 2;
          paddle.style.left = paddleLeft + 'px';
      }  
}