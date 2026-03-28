import React from "react";
import { View, Text, Pressable } from "react-native";

export default function Hud({
  score = 0,
  gameOver = false,
  youWin = false,
  onRestart,
}) {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 70,
          left: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            Score: {score}
          </Text>

          <Pressable
            onPress={onRestart}
            style={{
              backgroundColor: "#111827",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              Restart
            </Text>
          </Pressable>
        </View>
      </View>

      {(gameOver || youWin) && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <View
            style={{
              backgroundColor: youWin
                ? "rgba(34, 197, 94, 0.95)"
                : "rgba(239, 68, 68, 0.95)",
              paddingHorizontal: 28,
              paddingVertical: 18,
              borderRadius: 14,
              minWidth: 200,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 28,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {youWin ? "You Win" : "Game Over"}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}