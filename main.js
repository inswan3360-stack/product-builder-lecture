const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const msgBox = document.getElementById('message-box');
const moneyDisplay = document.getElementById('money-display');

// Game State
const pet = {
    x: 64,
    y: 80,
    hunger: 50,
    happiness: 50,
    energy: 100,
    money: 100,
    age: 0,
    isAlive: true,
    status: 'idle', // idle, eating, playing, sleeping, walking
    frame: 0,
    lastTick: 0,
    lastAgeTick: 0,
    inventory: {
        premiumFood: 0
    }
};

// Audio context for retro beeps
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Colors (8-bit style)
const COLORS = {
    BLACK: '#000000',
    WHITE: '#ffffff',
    BODY: '#4e5844',
    EYE: '#2e3b23',
    ACCENT: '#8b956d'
};

// Sprites (16x16)
const sprites = {
    idle: [
        [
            "                ",
            "      XXXX      ",
            "     X    X     ",
            "    X      X    ",
            "   X  O  O  X   ",
            "   X        X   ",
            "   X   --   X   ",
            "    X      X    ",
            "     XXXXXX     ",
            "                "
        ],
        [
            "                ",
            "      XXXX      ",
            "     X    X     ",
            "    X      X    ",
            "   X  -  -  X   ",
            "   X        X   ",
            "   X   ..   X   ",
            "    X      X    ",
            "     XXXXXX     ",
            "                "
        ]
    ],
    eating: [
        [
            "      XXXX      ",
            "     X    X     ",
            "    X      X    ",
            "   X  O  O  X   ",
            "   X   VV   X   ",
            "    X  MM  X    ",
            "     XXXXXX     "
        ]
    ],
    sleeping: [
        [
            "      XXXX      ",
            "     Xzz  X     ",
            "    X z    X    ",
            "   X  -  -  X   ",
            "   X        X   ",
            "    X      X    ",
            "     XXXXXX     "
        ]
    ],
    dead: [
        [
            "                ",
            "      XXXX      ",
            "     X    X     ",
            "    X X  X X    ",
            "   X   XX   X   ",
            "   X   XX   X   ",
            "    X X  X X    ",
            "     XXXXXX     ",
            "      RIP       "
        ]
    ]
};

function drawSprite(spriteArray, x, y, scale = 4) {
    const frame = spriteArray[pet.frame % spriteArray.length];
    frame.forEach((row, rowIndex) => {
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const char = row[colIndex];
            if (char === ' ') continue;
            
            ctx.fillStyle = COLORS.BLACK;
            if (char === 'X') ctx.fillStyle = COLORS.BODY;
            if (char === 'O') ctx.fillStyle = COLORS.EYE;
            if (char === '-') ctx.fillStyle = COLORS.EYE;
            if (char === '.') ctx.fillStyle = COLORS.EYE;
            if (char === 'V') ctx.fillStyle = '#ff0000';
            if (char === 'M') ctx.fillStyle = '#aa0000';
            if (char === 'z') ctx.fillStyle = COLORS.WHITE;

            ctx.fillRect(x + colIndex * scale, y + rowIndex * scale, scale, scale);
        }
    });
}

function updateStats() {
    document.getElementById('hunger-bar').style.width = pet.hunger + '%';
    document.getElementById('happy-bar').style.width = pet.happiness + '%';
    document.getElementById('energy-bar').style.width = pet.energy + '%';
    moneyDisplay.innerText = `🪙 ${pet.money} | AGE: ${pet.age}`;

    // Bar colors
    document.getElementById('hunger-bar').style.backgroundColor = pet.hunger > 70 ? '#ff4444' : '#c4d4a4';
    document.getElementById('happy-bar').style.backgroundColor = pet.happiness < 30 ? '#ff4444' : '#c4d4a4';
    document.getElementById('energy-bar').style.backgroundColor = pet.energy < 20 ? '#ff4444' : '#c4d4a4';
}

function showMessage(text) {
    msgBox.innerText = text;
}

// Actions
function feed() {
    if (!pet.isAlive || pet.status !== 'idle') return;
    if (pet.hunger <= 10) {
        showMessage("배가 불러요!");
        return;
    }
    playSound(440, 0.1);
    pet.status = 'eating';
    pet.hunger = Math.max(0, pet.hunger - 20);
    pet.happiness = Math.min(100, pet.happiness + 5);
    showMessage("얌냠냠! 맛있다!");
    setTimeout(() => pet.status = 'idle', 2000);
}

