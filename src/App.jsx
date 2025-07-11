import React, { useEffect } from "react";
import SnakeGameCanvas from "./SnakeGameCanvas.jsx";

function App() {

  const [menu, setMenu] = React.useState("game");
  const [name, setName] = React.useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    } else {
      const newName = prompt("Enter your name:");
      if (newName) {
        setName(newName);
        localStorage.setItem("name", newName);
      }
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-dvh items-center gap-2 p-5">
      <div className="text-2xl font-bold ">Snake Game</div>
      <div className="text-lg ">
        Hi, {name}!
      </div>
      <div className="flex flex-row items-center justify-center w-full gap-2">
        <button onClick={() => {
          setMenu("game");
        }} className={`${menu === "game" ? "border-2 border-zinc-700" : ""} bg-zinc-800  hover:bg-zinc-700 rounded-2xl px-4 py-1  transition-all duration-300 ease-in-out`}>
          Game
        </button>
        <button onClick={() => {
          setMenu("leaderboard");
        }} className={`${menu === "leaderboard" ? "border-2 border-zinc-700" : ""} bg-zinc-800  hover:bg-zinc-700 rounded-2xl px-4 py-1 transition-all duration-300 ease-in-out`}>
          Leaderboard
        </button>
      </div>
      {menu === "game" && (<div>
        <SnakeGameCanvas />
      </div>)}
      {menu === "leaderboard" && (<div>
      </div>
      )}
    </div>
  );
}

export default App;