//get DPI
let dpi = window.devicePixelRatio;


let player = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    speed: 10,
    color: "blue",
    hp : 100,
    maxHp : 100,
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
let Enemies = [];
downThisTick = {};
window.addEventListener('DOMContentLoaded', function() {

    GameCanvas = document.getElementById("game");
    fix_dpi();
    onkeydown = onkeyup = function(e){
        console.log("key pressed: " + e.keyCode );
        e = e || event; 
        downThisTick[e.keyCode] = e.type == 'keydown';
        console.log(downThisTick);
    }

   

     GameContext = GameCanvas.getContext("2d");
    function Update() {
        TickGame(); 
        UpdatePlayer();
        UpdateEnemies();
        player.color = "blue";
        GameContext.clearRect(0, 0, GameCanvas.width, GameCanvas.height);
        GameContext.fillStyle = "white";
        GameContext.fillRect(0, 0, GameCanvas.width, GameCanvas.height);
        DrawEnemies();
        DrawPlayer();
       // ResetKeys();
    }
    setInterval(Update, 1000 / 120);
});
function UpdatePlayer() {
    if(player.hp < 0){
        alert("You died");
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

}
function UpdateEnemies() {  
    for (let i = 0; i < Enemies.length; i++) {
        Enemies[i].x += Enemies[i].velocity[0];
        Enemies[i].y += Enemies[i].velocity[1];
        Enemies[i].ai();
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
                player.hp -= 10;
                player.color = "orange";
                Enemies.splice(i, 1);
            }
        }
    }
}

function DrawEnemies() {
    for (let i = 0; i < Enemies.length; i++) {
        GameContext.fillStyle = Enemies[i].color;
        GameContext.fillRect(Enemies[i].x, Enemies[i].y, Enemies[i].width, Enemies[i].height);
    }
}

function DrawPlayer() {
    GameContext.fillStyle = "red";
    let width = player.hp / player.maxHp * (GameCanvas.width/10);
    GameContext.fillRect(0, GameCanvas.height - 10, width, 10);
    GameContext.fillStyle = player.color;
    GameContext.fillRect(player.x, player.y, player.width, player.height);
}
function ResetKeys() {
    downThisTick = [];
}

function TickGame() {
    if (Math.random() < 0.1) {
        Enemies.push({
            hp: 10,
            x: 0,
            y: Math.random() * GameCanvas.height,
            width: 10,
            height: 10,
            velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1],
            color: "green",
            ai: BasicAI,
            timer: 0
        });
    }
}
function norm(v) {
    let len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    v[0] /= len;
    v[1] /= len;
}

///follow player every 2 seconds
function BasicAI() {
    if (this.timer > 120) {
        this.velocity[0] = (player.x - this.x);
        this.velocity[1] = (player.y - this.y);
        norm(this.velocity);
        this.timer = 0;     
    }
    this.timer++;
}