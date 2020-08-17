function startGame() {
    let score = 0,
        isRunning = true,
        w, h;

    const startButton = document.getElementById('startButton'),
        gameObjectHeight = 102,
        xPositions = [0, 60, 120, 180],
        container = document.getElementById('gameContainer'),
        CANVAS_ID = "gameCanvas",
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d"),
        maxCanvasWidth = 240,
        maxCanvasHeight = 575,
        gs = 20,
        resizeCanvas = () => {
            canvas.width = Math.min(window.innerWidth, maxCanvasWidth);
            canvas.height = Math.min(window.innerHeight, maxCanvasHeight);
            w = Math.floor(window.innerWidth / 20);
            h = Math.floor(window.innerHeight / 20);
        };

    if (container.childNodes[0].id == CANVAS_ID) {
        container.removeChild(container.childNodes[0]);
    }

    // hide the startButton
    startButton.style.display = 'none';
    resizeCanvas();
    canvas.id = CANVAS_ID;
    container.insertBefore(canvas, container.childNodes[0]);
    document.querySelector('.controls').style.display = 'flex';

    window.onresize = () => {
        resizeCanvas();
    }

    function drawScore(ctx) {
        ctx.fillStyle = '#000';
        ctx.font = "16px Arial";
        ctx.fillText(`Score: ${score}`, 15, 15);
    }

    class Enemy {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speed = 1;
        }

        update(canvas) {
            if (this.y + this.speed > canvas.height) {
                const xPositionIndex = Math.floor((Math.random() * 4) + 1) - 1;
                this.x = xPositions[xPositionIndex];
                this.y = -gameObjectHeight;
                this.speed += 0.15;
                score += 0.5;
            }
            else {
                this.y += this.speed;
            }
        }

        render(ctx) {
            let x = this.x;
            let y = this.y;

            drawGameObjectPart(x, y);

            for (let i = 0; i < 2; i++) {
                y += gs - 2 + 3;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 2; i++) {
                x += gs - 2 + 3;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 2; i++) {
                y += gs - 2 + 3;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 3; i++) {
                y += -gs + 2 - 3;
            }
            drawGameObjectPart(x, y);

            y += -gs + 2 - 3;
            drawGameObjectPart(x, y);
        }
    }

    function drawGameObjectPart(x, y) {
        ctx.fillStyle = '#000';
        const rectOut = new Path2D();
        rectOut.rect(x, y, gs - 2, gs - 2);
        ctx.stroke(rectOut);

        const rectIn = new Path2D();
        rectIn.rect(x + 3, y + 3, 12, 12);
        ctx.fill(rectIn);
    }

    class Player {
        constructor() {
            this.x = xPositions[1];
            this.color = '#FFF';
        }

        update(canvas) {
            this.y = canvas.height - gameObjectHeight;
        }
        render() {
            let x = this.x;
            let y = this.y;

            drawGameObjectPart(x, y);

            for (let i = 0; i < 2; i++) {
                x += 3 + gs - 2;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 4; i++) {
                y += 3 + gs - 2;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 2; i++) {
                x -= 3 + gs - 2;
                drawGameObjectPart(x, y);
            }

            for (let i = 0; i < 3; i++) {
                y -= 3 + gs - 2;
                drawGameObjectPart(x, y);
            }
        }
    }

    const player = new Player();
    const enemy1 = new Enemy(xPositions[0], 0);
    const enemy2 = new Enemy(xPositions[3], 0);
    const sprites = [
        enemy1,
        enemy2,
        player,
    ];

    function gameOver() {
        isRunning = false;
        startButton.style.display = 'block';
        document.querySelector('.controls').style.display = 'none';
        clearInterval(interval);
    }

    function gameLoop() {
        if (!isRunning) {
            return;
        }
        ctx.fillStyle = "#a4b6ad";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
                ctx.fillStyle = "#9ca9a3";
                ctx.fillRect(x * gs, y * gs, gs - 2, gs - 2);
                ctx.fillStyle = "#a4b6ad";
                ctx.fillRect(x * gs + 2, y * gs + 2, gs - 6, gs - 6);
                ctx.fillStyle = "#9ca9a3";
                ctx.fillRect(x * gs + 4, y * gs + 4, gs - 10, gs - 10);
            }
        }

        sprites.forEach(sprite => {
            sprite.update(canvas);
            sprite.render(ctx);
        });

        if (enemy1.y + gameObjectHeight > canvas.height - gameObjectHeight &&
            (enemy1.x == player.x || enemy2.x == player.x)
        ) {
            gameOver();
        }
        drawScore(ctx);
    }

    document.addEventListener("keydown", keyDownHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            moveToRight();
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            moveToLeft();
        }
    }

    function moveToRight() {
        const currentIndex = xPositions.indexOf(player.x);
        if (currentIndex < 3) {
            player.x = xPositions[currentIndex + 1];
        }
    }
    document.getElementById('moveRight').addEventListener('click', moveToRight);

    function moveToLeft() {
        const currentIndex = xPositions.indexOf(player.x);
        if (currentIndex > 0) {
            player.x = xPositions[currentIndex - 1];
        }
    }

    document.getElementById('moveLeft').addEventListener('click', moveToLeft);
    const interval = setInterval(gameLoop, 10);
}

window.onload = () => {
    document.getElementById('startButton').addEventListener('click', startGame);
};