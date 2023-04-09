
let dpi = window.devicePixelRatio;
///enemy setup
let Enemies = [];
let BossFight = false;
let enemycap = 70;
let nextRep = 0;
let points = 0;
const EnemyTypes = ["Fast", "Easy", "PowerCell", "Rouge", "Brute", "Basic", "Boss"]
const MatchingFrameAmounts = [5, 4, 6, 8, 4, 8, 1]
let FrameMap = new Map();
function initFrames(){
    for(let i = 0; i < EnemyTypes.length; i++){
        let frames = [undefined];
        for(let j = 1; j <= MatchingFrameAmounts[i]; j++){
            
            let frame = new Image();
            frame.src = "enemy/" + EnemyTypes[i]+  "/" + EnemyTypes[i] + j + ".png";
            frame.onload = function(){
                frames.push(frame);
            }
        }
        FrameMap.set(EnemyTypes[i], frames);
    }
}

//let bgMusic = new sound("../music/Aquarium-Fever.mp3");
//      bgMusic.play();

function ShowEndScreen(){
    GameContext.fillStyle = "black";
    GameContext.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
    GameContext.fillStyle = "white";
    GameContext.font = "30px Arial";
    GameContext.fillText("Game Over", GameCanvas.width / 2, GameCanvas.height / 2);
    GameContext.fillText("Score: " + points, GameCanvas.width / 2, GameCanvas.height / 2 + 30);
    GameContext.fillText("Press R to restart", GameCanvas.width / 2, GameCanvas.height / 2 + 60);
    GameContext.fillText("Press H to submit to the scoreboard", GameCanvas.width / 2, GameCanvas.height / 2 + 90);
    downThisTick = {};
    window.addEventListener('keydown', function(e){
        if(e.keyCode == 82){
            location.reload();
        }
        if(e.keyCode == 72){
            this.localStorage.setItem("score", points);
            window.location.href = "http://localhost:3000/submit/";

        }

    });
}
initFrames();
console.log(FrameMap);
function CreateEnemy(){
    //checks here
    if (Enemies.length < enemycap){
    Enemies.push({
        rotate: 0,
        frame:1,
        framecounter: 0,
        framecount: 1,
        sprite: "nothing",
        x: Math.random() * GameCanvas.width,
        y: Math.random() * GameCanvas.height,
        width: 30,
        height: 30,
        color: "red",
        velocity: [Math.random() * 10 - 5, Math.random() * 10 - 5],
        ai: function(){
        },
        damage: 10,
    });
    return Enemies[Enemies.length - 1];
    }
    nextRep++;
    Enemies[nextRep] = {
        rotate: 0,
        frame:1,
        framecounter: 0,
        framecount: 1,
        sprite: "nothing",
        x: Math.random() * GameCanvas.width,
        y: Math.random() * GameCanvas.height,
        width: 30,
        height: 30,
        color: "red",
        velocity: [Math.random() * 10 - 5, Math.random() * 10 - 5],
        ai: function(){
        },
        damage: 10,
    }
    return Enemies[nextRep];
}

///powerup setup
let Powerups = [];
let powerupcap = 200;
function CreatePowerup(){
    //checks here
    if (Powerups.length < powerupcap){
    Powerups.push({
        frame:1,
        framecounter: 0,
        framecount: 1,
        sprite: "nothing",
        x: Math.random() * GameCanvas.width,
        y: Math.random() * GameCanvas.height,
        width: 30,
        height: 30,
        color: "red",
        pickup: function(){
        },
       // ptype: poweruptype
    });
    return Powerups[Powerups.length - 1];
    }
    return Powerups[0];
}

let playerFrames = [];
for(let i = 1; i <= 4; i++){
    let frame = new Image();
    frame.src = "img/Player" + i + ".png";
    
    frame.onload = function(){
        playerFrames.push(frame);
    }
}


function BossFightTick(){
    for(let e =0; e < Enemies.length; e++){
            if(Enemies[e].boss == undefined){
                Enemies.splice(e, 1);
            }
            else
            {
                if(e.ai!= undefined){
            e.ai(); 
                }
        }
    }
}
let player = null ;
let GameContext = null;
let GameCanvas = null;
function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(GameCanvas).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(GameCanvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    GameCanvas.setAttribute('height', style_height * dpi);
    GameCanvas.setAttribute('width', style_width * dpi);
    }