function playHome() {
    if (!pet.isAlive || pet.status !== 'idle') return;
    if (pet.energy < 20) {
        showMessage("너무 졸려요...");
        return;
    }
    playSound(660, 0.1);
    pet.status = 'playing';
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 15);
    showMessage("집에서 노는 건 즐거워!");
    setTimeout(() => pet.status = 'idle', 2000);
}

function goOut() {
    if (!pet.isAlive || pet.status !== 'idle') return;
    if (pet.energy < 40) {
        showMessage("나가기엔 기운이 없어요.");
        return;
    }
    playSound(880, 0.1);
    pet.status = 'walking';
    pet.energy = Math.max(0, pet.energy - 30);
    pet.happiness = Math.min(100, pet.happiness + 40);
    const foundMoney = Math.floor(Math.random() * 50) + 10;
    pet.money += foundMoney;
    showMessage(`밖은 정말 좋아! 🪙 ${foundMoney}원을 찾았어!`);
    setTimeout(() => pet.status = 'idle', 3000);
}

function sleep() {
    if (!pet.isAlive || pet.status !== 'idle') return;
    pet.status = 'sleeping';
    showMessage("쿨쿨... 잠을 자요.");
    const sleepInterval = setInterval(() => {
        if (!pet.isAlive) {
            clearInterval(sleepInterval);
            return;
        }
        pet.energy = Math.min(100, pet.energy + 10);
        if (pet.energy >= 100) {
            clearInterval(sleepInterval);
            pet.status = 'idle';
            showMessage("잘 잤다! 개운해!");
        }
        updateStats();
    }, 1000);
}

// Shop
const shopModal = document.getElementById('shop-modal');
document.getElementById('btn-shop').onclick = () => shopModal.style.display = 'flex';
document.getElementById('close-shop').onclick = () => shopModal.style.display = 'none';

document.getElementById('buy-food').onclick = () => {
    if (!pet.isAlive) return;
    if (pet.money >= 50) {
        playSound(523, 0.2);
        pet.money -= 50;
        pet.hunger = Math.max(0, pet.hunger - 50);
        pet.happiness = Math.min(100, pet.happiness + 20);
        showMessage("고급 사료를 먹였어요! 기분이 최고!");
        updateStats();
    } else {
        showMessage("돈이 부족해요...");
    }
};

// Event Listeners
document.getElementById('btn-feed').onclick = feed;
document.getElementById('btn-play').onclick = playHome;
document.getElementById('btn-out').onclick = goOut;
document.getElementById('btn-sleep').onclick = sleep;

// Game Loop
function gameLoop(timestamp) {
    if (!pet.isAlive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6b7a44';
        ctx.fillRect(0, 100, 160, 44);
        drawSprite(sprites.dead, 64, 80, 2);
        updateStats();
        return;
    }

    // Logic Tick (every 3 seconds)
    if (timestamp - pet.lastTick > 3000) {
        if (pet.status !== 'sleeping') {
            pet.hunger = Math.min(100, pet.hunger + 3);
            pet.happiness = Math.max(0, pet.happiness - 2);
            pet.energy = Math.max(0, pet.energy - 1);
        }
        pet.lastTick = timestamp;
        pet.frame++;

        // Death condition
        if (pet.hunger >= 100 || pet.happiness <= 0) {
            pet.isAlive = false;
            showMessage("나의 애완동물이 떠나버렸어요... (굶주림 혹은 슬픔)");
            playSound(110, 0.5);
        }
    }

    // Age Tick (every 60 seconds)
    if (timestamp - pet.lastAgeTick > 60000) {
        pet.age++;
        pet.lastAgeTick = timestamp;
        showMessage(`축하해요! 한 살 더 먹었어요! (현재 ${pet.age}살)`);
        playSound(1000, 0.2);
    }

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background (Floor)
    ctx.fillStyle = '#6b7a44';
    ctx.fillRect(0, 100, 160, 44);

    // Pet
    let currentSprite = sprites.idle;
    if (pet.status === 'eating') currentSprite = sprites.eating;
    if (pet.status === 'sleeping') currentSprite = sprites.sleeping;
    if (pet.status === 'walking') {
        pet.x = 64 + Math.sin(timestamp / 200) * 20;
    } else {
        pet.x = 64;
    }

    drawSprite(currentSprite, pet.x, pet.y, 2);

    updateStats();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

