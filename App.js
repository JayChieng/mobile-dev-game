import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Hud from "./components/Hud";
import Physics from "./Physics";
import createEntities from "./entities";

export default function App() {
  const gameEngineRef = useRef(null);

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

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        systems={[Physics]}
        entities={entities}
        style={styles.container}
      />

      <View style={styles.hudContainer} pointerEvents="box-none">
        <Hud
          score={score}
          gameOver={gameOver}
          youWin={youWin}
          onRestart={handleRestart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#67e8f9",
  },
  hudContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