downThisTick = {};
window.addEventListener('DOMContentLoaded', function() {
    
    GameCanvas = document.getElementById("game");
GameContext = GameCanvas.getContext("2d");
let cavArea = GameCanvas.width * GameCanvas.height;
player = {
    iframes: 0,
    x: 0,
    y: 0,
    width:  cavArea / 1000,
    height: cavArea / 1000,
    speed: 8,
    color: "blue",
    hp : 100,
    maxHp : 100,
    currentPowerups:[]
};
    fix_dpi();
    onkeydown = onkeyup = function(e){
        e = e || event; 
        downThisTick[e.keyCode] = e.type == 'keydown';
    }
    
     GameContext.webkitImageSmoothingEnabled = false;
     GameContext.mozImageSmoothingEnabled = false;
     GameContext.imageSmoothingEnabled = false;
     
    function Update() {
        try {
            GameContext.restore();
        }catch(e){
            console.log(e);
        }
        if(BossFight){
            BossFightTick();
            //TODO
        }
        else{
        TickGame(); 
        }
        if(player.hp < 0){
            ShowEndScreen();
            return; 
        }
        UpdatePowerups();
        UpdatePlayer();
        UpdateEnemies();

        player.color = "blue";
        GameContext.clearRect(0, 0, GameCanvas.width, GameCanvas.height);
        GameContext.fillStyle = "white";
        GameContext.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
        DrawEnemies();
        DrawPlayer();
        DrawPowerUps(); 
        Draw_UI(GameContext, player);
        requestAnimFrame(function() {
            Update();
          });
       // ResetKeys();
    }
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
        
      })();
      Update();
        

    //setInterval(Update, 1000 / 120);
});
function DrawPowerUps(){
    for(let v of Powerups){
        DrawPowerupImage(v);
    }
}
function UpdatePlayer() {
    if (downThisTick[97] || downThisTick[37] || downThisTick[65]) {
        player.x -= player.speed;
    }
    if (downThisTick[100] || downThisTick[39] || downThisTick[68]) {
        player.x += player.speed;
    }
    if (downThisTick[119] || downThisTick[38] || downThisTick[87]) {
        player.y -= player.speed;
    }
    if (downThisTick[115] || downThisTick[40] || downThisTick[83]) {
        player.y += player.speed;
    }
    player.iframes--;
    SnapPlayerInside();
    UpdatePlayerPowerups();

}
function UpdatePlayerPowerups(){
    for(let i = 0; i < player.currentPowerups.length; i++){
        player.currentPowerups[i].pickup();
    }
}
function    SnapPlayerInside() {
    if (player.x < 0) {
        player.x = 0;

    }
    if (player.x + player.width > GameCanvas.width) {
        player.x = GameCanvas.width - player.width;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > GameCanvas.height) {
        player.y = GameCanvas.height - player.height;
    }
}
function PlayerHasPowerup(powerup){
    for(let i = 0; i < player.currentPowerups.length; i++){
        if(player.currentPowerups[i].sprite == powerup){
            return true;
        }
    }
    return false;
}
function UpdateEnemies() { 
    
    for (let i = 0; i < Enemies.length; i++) {
        if(Enemies[i] == undefined){
            continue;
        }
        
        Enemies[i].x += Enemies[i].velocity[0];
        Enemies[i].y += Enemies[i].velocity[1];
        if(PlayerHasPowerup("Dispersal")){
            Enemies[i].velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1];
            
        }
        else {
            Enemies[i].ai();
        }
        if (Enemies[i].x > GameCanvas.width || Enemies[i].x < 0 || Enemies[i].y > GameCanvas.height || Enemies[i].y < 0) {
            Enemies.splice(i, 1);
        }
        let e = Enemies[i];
        //check if enemy is on an enemy
      for (let j = 0; j < Enemies.length; j++) {
        if (Enemies[j] == undefined) {
            continue;
        }
        if (Enemies[j].x + Enemies[j].width > e.x && Enemies[j].x < e.x + e.width) {
            if (Enemies[j].y + Enemies[j].height > e.y && Enemies[j].y < e.y + e.height) {
                if (Enemies[j].x > e.x) {
                    Enemies[j].x += 1;
                }
                else {
                    Enemies[j].x -= 1;
                }
                if (Enemies[j].y > e.y) {
                    Enemies[j].y += 1;
                }
                else {
                    Enemies[j].y -= 1;
                }
            }
        }
            
        
    }
    }
    CheckForCollisions();
}
function CheckForCollisions() {
    for (let i = 0; i < Enemies.length; i++) {
        if (Enemies[i].x + Enemies[i].width > player.x && Enemies[i].x < player.x + player.width) {
            if (Enemies[i].y + Enemies[i].height > player.y && Enemies[i].y < player.y + player.height) {
                if (player.iframes <= 0) {
                    player.hp -= Enemies[i].damage;
                    player.iframes = 60 * 1; 
                }
                
            }
        }
    }
}



