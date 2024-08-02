document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    const canvasSize = canvas.width;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let direction = 'RIGHT';
    let food = generateFood();
    let game;
    let speed = 150;

    document.getElementById('highScore').innerText = highScore;
    document.addEventListener('keydown', setDirection);

    function setDirection(event) {
        if (event.keyCode === 37 && direction !== 'RIGHT') {
            direction = 'LEFT';
        } else if (event.keyCode === 38 && direction !== 'DOWN') {
            direction = 'UP';
        } else if (event.keyCode === 39 && direction !== 'LEFT') {
            direction = 'RIGHT';
        } else if (event.keyCode === 40 && direction !== 'UP') {
            direction = 'DOWN';
        }
    }

    window.move = function(newDirection) {
        if (newDirection === 'LEFT' && direction !== 'RIGHT') {
            direction = 'LEFT';
        } else if (newDirection === 'UP' && direction !== 'DOWN') {
            direction = 'UP';
        } else if (newDirection === 'RIGHT' && direction !== 'LEFT') {
            direction = 'RIGHT';
        } else if (newDirection === 'DOWN' && direction !== 'UP') {
            direction = 'DOWN';
        }
    };

    function collision(newHead) {
        return snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
    }

    function draw() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
            ctx.fillRect(segment.x, segment.y, box, box);
            ctx.strokeStyle = 'darkgreen';
            ctx.strokeRect(segment.x, segment.y, box, box);
        });

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        // Calculate new head position
        let newHead = { x: snake[0].x, y: snake[0].y };
        if (direction === 'LEFT') newHead.x -= box;
        if (direction === 'UP') newHead.y -= box;
        if (direction === 'RIGHT') newHead.x += box;
        if (direction === 'DOWN') newHead.y += box;

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            document.getElementById('score').innerText = score;
            food = generateFood();
            if (score % 5 === 0 && speed > 50) {
                speed -= 10;
                clearInterval(game);
                game = setInterval(draw, speed);
            }
        } else {
            snake.pop();
        }

        // Check collisions
        if (
            newHead.x < 0 || newHead.x >= canvasSize ||
            newHead.y < 0 || newHead.y >= canvasSize ||
            collision(newHead)
        ) {
            clearInterval(game);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                document.getElementById('highScore').innerText = highScore;
            }
            document.getElementById('gameOver').classList.add('visible');
            document.getElementById('restartButtonCenter').style.display = 'block';
            document.getElementById('startButton').style.display = 'none';
            return;
        }

        snake.unshift(newHead);
    }

    function generateFood() {
        let foodX, foodY;
        do {
            foodX = Math.floor(Math.random() * (canvasSize / box)) * box;
            foodY = Math.floor(Math.random() * (canvasSize / box)) * box;
        } while (collision({ x: foodX, y: foodY }));
        return { x: foodX, y: foodY };
    }

    window.startGame = function() {
        score = 0;
        direction = 'RIGHT';
        snake = [{ x: 9 * box, y: 10 * box }];
        food = generateFood();
        speed = 150;
        document.getElementById('score').innerText = score;
        game = setInterval(draw, speed);
        document.getElementById('restartButtonCenter').style.display = 'none';
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('gameOver').classList.remove('visible');
    };

    window.restartGame = function() {
        clearInterval(game);
        startGame();
    };
});
