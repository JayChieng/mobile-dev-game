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

  const buildEntities = () =>
    createEntities({
      onScoreChange: (newScore) => setScore(newScore),
      onGameOver: () => {
        setGameOver(true);
        setYouWin(false);
        gameEngineRef.current?.stop();
      },
      onWin: () => {
        setYouWin(true);
        setGameOver(false);
        gameEngineRef.current?.stop();
      },
    });

  const [entities, setEntities] = useState(buildEntities());

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setYouWin(false);

    const newEntities = buildEntities();
    setEntities(newEntities);

    setTimeout(() => {
      if (gameEngineRef.current) {
        gameEngineRef.current.swap(newEntities);
        gameEngineRef.current.start();
      }
    }, 50);
  };

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('game')} />;
  }

  return (
    <GameScreen 
      entities={entities}
      gameEngineRef={gameEngineRef}
      score={score}
      gameOver={gameOver}
      youWin={youWin}
      onRestart={handleRestart}
    />
  );
}