import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import Hud from "../components/Hud";
import Physics from "../systems/Physics";
import TouchControl from "../systems/TouchControl";

const GameScreen = ({
  entities,
  gameEngineRef,
  score,
  gameOver,
  youWin,
  isRunning,
  onToggleRunning,
  onRestart,
}) => {
  const systems = [Physics?.default ?? Physics, TouchControl?.default ?? TouchControl];

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        running={isRunning}
        systems={systems}
        entities={entities}
        style={styles.container}
      />

      <View style={styles.hudContainer} pointerEvents="box-none">
        <Hud
          score={score}
          gameOver={gameOver}
          youWin={youWin}
          isRunning={isRunning}
          onToggleRunning={onToggleRunning}
          onRestart={onRestart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fae7be",
  },
  hudContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GameScreen;
