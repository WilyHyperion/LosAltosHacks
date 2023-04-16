
let dpi = window.devicePixelRatio;
///enemy setup
let Enemies = [];

let tick = 0;
let BossFight = false;
let enemycap = 200;
let nextRep = 0;
let points = 1;
const EnemyTypes = ["Fast", "Easy", "PowerCell", "Rouge", "Brute", "Basic", "Boss", "Summoner", "Bouncy"]
const MatchingFrameAmounts = [5, 4, 6, 8, 4, 8, 7, 6, 3]
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

WebFont.load({
    google: {
        families: ['Press+Start+2P:300,400,700']
    }
});

function ShowEndScreen(){
    GameContext.fillStyle = "black";
    GameContext.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
    GameContext.fillStyle = "white";
    GameContext.font = "30px Press+Start+2P";
    GameContext.fillText("Game Over", GameCanvas.width / 2 - GameCanvas.width / 10, GameCanvas.height / 2);
    GameContext.fillText("Score: " + points, GameCanvas.width / 2 - GameCanvas.width / 10, GameCanvas.height / 2 + 30);
    GameContext.fillText("Press R to restart", GameCanvas.width / 2 - GameCanvas.width / 10, GameCanvas.height / 2 + 60);
    GameContext.fillText("Press H to submit to the scoreboard", GameCanvas.width / 2, GameCanvas.height / 2 + 90);
    downThisTick = {};
    window.addEventListener('keydown', function(e){
        if(e.keyCode == 82){
            location.reload();
        }
        if(e.keyCode == 72){
            this.localStorage.setItem("score", points);
            window.location.href = "/submit/";

        }

    });
}
initFrames();

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
    frame.src = "Img/Player" + i + ".png";
    
    frame.onload = function(){
        playerFrames.push(frame);
    }
}