function DrawPowerupImage(powerup) {
    let i = new Image();
    i.src = "powerup/" + powerup.sprite + ".png";
    GameContext.drawImage(i, powerup.x, powerup.y, powerup.width, powerup.height);

}
function UpdatePowerups() {  

    
    CheckForPowerupCollisions();
}
function CheckForPowerupCollisions() {
    for (let i = 0; i < Powerups.length; i++) {
        if (Powerups[i].x + Powerups[i].width > player.x && Powerups[i].x < player.x + player.width) {
            if (Powerups[i].y + Powerups[i].height > player.y && Powerups[i].y < player.y + player.height) {
                player.currentPowerups.push(Powerups[i]);
                Powerups.splice(i, 1);
            }
        }
    }
}

function DrawEnemies() {
    for (let i = 0; i < Enemies.length; i++) {
        DrawEnemyImage(Enemies[i]);
    }
}


function DrawPlayer() {
    GameContext.fillStyle = "red";
    let base_image = new Image();
    let frame = Math.floor(tick / 10) % 4 + 1;
    base_image.src = 'img/Player' + frame + '.png';
    GameContext.drawImage(base_image, player.x, player.y, player.width, player.height);
    GameContext.fillStyle = player.color;
    }
function ResetKeys() {
    downThisTick = [];
}
function ScreenShake(amount){
    GameContext.save();
    GameContext.translate(Math.random() * amount - amount / 2, Math.random() * amount - amount / 2);
}
function BossAI() {
    this.timer++;
    if(this.timer > 60 * 4 && this.timer < 60 * 6){
        this.velocity = [0, 0];
        ScreenShake(10);
    }
    if(this.timer > 60 * 6){
    }
}
let tick = 0;
function TickGame() {
    if(points > 20){
        //TODO update
        Enemies = [];
       BossFight = true;
       let  boss = CreateEnemy(); 
       boss.boss = true;
       boss.sprite = "Boss";
       boss.x = GameCanvas.width;
        boss.y = GameCanvas.height / 2;
        boss.width = GameCanvas.width * 0.1;
        boss.height = GameCanvas.width * 0.1;
        boss.velocity = [-1, 0];
        boss.hp = 100;
        boss.timer = 0; 
        boss.damage = 10;
        boss.color = "red";
        boss.ai = BossAI;
    }
    tick++;
    if (tick % 60 == 0) {
        points++;
    }
    //basic enemy   
    if (Math.random() < 0.004) {
        
        let e = CreateEnemy();
            e.framecount = 7;   
            e.sprite = "Basic";  
            e.damage =  10;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023;
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "green";
            e.ai =  BasicAI;
            e.timer =  0;
    }
    //rouge enemy
    if (Math.random() < 0.0025) {
        let e = CreateEnemy();
            e.framecount = 7;   
            e.sprite = "Rouge";  
            e.damage =  8;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023;
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "green";
            e.ai =  BasicAI;
            e.timer =  0;
    }
    //fast enemy   
    if (Math.random() < 0.0025) {
            let e = CreateEnemy();
            e.damage =  10;
            e.framecount = 5;
            e.sprite = "Fast";  
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023,
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "black";
            e.ai =  FastAI;
            e.timer =  0;
        
    }

    //brute enemy   
    if (Math.random() < 0.0025 && player.hp > 10) {
        let e = CreateEnemy();
            e.framecount = 4;
            e.sprite = "Brute";
            e.damage =  30;
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.046,
            e.height = GameCanvas.width * 0.046;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "grey";
            e.ai =  BruteAI;
            e.timer =  0;
    }
    //powercell enemy   
    if (Math.random() < 0.00123 && player.hp > 40) {
        let e = CreateEnemy();
        e.framecount = 6;
        e.sprite = "PowerCell";
        e.damage =  0;
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023,
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "red";
            e.ai =  PowercellAI;
            e.timer =  0;
    }
    //dispersal powerup
    if (Math.random() < 0.0007) {
        let e = CreatePowerup();
            e.frame = 1;
            e.framecount = 1;
            e.sprite = "Dispersal";
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023
            e.height =  GameCanvas.width * 0.023;
            e.pickup =  DispersalPU;
            e.timer =  0;
    }
    //speed powerup
    if (Math.random() < 0.0007) {
        let e = CreatePowerup();
            e.frame = 1;
            e.framecount = 1;
            e.sprite = "Speed";
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023
            e.height =  GameCanvas.width * 0.023;
            e.pickup =  function() {
                player.currentPowerups.splice(
                player.currentPowerups.indexOf(this) , 1)  
                if(this.timer == 0){
                player.speed += 3;
                }
                if(this.timer == 300){
                    
                    player.speed -= 3;
                }
                this.timer++;
            };
            e.timer =  0;
    }


    //health powerup
    if (Math.random() < 0.0001) {
        let e = CreatePowerup();
            e.frame = 1;
            e.framecount = 1;
            e.sprite = "Health";
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023
            e.height =  GameCanvas.width * 0.023;
            e.pickup =  HealthPU;
            e.timer =  0;
    }
    
}
function norm(v) {
    let len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    v[0] /= len;
    v[1] /= len;
}

