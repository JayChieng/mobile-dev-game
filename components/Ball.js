import React from "react";
import { View } from "react-native";

export default function Ball({ body, size }) {
  const radius = size[0] / 2;

  const x = body.position.x - radius;
  const y = body.position.y - radius;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size[0],
        height: size[1],
        borderRadius: radius,
        backgroundColor: "#1e293b",
      }}
    />
  );
}