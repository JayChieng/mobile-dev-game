import React from "react";
import { Image, View } from "react-native";

export default function Paddle({ body, size, imageSource }) {
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
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <Image
        source={imageSource}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
    </View>
  );
}
