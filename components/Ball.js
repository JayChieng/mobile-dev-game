import React from "react";
import { Image, View } from "react-native";

export default function Ball({ body, size, imageSource }) {
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
