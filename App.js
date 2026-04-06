import React, { useRef, useState } from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import GameScreen from "./screens/GameScreen";
import createEntities from "./entities";

export default function App() {
  const gameEngineRef = useRef(null);

  const [screen, setScreen] = useState('welcome');


  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [youWin, setYouWin] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  // Build a fresh entity tree and wire physics callbacks back into React state.
  const buildEntities = () =>
    createEntities({
      onScoreChange: (newScore) => setScore(newScore),
      onGameOver: () => {
        setGameOver(true);
        setYouWin(false);
        setIsRunning(false);
        gameEngineRef.current?.stop();
      },
      onWin: () => {
        setYouWin(true);
        setGameOver(false);
        setIsRunning(false);
        gameEngineRef.current?.stop();
      },
    });

  const [entities, setEntities] = useState(buildEntities());

  // Reset both UI state and Matter entities so the next round starts cleanly.
  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setYouWin(false);
    setIsRunning(true);

    const newEntities = buildEntities();
    setEntities(newEntities);

    // Wait one tick so the engine swaps to the fresh Matter world before restarting.
    setTimeout(() => {
      if (gameEngineRef.current) {
        gameEngineRef.current.swap(newEntities);
        gameEngineRef.current.start();
      }
    }, 50);
  };

  // Toggle the engine without allowing resume once the match has already ended.
  const handleToggleRunning = () => {
    // Ignore stop/start requests after win/lose or before the engine ref exists.
    if (gameOver || youWin || !gameEngineRef.current) {
      return;
    }

    // Pausing only stops the engine loop; the current entities stay in place.
    if (isRunning) {
      gameEngineRef.current.stop();
      setIsRunning(false);
      return;
    }

    gameEngineRef.current.start();
    setIsRunning(true);
  };

  // Keep the welcome screen separate so the game tree only mounts after start.
  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() => {
          setScore(0);
          setGameOver(false);
          setYouWin(false);
          setIsRunning(true);
          setScreen('game');
        }}
      />
    );
  }

  return (
    <GameScreen 
      entities={entities}
      gameEngineRef={gameEngineRef}
      score={score}
      gameOver={gameOver}
      youWin={youWin}
      isRunning={isRunning}
      onToggleRunning={handleToggleRunning}
      onRestart={handleRestart}
    />
  );
}
