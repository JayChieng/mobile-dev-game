import React from "react";
import { View, Text } from "react-native";

export default function Block({ body, size, hp }) {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  let backgroundColor = "#22c55e"; // default green

  if (hp === 3) backgroundColor = "#ef4444"; // red
  else if (hp === 2) backgroundColor = "#f97316"; // orange
  else if (hp === 1) backgroundColor = "#22c55e"; // green

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 10,
        backgroundColor,
        borderWidth: 2,
        borderColor: "#1f2937",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
        {hp}
      </Text>
    </View>
  );
}
