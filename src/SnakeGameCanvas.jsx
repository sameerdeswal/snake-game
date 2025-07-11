import React, { useRef, useEffect, useState } from "react";

const CANVAS_SIZE = 400;
const SCALE = 20;
const SPEED = 100; // ms
const DIRECTIONS = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
};

export default function SnakeGameCanvas() {
    const canvasRef = useRef(null);
    const [direction, setDirection] = useState([1, 0]);
    const snakeRef = useRef([]);
    const foodRef = useRef([0, 0]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [running, setRunning] = useState(false);
    const touchStartRef = useRef(null);

    function generateFood(snake = []) {
        let pos;
        do {
            pos = [
                Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
                Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
            ];
        } while (snake.some(([x, y]) => x === pos[0] && y === pos[1]));
        return pos;
    }

    const startGame = () => {
        const initialSnake = [[5, 5]];
        snakeRef.current = initialSnake;
        foodRef.current = generateFood(initialSnake);
        setScore(0);
        setDirection([1, 0]);
        setGameOver(false);
        setRunning(true);
    };

    useEffect(() => {
        if (canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext("2d");

        let interval = null;
        if (running) {
            interval = setInterval(() => update(ctx), SPEED);
        }

        const handleKeyDown = (e) => {
            const newDir = DIRECTIONS[e.key];
            if (newDir) {
                const [dx, dy] = direction;
                if (dx + newDir[0] !== 0 || dy + newDir[1] !== 0) {
                    setDirection(newDir);
                }
            }
        };

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        };

        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            const dx = touch.clientX - touchStartRef.current.x;
            const dy = touch.clientY - touchStartRef.current.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                setDirection(dx > 0 ? [1, 0] : [-1, 0]);
            } else {
                setDirection(dy > 0 ? [0, 1] : [0, -1]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        canvasRef.current.addEventListener("touchstart", handleTouchStart);
        canvasRef.current.addEventListener("touchend", handleTouchEnd);

        return () => {
            clearInterval(interval);
            window.removeEventListener("keydown", handleKeyDown);
            if (canvasRef.current) {
                canvasRef.current.removeEventListener("touchstart", handleTouchStart);
                canvasRef.current.removeEventListener("touchend", handleTouchEnd);
            }
        };
    }, [direction, running]);

    function update(ctx) {
        const newSnake = [...snakeRef.current];
        const head = [...newSnake[0]];
        head[0] += direction[0];
        head[1] += direction[1];

        if (
            head[0] < 0 ||
            head[1] < 0 ||
            head[0] >= CANVAS_SIZE / SCALE ||
            head[1] >= CANVAS_SIZE / SCALE ||
            newSnake.some(([x, y]) => x === head[0] && y === head[1])
        ) {
            setGameOver(true);
            setRunning(false);
            return;
        }

        newSnake.unshift(head);

        if (head[0] === foodRef.current[0] && head[1] === foodRef.current[1]) {
            foodRef.current = generateFood(newSnake);
            setScore((prev) => prev + 1);
        } else {
            newSnake.pop();
        }

        snakeRef.current = newSnake;
        draw(ctx, newSnake, foodRef.current);
    }


    // function draw(ctx, snake, food) {
    //     ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    //     ctx.fillStyle = "#ffc933";
    //     ctx.fillRect(food[0] * SCALE, food[1] * SCALE, SCALE, SCALE);

    //     ctx.fillStyle = "#2e2e2e";
    //     snake.forEach(([x, y]) => {
    //         ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    //     });
    // }

    function draw(ctx, snake, food) {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food[0] * SCALE, food[1] * SCALE, SCALE, SCALE);

        // Draw snake with gradient: red (head) to black (tail)
        const length = snake.length;
        snake.forEach(([x, y], index) => {
            const t = index / (length - 1); // 0 (head) to 1 (tail)
            const r = Math.round(255 * (1 - t)); // red decreases
            const g = 0;
            const b = 0;

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        });
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <div className="flex flex-col items-center justify-center w-full gap-2">
                <p className="text-slate-100"><strong>Score:</strong> {score}</p>


                <button onClick={startGame} className={`${running ? "invisible":""} bg-green-800 text-slate-100 hover:bg-green-800 px-2 py-1 rounded  transition-all duration-300 ease-in-out`}>
                    {gameOver ? "Restart Game" : "Start Game"}
                </button>

            </div>
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border bg-zinc-800 border-zinc-700"
            />
            {gameOver && <p className="text-red-700">Game Over!</p>}
        </div>
    );
}
