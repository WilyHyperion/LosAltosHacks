    
//get DPI
let dpi = window.devicePixelRatio;
///enemy setup
let Enemies = [];
let enemycap = 200;
let nextRep = 0;
let points = 0;
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



let player = {
    iframes: 0,
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    speed: 4,
    color: "blue",
    hp : 100,
    maxHp : 100,
    currentPowerups:[]
};
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

    fix_dpi();
    onkeydown = onkeyup = function(e){
        e = e || event; 
        downThisTick[e.keyCode] = e.type == 'keydown';
    }
     GameContext = GameCanvas.getContext("2d");
     GameContext.webkitImageSmoothingEnabled = false;
     GameContext.mozImageSmoothingEnabled = false;
     GameContext.imageSmoothingEnabled = false;
    function Update() {
        TickGame(); 
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
       // ResetKeys();
    }
    setInterval(Update, 1000 / 120);
});
function DrawPowerUps(){
    for(let v of Powerups){
    }
}

function DrawPowerUps(){
    for(let v of Powerups){
        DrawPowerupImage(v);
    }
}
function UpdatePlayer() {
    if(player.hp < 0){
        alert("You died");
        window.location.reload();
        
    }
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
    SnapPlayerInside();
    UpdatePlayerPowerups();

}
function UpdatePlayerPowerups(){
    for(let i = 0; i < player.currentPowerups.length; i++){
        player.currentPowerups[i].pickup();
    }
}
function SnapPlayerInside() {
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
       
    }
    CheckForCollisions();
}
function CheckForCollisions() {
    for (let i = 0; i < Enemies.length; i++) {
        if (Enemies[i].x + Enemies[i].width > player.x && Enemies[i].x < player.x + player.width) {
            if (Enemies[i].y + Enemies[i].height > player.y && Enemies[i].y < player.y + player.height) {
                if (player.iframes <= 0) {
                    player.hp -= Enemies[i].damage;
                    player.iframes = 60 * 3; 
                }
                else { player.iframes--; }
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
let tick = 0;
function TickGame() {
    tick++;
    if (tick % 60 == 0) {
        points++;
    }
    //basic enemy   
    if (Math.random() < 0.02) {
        let e = CreateEnemy();
            e.framecount = 7;   
            e.sprite = "Basic";  
            e.damage =  10;
            e.y = Math.random() * GameCanvas.height;
            e.width = 30,
            e.height =  30;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "green";
            e.ai =  BasicAI;
            e.timer =  0;
    }
    //rouge enemy
    if (Math.random() < 0.02) {
        let e = CreateEnemy();
            e.framecount = 7;   
            e.sprite = "Rouge";  
            e.damage =  1;
            e.y = Math.random() * GameCanvas.height;
            e.width =30,
            e.height =  30;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "green";
            e.ai =  BasicAI;
            e.timer =  0;
    }
    //fast enemy   
    if (Math.random() < 0.01) {
            let e = CreateEnemy();
            e.damage =  10;
            e.FrameCount = 5;
            e.sprite = "Fast";  
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = 30,
            e.height =  30;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "black";
            e.ai =  FastAI;
            e.timer =  0;
        
    }
    //brute enemy   
    if (Math.random() < 0.01 && player.hp > 20) {
        let e = CreateEnemy();
            e.framecount = 4;
            e.sprite = "Brute";

            e.damage =  30;
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = 60,
            e.height =  60;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "grey";
            e.ai =  BruteAI;
            e.timer =  0;
    }
    //powercell enemy   
    if (Math.random() < 0.05 && player.hp > 40) {
        
        let e = CreateEnemy();
        e.framecount = 6;
        e.sprite = "Powercell";
        e.damage =  0;
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = 10,
            e.height =  10;
            e.velocity = [Math.random() * 2 - 1, Math.random() * 2 - 1],
            e.color = "red";
            e.ai =  PowercellAI;
            e.timer =  0;
    }
    //dispersal powerup
    if (Math.random() < 0.001) {
        let e = CreatePowerup();
            e.frame = 1;
            e.framecount = 1;
            e.sprite = "Dispersal";
            e.x = Math.random() * GameCanvas.width;
            e.y = Math.random() * GameCanvas.height;
            e.width = 30,
            e.height =  30;
            e.pickup =  DispersalPU;

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
    let base_image = new Image();
    base_image.src = 'enemy/' + e.sprite + e.frame + '.png';
    GameContext.drawImage(base_image, e.x, e.y, e.width, e.height);
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
            e.width = 30,
            e.height =  30;
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
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 240) {
        //if we have waited for 240 or more ticks,
        this.velocity[0] = (player.x - this.x); //get the diffrence
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}
///confused from dispersal
function ConfusedAI() {
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 30) {
        //if we have waited for 240 or more ticks,
        this.velocity[0] = (Math.random() * 2 - 1 - this.x); //get the diffrence
        this.velocity[1] = (Math.random() * 2 - 1 - this.y);
        norm(this.velocity);//normalize the vector, so it shows the direction but not the length
        this.timer = 0;  //reset the timer
    }
}



function DispersalPU(){
    this.timer++;//increase the amount ticks we have been waiting
    if (this.timer > 1000) {
       Powerups.splice(
        Powerups.indexOf(this) , 1)
    }
}