///follow player every 2 seconds
function BasicAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 120) {
        //if we have waited for 120 or more ticks,
        this.velocity[0] = (player.x - this.x); //get the diffrence
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}
function DrawEnemyImage(e) {  
    e.framecounter++;
    if (e.framecounter > 10) {
        e.framecounter = 0;
        e.frame++;
    }
    if (e.frame > e.framecount) {
        e.frame = 1;
    }
    
    GameContext.save();
    let base_image = FrameMap.get(e.sprite)[e.frame];
    if(base_image == undefined){
        console.log(e.sprite);
        
    }else{
    GameContext.drawImage(base_image, e.x, e.y, e.width, e.height);
    }
    GameContext.restore();
}

///follow player every second
function FastAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 180) {
        //if we have waited for 120 or more ticks,
        this.velocity[0] = (player.x - this.x); //get the diffrence
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.velocity[0] *= 3;
        this.velocity[1] *= 3;
        this.timer = 0;  //reset the timer
    }
}
///follow player every half second
function BruteAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 30) {
        //if we have waited for 120 or more ticks,
        this.velocity[0] = (player.x - this.x); //get the diffrence
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.velocity[0] *= .5;
        this.velocity[1] *= .5;
        this.timer = 0;  //reset the timer
    }
}
///follow player every 7 seconds
function PowercellAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if( this.timer > 60*7 && this.timer < 60*8){
        this.velocity = [0,0];
    }
    else if (this.timer > 60*11) {
        //if we have waited for 120 or more ticks,
        this.velocity[0] = Math.random() * 2 - 1; //get the diffrence
        this.velocity[1] = Math.random() * 2 - 1;
        this.velocity[0] *= .5;
        this.velocity[1] *= .5;
        this.timer = 0;  //reset the timer
    }
    if(this.velocity[0] != 0){
        if (Math.random() < 0.01) {
        let e = CreateEnemy();
        e.sprite = "Easy";
        e.framecount = 4;
        e.damage =  0;
            e.x = this.x;
            e.y = this.y;
            e.width = GameCanvas.width * 0.023;
            e.height =  GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "blue";
            e.timer =  0;
            e.ai =  EasyAI;
        }
    }
    
}
///follow player every 4 seconds
///easy enemies that are spawned from the powercell
function EasyAI() {
    this.rotation = RotationFromVelocity(this.velocity);
    
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 240) {
        //if we have waited for 240 or more ticks,
        this.velocity[0] = (player.x - this.x); //get the diffrence
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}
function RotationFromVelocity(v) {
    let angle = Math.atan2(v[1], v[0]);
    return angle * 180 / Math.PI;
}
///confused from dispersal
function ConfusedAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 30) {
        e.rotation = RotationFromVelocity(this.velocity);
        //if we have waited for 240 or more ticks,
        this.velocity[0] = (Math.random() * 2 - 1 - this.x); //get the diffrence
        this.velocity[1] = (Math.random() * 2 - 1 - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}



function DispersalPU(){
    this.timer++;  //increase the amount ticks we have been waiting

 
    
    if (this.timer > 60*5) {

        player.currentPowerups.splice(
        player.currentPowerups.indexOf(this) , 1)  
    }
    
}

function HealthPU(){
    this.timer++;  //increase the amount ticks we have been waiting
    player.hp += 10;//heal player 30hp
    if (this.timer > 3) {
        powerupsfx.play();
        player.currentPowerups.splice(
        player.currentPowerups.indexOf(this) , 1)  
    }

}


function Draw_UI(_, _){
    GameContext.fillStyle = "red";
    GameContext.font = "30px Quantico";
    GameContext.fillText("Score: " + points, 0, 40);
    GameContext.fillRect(0,0 , player.hp * 10,10 );
    GameContext.fillStyle = "blue";
    GameContext.fillRect(0,10    , (player.iframes/ 60) * player.maxHp * 10 ,10 );
}

//check if any enemies are being hovered
