"use strict"

const canvas = document.getElementById("canvasId");
const canvasContext = canvas.getContext("2d");
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnZ = document.getElementById("btnZ");
const btnX = document.getElementById("btnX");
const btnC = document.getElementById("btnC");

let scor = 0;
let vieti = 3;
let jocTerminat = false;
let nextLifeScore = 1000;

const sunetTragere = new Audio("media/fire.wav");

if(window.innerWidth > 800){
    canvas.width = 800;
} else{
    canvas.width = window.innerWidth - 20;
}

if(window.innerHeight > 600){
    canvas.height = 600;
} else{
    canvas.height = window.innerHeight - 20;
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    z: false,
    c: false,
    x: false
};

class NavaSpatiala{
    constructor(){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 15;
        this.angle = -Math.PI / 2;
        this.speed = 4;
        this.rotationSpeed = 0.1;
        this.color = "white";
        this.invulnerable = false;
    }

    draw(){
        canvasContext.save();
        canvasContext.translate(this.x, this.y);
        canvasContext.rotate(this.angle);

        canvasContext.beginPath();
        canvasContext.moveTo(20,0);
        canvasContext.lineTo(-15, 10);
        canvasContext.lineTo(-15,-10);
        canvasContext.closePath();

        if(this.invulnerable){
            canvasContext.strokeStyle = "rgba(255,255,255,0.5)";
        }else{
            canvasContext.strokeStyle = this.color;
        }
        canvasContext.lineWidth = 2;
        canvasContext.stroke();

        canvasContext.fillStyle = "#FF0000";
        canvasContext.fillRect(18,-2,4,4);

        canvasContext.restore();
    }

    update(){

        if(keys.ArrowUp){
            this.y -= this.speed;
        }

        if(keys.ArrowDown){
            this.y += this.speed;
        }

        if(keys.ArrowLeft){
            this.x -= this.speed;
        }

        if(keys.ArrowRight){
            this.x += this.speed;
        }

        if(keys.z){
            this.angle -= this.rotationSpeed;
        }
        if(keys.c){
            this.angle += this.rotationSpeed;
        }

        if(this.x < this.radius){
            this.x = this.radius;
        }
        if(this.x > canvas.width - this.radius){
            this.x = canvas.width - this.radius;
        }

        if(this.y < this.radius){
            this.y = this.radius;
        }

        if(this.y > canvas.height - this.radius){
            this.y = canvas.height - this.radius;
        }
    }
    
    reset(){
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2;
        this.invulnerable = true;
        setTimeout(()=>{
            this.invulnerable = false;
        },2000);
    }
}


class Gloante {
    constructor(x, y, angle){
        this.x = x;
        this.y = y;
        this.speed = 7;
        
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
        
        this.radius = 2;
        this.glontDelete = false;
    }

    draw(){
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = "#eb9e06ff"; 
        canvasContext.fill(); 
    }

    
    update(){
        this.x += this.dx;
        this.y += this.dy;

        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height){
            this.glontDelete = true;
        }
    }
}


class Asteroid {
    constructor() {
        this.viata = Math.floor(Math.random() * 4) + 1;
        this.updateProp(); 

        if (Math.random() < 0.5) {
            
            this.y = Math.random() * canvas.height; 

            if (Math.random() < 0.5) {
                
                this.x = 0 + this.radius; 
                
                this.dx = Math.random() * 1 + 0.5; 
            } else {
                
                this.x = canvas.width - this.radius;
                this.dx = -(Math.random() * 1 + 0.5); 
            }
            
            this.dy = (Math.random() - 0.5) * 2; 

        } else {
            
            this.x = Math.random() * canvas.width; 

            if (Math.random() < 0.5) {
                
                this.y = 0 + this.radius;
                this.dy = Math.random() * 1 + 0.5; 
            } else {
                
                this.y = canvas.height - this.radius;
                this.dy = -(Math.random() * 1 + 0.5); 
            }
            this.dx = (Math.random() - 0.5) * 2; 
        }
    }

    updateProp() {
        switch (this.viata) {
            case 4: this.radius = 50; this.color = '#8B0000'; break;
            case 3: this.radius = 40; this.color = '#FF4500'; break;
            case 2: this.radius = 30; this.color = '#FFA500'; break;
            case 1: this.radius = 20; this.color = '#FFFF00'; break;
            default: this.radius = 10; this.color = 'grey';
        }
    }

    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.strokeStyle = "#FFFFFF";
        canvasContext.stroke();

        canvasContext.fillStyle = "#000000";
        canvasContext.font = "bold 16px Arial";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "middle";
        canvasContext.fillText(this.viata, this.x, this.y);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;


        if (this.x - this.radius < 0) {
            this.dx = Math.abs(this.dx); 
        } 
        if (this.x + this.radius > canvas.width) {
            this.dx = -Math.abs(this.dx);
        }

        if (this.y - this.radius < 0) {
            this.dy = Math.abs(this.dy); 
        } 
        if (this.y + this.radius > canvas.height) {
            this.dy = -Math.abs(this.dy); 
        }
    }
}


const nava = new NavaSpatiala();
let gloante = [];
let asteroizi = [];

function spawnareAsteroizi(count){
    asteroizi = [];
    for(let i = 0;i<count;i++){
        asteroizi.push(new Asteroid());
    }
}

