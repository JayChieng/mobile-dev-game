import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Hud({
  score,
  gameOver,
  youWin,
  isRunning,
  onToggleRunning,
  onRestart,
}) {
  // Collapse win/lose state into one render config for the centered result card.
  const showStatusPanel = gameOver || youWin;
  const statusConfig = gameOver
    ? {
        title: "Game Over",
        backgroundColor: "#ef4444",
      }
    : youWin
      ? {
          title: "You Win!",
          backgroundColor: "#22c55e",
        }
      : null;

  return (
    <View style={{ ...styles.root }} pointerEvents="box-none">
      <View style={styles.topBar}>
        <Text style={styles.scoreText}>
          Score: {score}
        </Text>

        <View style={styles.buttonRow}>
          {/* Hide pause controls once the round is already finished. */}
          {!showStatusPanel && (
            <TouchableOpacity
              onPress={onToggleRunning}
              style={[styles.actionButton, styles.stopButton]}
            >
              <Text style={styles.buttonText}>
                {isRunning ? "Stop" : "Start"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onRestart}
            style={[styles.actionButton, styles.restartButton]}
          >
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Show a centered status card only for win or lose states. */}
      {statusConfig && (
        <View style={styles.statusWrapper} pointerEvents="none">
          <View
            style={[
              styles.statusCard,
              { backgroundColor: statusConfig.backgroundColor },
            ]}
          >
            <Text style={styles.statusText}>{statusConfig.title}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = {
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: "absolute",
    top: 62,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    minWidth: 92,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#2563eb",
  },
  restartButton: {
    backgroundColor: "#111827",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  statusWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    top: "40%",
    alignItems: "center",
  },
  statusCard: {
    minWidth: 250,
    paddingVertical: 28,
    paddingHorizontal: 36,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
  },
};
