import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Hud({ score, gameOver, youWin, onRestart }) {
  return (
    <View
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Score: {score}
      </Text>

      {gameOver && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 24, color: "red" }}>
            Game Over
          </Text>

          <TouchableOpacity
            onPress={onRestart}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "#1e293b",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}

      {youWin && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 24, color: "green" }}>
            You Win!
          </Text>

          <TouchableOpacity
            onPress={onRestart}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "#1e293b",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}