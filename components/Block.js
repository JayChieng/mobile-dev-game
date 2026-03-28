import React from "react";
import { View, Text } from "react-native";

export default function Block({ body, size, hp }) {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  let backgroundColor = "#22c55e";

  if (hp === 2) {
    backgroundColor = "#f59e0b";
  } else if (hp === 3) {
    backgroundColor = "#ef4444";
  }

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#222222",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {hp}
      </Text>
    </View>
  );
}