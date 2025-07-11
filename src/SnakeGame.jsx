import React, { useState, useEffect, useRef } from "react";

const BOARD_SIZE = 10;
const INITIAL_SNAKE = [[0, 0]];
const INITIAL_DIRECTION = [0, 1];

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const intervalRef = useRef(null);

  function generateFood(snake) {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  }

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newHead = [
        prevSnake[0][0] + direction[0],
        prevSnake[0][1] + direction[1],
      ];


      if (
        newHead[0] < 0 ||
        newHead[0] >= BOARD_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= BOARD_SIZE ||
        prevSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])
      ) {
        document.removeEventListener("keydown", handleKeyDown);
        clearInterval(intervalRef.current);
        setIsGameOver(true);
        setStartGame(false);
        return prevSnake;
      }

      console.log("Moving snake to:", newHead);
      const hasEatenFood = newHead[0] === food[0] && newHead[1] === food[1];
      const newSnake = [newHead, ...prevSnake];

      if (!hasEatenFood) newSnake.pop();
      else setFood(generateFood(newSnake));

      return newSnake;
    });
  };

  const handleKeyDown = (e) => {
    const keyMap = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const newDir = keyMap[e.key];
    if (newDir) {
      if (direction[0] + newDir[0] !== 0 || direction[1] + newDir[1] !== 0) {
        // console.log("Key pressed:", e.key, newDir);
        setDirection(newDir);
      }
    }
  };

  const renderCell = (x, y) => {
    const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
    const isFood = food[0] === x && food[1] === y;
    const className = " size-8 " + (isSnake ? " bg-amber-400 rounded-md" : isFood ? " bg-slate-800 rounded-md" : "");
    return <div key={`${x}-${y}`} className={className} />;
  };

  function initiateGame() {
    document.addEventListener("keydown", handleKeyDown);
    if (isGameOver) {
      setSnake(INITIAL_SNAKE);
      setFood(generateFood(INITIAL_SNAKE));
      setDirection(INITIAL_DIRECTION);
    }

    setIsGameOver(false);
    setStartGame(true);

    document.addEventListener("keydown", handleKeyDown);
    intervalRef.current = setInterval(moveSnake, 1000);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    intervalRef.current = setInterval(moveSnake, 200);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, [direction, food]);

  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <div>
        Use arrows to play. <span className="text-green-600 font-semibold">Eat the green square to grow!</span>
      </div>
      <button onClick={initiateGame} className={`${startGame ? "invisible" : ""} bg-green-400 text-slate-100 px-2 py-1 rounded hover:bg-green-600 transition-all duration-300 ease-in-out`}>Start Game</button>
      <div className={`${isGameOver ? "" : "invisible"}`}>Game Over!</div>
      <div className="grid grid-cols-10 grid-rows-10 size-80 border border-slate-200 rounded-md">
        {Array.from({ length: BOARD_SIZE }).map((_, x) =>
          Array.from({ length: BOARD_SIZE }).map((_, y) =>
            renderCell(x, y)
          )
        )}
      </div>
    </div>
  );
}

export default SnakeGame;