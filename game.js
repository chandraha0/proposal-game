const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let runFrames = [];
let frameIndex = 0;

for(let i=1;i<=4;i++){
let img = new Image();
img.src = "assets/dino"+i+".png";
runFrames.push(img);
}

let jumpImg = new Image();
jumpImg.src = "assets/jump.png";

let cactusImg = new Image();
cactusImg.src = "assets/cactus.png";

let trexImg = new Image();
trexImg.src = "assets/trex.png";

let girlDinoImg = new Image();
girlDinoImg.src = "assets/girl_dino.png";

let proposalDinoImg = new Image();
proposalDinoImg.src = "assets/proposal_dino.png";


// ===== GROUND =====

let groundY = 260;


// ===== PLAYER =====

let dino = {
x:100,
y:groundY-100,
width:80,
height:100,
vy:0,
gravity:0.6,
jump:-15
};


// ===== GAME =====

let obstacles = [];
let score = 0;
let nextSpawn = 0;
let gameFinished = false;


// ===== CUTSCENE =====

let scene = 0;

let girlX = canvas.width + 100;

let centerDinoX = canvas.width/2 - 110;
let centerGirlX = canvas.width/2 + 40;


// ===== PROPOSAL UI =====

let yesCount = 0;
let noCount = 0;

let yesOffset = 0;
let noOffset = 0;

let proposalUI = document.getElementById("proposalUI");
let yesBtn = document.getElementById("yesBtn");
let noBtn = document.getElementById("noBtn");
let resultText = document.getElementById("resultText");


// ===== INPUT DESKTOP =====

document.addEventListener("keydown", function(e){

if(e.code === "Space" && dino.y >= groundY - dino.height && !gameFinished){
dino.vy = dino.jump;
}

});


// ===== INPUT MOBILE =====

canvas.addEventListener("touchstart", function(e){

e.preventDefault();

if(dino.y >= groundY - dino.height && !gameFinished){
dino.vy = dino.jump;
}

},{passive:false});


// ===== RESET =====

function resetGame(){

score = 0;
obstacles = [];
dino.y = groundY - dino.height;
dino.vy = 0;
nextSpawn = 0;
gameFinished = false;

scene = 0;
girlX = canvas.width + 100;
dino.x = 100;

yesCount = 0;
noCount = 0;

yesOffset = 0;
noOffset = 0;

proposalUI.style.display = "none";
resultText.innerHTML = "";

}


// ===== SPAWN OBSTACLE =====

function spawnObstacle(){

let type = Math.random() < 0.5 ? "cactus" : "trex";

let obstacle;

if(type === "cactus"){

obstacle = {
x:canvas.width,
y:groundY-80,
width:40,
height:80,
img:cactusImg
};

}else{

obstacle = {
x:canvas.width,
y:groundY-90,
width:70,
height:90,
img:trexImg
};

}

obstacles.push(obstacle);

nextSpawn = Date.now() + (1000 + Math.random()*1500);

}


// ===== COLLISION =====

function collision(a,b){

let padding = 20;

return (
a.x + padding < b.x + b.width &&
a.x + a.width - padding > b.x &&
a.y + padding < b.y + b.height &&
a.y + a.height - padding > b.y
);

}


// ===== UPDATE =====

function update(){

if(gameFinished){

if(scene === 1){

girlX -= 3;

if(girlX <= canvas.width - 200){
scene = 2;
}

}

else if(scene === 2){

dino.x += 3;

if(dino.x >= girlX - 90){

scene = 3;

setTimeout(()=>{
scene = 4;
proposalUI.style.display = "block";
},1000);

}

}

else if(scene === 4){

if(dino.x > centerDinoX) dino.x -= 2;
if(girlX > centerGirlX) girlX -= 2;

}

return;

}


// ===== NORMAL GAME =====

dino.vy += dino.gravity;
dino.y += dino.vy;

if(dino.y > groundY - dino.height){
dino.y = groundY - dino.height;
dino.vy = 0;
}

if(Date.now() > nextSpawn){
spawnObstacle();
}

for(let i=obstacles.length-1;i>=0;i--){

let obs = obstacles[i];

obs.x -= 6;

if(collision(dino,obs)){
resetGame();
return;
}

if(obs.x < -100){
obstacles.splice(i,1);
score += 10;
}

}

if(score >= 170){
gameFinished = true;
obstacles = [];
scene = 1;
}

}


// ===== DRAW =====

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);


// ===== CUTSCENE =====

if(gameFinished){

ctx.strokeStyle = "black";
ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(0,groundY);
ctx.lineTo(canvas.width,groundY);
ctx.stroke();

ctx.drawImage(
girlDinoImg,
girlX,
groundY - 150,
90,
150
);

if(scene < 3){

ctx.drawImage(
runFrames[frameIndex],
dino.x,
groundY - 150,
120,
150
);

}else{

ctx.drawImage(
proposalDinoImg,
dino.x,
groundY - 120,
100,
120
);

}

if(scene >= 3){

ctx.font = "36px Arial";
ctx.fillStyle = "red";
ctx.textAlign = "center";

ctx.fillText(
"Will You Marry Me? 💍",
canvas.width/2,
120
);

}

return;

}


// ===== NORMAL DRAW =====

if(dino.y < groundY - dino.height){

ctx.drawImage(
jumpImg,
dino.x,
dino.y,
dino.width,
dino.height
);

}else{

ctx.drawImage(
runFrames[frameIndex],
dino.x,
dino.y,
dino.width,
dino.height
);

}

for(let obs of obstacles){

ctx.drawImage(
obs.img,
obs.x,
obs.y,
obs.width,
obs.height
);

}

ctx.fillStyle="black";
ctx.font="20px Arial";
ctx.fillText("Score: "+score,20,30);

}


// ===== LOOP =====

function gameLoop(){

update();
draw();
requestAnimationFrame(gameLoop);

}

gameLoop();


// ===== RUN ANIMATION =====

setInterval(()=>{

frameIndex++;

if(frameIndex >= runFrames.length){
frameIndex = 0;
}

},120);


// ===== YES BUTTON =====

yesBtn.onclick = function(){

yesCount++;

if(yesCount < 3){

yesOffset += 30;
yesBtn.style.position = "relative";
yesBtn.style.top = yesOffset + "px";

}else{

resultText.innerHTML = "I love you forever ❤️";

}

};


// ===== NO BUTTON =====

noBtn.onclick = function(){

noCount++;

if(noCount < 3){

noOffset += 30;
noBtn.style.position = "relative";
noBtn.style.top = noOffset + "px";

}else{

resultText.innerHTML = "I'm sorry, thank you";

}

};
