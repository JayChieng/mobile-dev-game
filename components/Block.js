import React from "react";
import { Image, View } from "react-native";

const SPRITE_COLUMNS = 6;
const SPRITE_ROWS = 6;

export default function Block({
  body,
  size,
  hp,
  variantGroup = 0,
  variantRow = 0,
  imageSource,
}) {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  // Each block variant uses two adjacent frames: intact when hp is 2, cracked when hp is 1.
  const frameColumn = variantGroup * 2 + (hp === 2 ? 0 : 1);
  const spriteOffsetX = -(frameColumn * width);
  const spriteOffsetY = -(variantRow * height);

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        overflow: "hidden",
      }}
    >
      <Image
        source={imageSource}
        style={{
          position: "absolute",
          left: spriteOffsetX,
          top: spriteOffsetY,
          width: width * SPRITE_COLUMNS,
          height: height * SPRITE_ROWS,
        }}
        resizeMode="stretch"
      />
    </View>
  );
}
