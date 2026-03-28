import React from "react";
import { View } from "react-native";

export default function Paddle({ body, size }) {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "#4f46e5",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#1e1b4b",
      }}
    />
  );
}