function BossFightTick(){
    
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
    x: GameCanvas.width * Math.random() * 2 - 1,
    y: GameCanvas.height* Math.random() * 2 - 1,
    width:  cavArea / 1250,
    height: cavArea / 1250,
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
           }
        if(BossFight){
            BossFightTick();
         }
        else{
        TickGame(); 
        }
       if (player.hp < 0 && (points == 69)||(points == 420)) {
           windows.location("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        } else if (player.hp < 0) {
            ShowEndScreen();
            return; 
        }
        UpdatePowerups();
        UpdatePlayer();
        
        UpdateEnemies();

        player.color = "blue";
        GameContext.clearRect(0, 0, GameCanvas.width, GameCanvas.height);
        GameContext.fillStyle = "lightblue";
        GameContext.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
        if(BossKiller){ 
            DrawBossKiller();
        }
        DrawEnemies();
        DrawPlayer();
        DrawPowerUps(); 
        DrawAllLines();
        SnapBossInside()
        //boss killer gets its own draw
        
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
let bHP = 3
function DrawBossKiller() {
    GameContext.fillStyle = "green";
    GameContext.fillRect(BossKiller.x, BossKiller.y, BossKiller.width, BossKiller.height);
    console.log(BossKiller.velocity);
    BossKiller.x += BossKiller.velocity[0];
    BossKiller.y += BossKiller.velocity[1];
    if (BossKiller.x < 0 || BossKiller.x + BossKiller.width > GameCanvas.width) {
        BossKiller.velocity[0] *= -1;
    }
    if (BossKiller.y < 0 || BossKiller.y + BossKiller.height > GameCanvas.height) {
        BossKiller.velocity[1] *= -1;
    }
    let Boss = Enemies.find(e => e.boss != undefined);
    if (Boss != undefined) {
        let x = Boss.x + Boss.width / 2;
        let y = Boss.y + Boss.height / 2;
        let x2 = BossKiller.x + BossKiller.width / 2;
        let y2 = BossKiller.y + BossKiller.height / 2;
        let dist = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        if (dist < 100) {
            bHP--;
            BossKiller = null;
            if (bHP <= 0) {
                BossKiller = null;
                Enemies.splice(Enemies.indexOf(Boss), 1);
                BossFight = false;
                Enemies = [];
                ScreenShake(25);

            }
        }
    }
   }
function DrawPowerUps(){
    for(let v of Powerups){
        DrawPowerupImage(v);
    }
}
function DrawAllLines(){
    for(let l of lines){
     DrawL(l);
     l.ticks--;
     if(l.ticks <= 0){
         lines.splice(lines.indexOf(l), 1);
     }
    }
}
function DrawL(l){
    GameContext.beginPath();
    GameContext.moveTo(l.x1, l.y1);
    GameContext.lineTo(l.x2, l.y2);
    GameContext.strokeStyle = l.color;
    GameContext.stroke();
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
function SnapBossInside() {
    if (this.x < 0) {
        this.x = 0;

    }
    if (this.x + this.width > GameCanvas.width) {
        this.x = GameCanvas.width - this.width;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.y + this.height > GameCanvas.height) {
        this.y = GameCanvas.height - this.height;
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
let lines = [];
function DrawLine(x1, y1, x2, y2, color, ticks) {
    lines.push({
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        color: color,
        ticks: ticks
    });
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
        if (Enemies[i].x > GameCanvas.width || Enemies[i].x < -5 || Enemies[i].y > GameCanvas.height  || Enemies[i].y < -5) {
            if(Enemies[i].boss == undefined){
            Enemies.splice(i, 1);
            }
            else{
                if(Enemies[i].x < 0){
                    Enemies[i].x = 0;
                }
                if(Enemies[i].x > GameCanvas.width){
                    Enemies[i].x = GameCanvas.width;
                    
                }
                if(Enemies[i].y < 0){
                    Enemies[i].y = 0;
                }
                if(Enemies[i].y > GameCanvas.height){
                    Enemies[i].y = GameCanvas.height;
                }

            }
        }
        let e = Enemies[i];
        //use drawRotated to rotate image based on where the player is
        
        
    }
    CheckForCollisions();
    
}
function drawRotated(degrees, image){
    GameCanvas.clearRect(0, 0, GameCanvas.width, GameCanvas.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    GameCanvas.save();

    // move to the center of the canvas
    GameCanvas.translate(GameCanvas.width / 2, GameCanvas.height / 2);

    // rotate the canvas to the specified degrees
    GameCanvas.rotate((degrees * Math.PI) / 180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    GameCanvas.drawImage(image, -image.width / 2, -image.width / 2);

    // we’re done with the rotating so restore the unrotated context
    GameCanvas.restore();
}

function CheckForCollisions() {
    for (let i = 0; i < Enemies.length; i++) {
        if(Enemies[i] == undefined){
            continue;
        }
        if (Enemies[i].x + Enemies[i].width > player.x && Enemies[i].x < player.x + player.width) {
            if (Enemies[i].y + Enemies[i].height > player.y && Enemies[i].y < player.y + player.height) {
                if (player.iframes <= 0) {
                    
                    player.hp -= Enemies[i].damage;
                    player.iframes = 30; 
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
let BossKiller = undefined;

function DrawPlayer() {
    GameContext.fillStyle = "red";
    let base_image = new Image();
    let frame = Math.floor(tick / 10) % 4 + 1;
    base_image.src = 'Img/Player' + frame + '.png';
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
let attack = Math.round(Math.random() * 3);
let numAttacks = 0;
let start = Math.round(Math.random() * 360);
let dirctoplayerO = [0, 0];
let BossDif = 90;
function SoulBossAI() {
    SnapBossInside()
    if(this.pTimer == undefined){
        this.pTimer = 0;
    }
    this.timer++;
    if(this.timer > 60 * 4 && this.timer < 60 * 6){
        this.velocity = [0, 0];
        ScreenShake(10);
    }
    if(this.timer > 60 * 6){
        if(this.timer % BossDif == 0){
            numAttacks++;
            this.velocity = [0, 0];
             attack = Math.round(Math.random() * 3);
             this.pTimer = 0;
             }
            this.pTimer++;
            console.log(attack);
            switch(attack){
                case 0:
                    
                    if(this.pTimer == 1){
                        let p = CreatePowerup();
                        p.x = this.x;
                        p.sprite = "BossKiller"
                        p.y = this.y;
                        p.pickup = function(){
                            player.currentPowerups.splice(player.currentPowerups.indexOf(this), 1);
                            let Boss = Enemies.find(e => e.boss != undefined);
                            if(Boss != undefined){
                            let dirc = [Boss.x - this.x, Boss.y - this.y];
                            norm(dirc);
                            dirc[0] *= 4;
                            dirc[1] *= 4;
                            BossKiller = {
                                timer: 0,
                                x : this.x,
                                y : this.y,
                                width : 50,
                                height : 50,
                                color : "red",
                                velocity : dirc,
                            }
                            }
                            
                            }
                        Powerups.push(p);
                       
                    DrawLine(this.x + this.width/2, this.y + this.height/2, player.x, player.y, "red", 40);
                    dirctoplayerO = [player.x - this.x, player.y - this.y];
                    }
                    else if(this.pTimer  == 20){
                        
                    norm(dirctoplayerO);
                    this.velocity = [dirctoplayerO[0] * 10, dirctoplayerO[1] * 10];
                    }
                    //Simple Dash

                    break;
                case 1:
                    this.velocity = [Math.random() * 2 -1, Math.random() * 2 -1];
                    SnapBossInside()
                    if(this.pTimer == 1){
                         start = Math.round(Math.random() * 360);
                       for(let i = 0; i < 360; i+= 30){
                        let angle = (start + i) * Math.PI / 180;
                        let x = Math.cos(angle) * 500;
                        let y = Math.sin(angle) * 500;
                        DrawLine(this.x + this.width/2, this.y + this.height/2, this.x + this.width/2 + x, this.y + this.height/2 + y, "red", 40);
                    }
                    
                }
                
                else if (this.pTimer > 30 && this.pTimer % 30 == 0){
                    for(let i = 0; i < 360; i+= 30){
                        let angle = (start + i) * Math.PI / 180;
                        let x = Math.cos(angle) * 500;
                        let y = Math.sin(angle) * 500;
                        let vector = [x, y];
                        norm(vector);
                        FireProjectile(this.x + this.width/2, this.y + this.height/2, vector, 2, 20)
                    }
                }
                
                    break;
                case 2:
                    let vectoPlayer = [player.x - this.x, player.y - this.y];
                    norm(vectoPlayer);
                    if(this.pTimer % 20 == 0){
                        FireProjectile(this.x + this.width/3, this.y + this.height/3, vectoPlayer,2, 20)
                    }
                    break;
                case 3:
                    this.velocity = [Math.random() * 2 -1, Math.random() * 2 -1];
                  
                    if(this.pTimer == 1){
                    for(let i = -30; i < 40; i+= 30){
                        let angle = i * Math.PI / 180;
                        let x = Math.cos(angle) * 500;
                        let y = Math.sin(angle) * 500;
                        let vectoPlayer = [player.x - this.x, player.y - this.y];
                        norm(vectoPlayer);
                        x += vectoPlayer[0] * 500;
                        y += vectoPlayer[1] * 500;
                        let vector = [x, y];
                        norm(vector);
                        FireProjectile(this.x + this.width/2, this.y + this.height/2, vector, 2, 20)
                    }
                }
                    break;
        }
    }

}

function SummonerBossAI() {
    SnapBossInside()
    if(this.pTimer == undefined){
        this.pTimer = 0;
    }
    this.timer++;
    if(this.timer > 60 * 4 && this.timer < 60 * 6){
        this.velocity = [0, 0];
        ScreenShake(15);
    }
    if(this.timer > 60 * 6){
        if(this.timer % BossDif == 0){
            numAttacks++;
            this.velocity = [0, 0];
             attack = Math.round(Math.random() * 3);
             this.pTimer = 0;
             }
            this.pTimer++;
            console.log(attack);
            switch(attack){
                case 0:
                    
                    if(this.pTimer == 1){
                        let p = CreatePowerup();
                        p.x = this.x;
                        p.sprite = "BossKiller"
                        p.y = this.y;
                        p.pickup = function(){
                            player.currentPowerups.splice(player.currentPowerups.indexOf(this), 1);
                            let Boss = Enemies.find(e => e.boss != undefined);
                            if(Boss != undefined){
                            let dirc = [Boss.x - this.x, Boss.y - this.y];
                            norm(dirc);
                            dirc[0] *= 4;
                            dirc[1] *= 4;
                            BossKiller = {
                                timer: 0,
                                x : this.x,
                                y : this.y,
                                width : 50,
                                height : 50,
                                color : "red",
                                velocity : dirc,
                            }
                            }
                            
                            }
                        Powerups.push(p);
                       
                    DrawLine(this.x + this.width/2, this.y + this.height/2, player.x, player.y, "red", 40);
                    dirctoplayerO = [player.x - this.x, player.y - this.y];
                    }
                    else if(this.pTimer  == 20){
                        
                    norm(dirctoplayerO);
                    this.velocity = [dirctoplayerO[0] * 10, dirctoplayerO[1] * 10];
                    SnapBossInside()
                    }
                    //Simple Dash

                    break;
                case 1:
                    this.velocity = [Math.random() * 2 -1, Math.random() * 2 -1];
                    SnapBossInside()
                    if(this.pTimer == 1){
                         start = Math.round(Math.random() * 360);
                       for(let i = 0; i < 360; i+= 30){
                        let angle = (start + i) * Math.PI / 180;

                    }
                    
                }
                
                else if (this.pTimer > 30 && this.pTimer % 30 == 0){
                    for(let i = 0; i < 60; i+= 30){
                        //summon some powercells
                    let e = CreateEnemy();
                        e.framecount = 6;
                        e.sprite = "PowerCell";
                        e.damage =  0;
                        e.x = this.x * 1.2;
                        e.y = this.y * 1.2;
                        e.width = GameCanvas.width * 0.023,
                        e.height = GameCanvas.width * 0.023;
                        e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
                        e.color = "red";
                        e.ai =  PowercellAI;
                        e.timer =  0;
                    }
                }
                
                    break;
                case 2:
                    let vectoPlayer = [player.x - this.x, player.y - this.y];
                    norm(vectoPlayer);
                    if(this.pTimer % 20 == 0){
                        //summon some brutes
                        let e = CreateEnemy();
                            e.framecount = 4;
                            e.sprite = "Brute";
                            e.damage =  30;
                            e.x = this.x * 1.2;
                            e.y = this.y * 1.2;
                            e.width = GameCanvas.width * 0.046,
                            e.height = GameCanvas.width * 0.046;
                            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
                            e.color = "grey";
                            e.ai =  BruteAI;
                            e.timer =  0;                    
                    }
                    break;
                case 3:
                    this.velocity = [Math.random() * 2 -1, Math.random() * 2 -1];
                  
                    if(this.pTimer == 1){
                    for(let i = -30; i < 40; i+= 30){
                        let e = CreateEnemy();
                        //summon some fast enemies
                            e.damage =  7;
                            e.framecount = 5;
                            e.sprite = "Fast";  
                            e.x = this.x * 1.2;
                            e.y = this.y * 1.2;
                            e.width = GameCanvas.width * 0.023,
                            e.height = GameCanvas.width * 0.023;
                            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
                            e.color = "black";
                            e.ai =  FastAI;
                            e.timer =  0;
                    }
                }
                    break;
        }
    }

}
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



function TickGame() {
    if(points % 40 == 0){

        var rand = generateRandomNumber(0, 1);
        console.log(rand);
        if (rand == 1){
            //Soul Boss
            points++;
            BossDif -= 5;
            bHP = 3;
            //TODO update
            Enemies = [];
            BossFight = true;
            let  boss = CreateEnemy(); 
            boss.boss = true;
            boss.sprite = "Boss";
            boss.framecount = 7;
            boss.x = GameCanvas.width;
            boss.y = GameCanvas.height / 2;
            boss.width = GameCanvas.width * 0.1;
            boss.height = GameCanvas.width * 0.1;
            boss.velocity = [-1, 0];
            boss.hp = 100;
            boss.timer = 0; 
            boss.damage = 15;
            boss.color = "red";
            boss.ai = SoulBossAI;
        }
        else if (rand == 0){
            //Summoner Boss
            points++;
            BossDif -= 5;
            bHP = 4;
            //TODO update
            Enemies = [];
            BossFight = true;
            let  boss = CreateEnemy(); 
            boss.boss = true;
            boss.sprite = "Summoner";
            boss.framecount = 6;
            boss.x = GameCanvas.width;
            boss.y = GameCanvas.height / 2;
            boss.width = GameCanvas.width * 0.1;
            boss.height = GameCanvas.width * 0.1;
            boss.velocity = [-1, 0];
            boss.hp = 100;
            boss.timer = 0; 
            boss.damage = 10;
            boss.color = "red";
            boss.ai = SummonerBossAI;
        }

    }
    tick++;
    if (tick % 90 == 0) {
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
    //spinny enemy   
    if (Math.random() < 0.004) {
        
        let e = CreateEnemy();
            e.framecount = 3;   
            e.sprite = "Bouncy";
            e.damage =  12;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023;
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "orange";
            e.ai =  BouncyAI;
            e.timer =  0;
    }
    //rouge enemy
    if (Math.random() < 0.0025) {
        let e = CreateEnemy();
            e.framecount = 7;   
            e.sprite = "Rouge";  
            e.damage =  12;
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
            e.damage =  7;
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
    /*
    if (Math.random() < 0.05) {
        let e = CreateEnemy();
        e.framecount = 4;
        e.sprite = "Bubble";
        e.damage =  0;
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = GameCanvas.width * 0.023,
            e.height = GameCanvas.width * 0.023;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "blue";
            e.ai =  BubbleAI;
            e.timer =  0;
    }
    */
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
    if (Math.random() < 0.0004) {
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
function FireProjectile(x, y, velocity, speed, damage, width = 10, height = 10) {
    let e = CreateEnemy();
    speed *= 4;
    e.x = x;
    e.y = y;
    velocity[0] *= speed;
    velocity[1] *= speed;
    e.velocity = velocity;
    e.speed = speed * 5;
    e.damage = damage;
    e.width = width;
    e.height = height;

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
    try{
    e.framecounter++;
    if (e.framecounter > 10) {
        e.framecounter = 0;
        e.frame++;
    }
    if (e.frame > e.framecount) {
        e.frame = 1;
    }
    

    let base_image = undefined;
    if(e.sprite == "nothing"){
        GameContext.fillStyle = e.color;
        GameContext.fillRect(e.x, e.y, e.width, e.height);
        return;
    }
    try {
         base_image = FrameMap.get(e.sprite)[e.frame];
        } catch (error) {
          }
    if(base_image == undefined){
        
    }else{
    GameContext.drawImage(base_image, e.x, e.y, e.width, e.height);
    }
    }catch(e){
      }
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
        e.damage =  4;
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
function BouncyAI() {
    this.rotation = RotationFromVelocity(this.velocity);
    
    this.timer++;//increase the amount ticks we have been waiting
    this.x += this.velocity[0];
    this.y += this.velocity[1];
    if (this.x < 0 || this.x + this.width > GameCanvas.width) {
        this.velocity[0] *= -1;
    }
    if (this.y < 0 || this.y + this.height > GameCanvas.height) {
        this.velocity[1] *= -1;
    }
    if (this.x > 0 || this.x + this.width < GameCanvas.width) {
        this.velocity[0] *= +1;
    }
    if (this.y > 0 || this.y + this.height < GameCanvas.height) {
        this.velocity[1] *= +1;
    }
}
/*
function BubbleAI() {
    this.rotation = RotationFromVelocity(this.velocity);
    
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 240) {
        //if we have waited for 240 or more ticks,
        this.velocity[0] = 0; //get the diffrence
        this.velocity[1] = -3;
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}
*/

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
    player.hp += 10;//heal player 10hp
    if (this.timer > 3) {
        //powerupsfx.play();
        player.currentPowerups.splice(
        player.currentPowerups.indexOf(this) , 1)  
    }

}


function Draw_UI(_, _){
    GameContext.fillStyle = "red";
    GameContext.font = "25px 'Press Start 2P'";
    GameContext.fillText("Score: " + points, GameCanvas.width / 100, 50);
    GameContext.fillRect(0,0 , player.hp * 10,10 );
    GameContext.fillStyle = "blue";
    GameContext.fillRect(0,10    , (player.iframes/ 60) * player.maxHp * 10 ,10 );
}