spawnareAsteroizi(5);

function getDistance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2)+Math.pow(y2 - y1,2));
}

function coliziuneAsteroizi(a1,a2){
    const xDist = a2.x - a1.x;
    const yDist = a2.y - a1.y;

    if ((a1.dx - a2.dx) * xDist + (a1.dy - a2.dy) * yDist >= 0) {
        
        let tempDx = a1.dx;
        let tempDy = a1.dy;
        a1.dx = a2.dx;
        a1.dy = a2.dy;
        a2.dx = tempDx;
        a2.dy = tempDy;
    }
}


function fireMissile() {
    if (gloante.length < 3) {
        
        let tipX = nava.x + Math.cos(nava.angle) * 20;
        let tipY = nava.y + Math.sin(nava.angle) * 20;
        gloante.push(new Gloante(tipX, tipY, nava.angle));

        sunetTragere.currentTime = 0; 
        
        sunetTragere.play().catch(error => {
            console.log("Sunetul nu a putut fi redat:", error);
        });
    }
}

function gameLoop(){
    if(jocTerminat) return;
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    
    nava.update();
    nava.draw();


    gloante.forEach((b, index) => {
        b.update();
        b.draw();
        if (b.glontDelete) gloante.splice(index, 1);
    });


    for (let i = 0; i < asteroizi.length; i++) {
        let a = asteroizi[i];
        a.update();
        a.draw();

        
        if (!nava.invulnerable && getDistance(nava.x, nava.y, a.x, a.y) < nava.radius + a.radius) {
            vieti--;
            updateUI();
            if (vieti <= 0) {
                endGame();
            } else {
                nava.reset();
            }
        }


        for (let j = gloante.length - 1; j >= 0; j--) {
            let b = gloante[j];
            if (getDistance(b.x, b.y, a.x, a.y) < a.radius) {
                gloante.splice(j, 1); 
                a.viata--;
                
                if (a.viata <= 0) {
                    scor += 100; 
                    asteroizi.splice(i, 1);
                    i--; 
                    
                    
                    if (asteroizi.length < 5) {
                        setTimeout(() => asteroizi.push(new Asteroid()), 1000);
                    }
                } else {
                    a.updateProp(); 
                }
                updateUI();
                break; 
            }
        }
    }

    
    for (let i = 0; i < asteroizi.length; i++) {
        for (let j = i + 1; j < asteroizi.length; j++) {
            let d = getDistance(asteroizi[i].x, asteroizi[i].y, asteroizi[j].x, asteroizi[j].y);
            if (d < asteroizi[i].radius + asteroizi[j].radius) {
                coliziuneAsteroizi(asteroizi[i], asteroizi[j]);
            }
        }
    }

    
    if (scor >= nextLifeScore) {
        vieti++;
        nextLifeScore += 1000;
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}


function updateUI() {
    document.getElementById('scor').innerText = scor;
    document.getElementById('vieti').innerText = vieti;
}

function endGame() {
    jocTerminat = true;
    document.getElementById("ecranGameOver").style.display = 'block';
    document.getElementById("scorFinal").innerText = scor;
}

const btnSave = document.getElementById("btnSalveaza");
if (btnSave) {
    btnSave.addEventListener("click", function() {
        const name = document.getElementById('numeJucator').value || "Anonim";
        const highScores = JSON.parse(localStorage.getItem('asteroidsScores')) || [];
        
        
        highScores.push({ name: name, score: scor });
        
        
        highScores.sort((a, b) => b.score - a.score);
        
        
        highScores.splice(5);
        

        localStorage.setItem('asteroidsScores', JSON.stringify(highScores));
        

        location.reload(); 
    });
}

function loadHighScores() {
    const highScores = JSON.parse(localStorage.getItem('asteroidsScores')) || [];
    const list = document.getElementById("lista-scoruri");
    if (list) {
        list.innerHTML = highScores
            .map(s => `<li>${s.name}: ${s.score}</li>`)
            .join('');
    }
}


window.addEventListener("keydown", e => {

    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    
    
    if (e.key === 'x') fireMissile();
});

window.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});


btnUp.addEventListener("touchstart", e =>
     { keys.ArrowUp = true;
      });

btnUp.addEventListener("touchend", (e) => { 
    keys.ArrowUp = false; 
});

btnDown.addEventListener("touchstart", e=>{
    keys.ArrowDown = true;
});

btnDown.addEventListener("touchend",e=>{
    keys.ArrowDown = false;
})

btnLeft.addEventListener("touchstart", e=>{
    keys.ArrowLeft = true;
});

btnLeft.addEventListener("touchend",e=>{
    keys.ArrowLeft = false;
})

btnRight.addEventListener("touchstart", e=>{
    keys.ArrowRight = true;
});

btnRight.addEventListener("touchend",e=>{
    keys.ArrowRight = false;
})
if (btnX) {
    btnX.addEventListener("touchstart", (e) => {
        e.preventDefault(); 
        fireMissile();     
    }, { passive: false });
}

btnC.addEventListener("touchstart", e=>{
    keys.c = true;
});

btnC.addEventListener("touchend",e=>{
    keys.c = false;
});

btnZ.addEventListener("touchstart", e=>{
    keys.z = true;
});

btnZ.addEventListener("touchend",e=>{
    keys.z = false;
});

loadHighScores();
gameLoop();


