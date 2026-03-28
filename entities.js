import { Dimensions } from "react-native";
import Ball from "./components/Ball";
import Paddle from "./components/Paddle";
import Block from "./components/Block";
import Boundary from "./components/Boundary";

export default function createTestEntities() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const wallThickness = 10;
  const topBoundaryY = 130;
  const bottomBoundaryY = screenHeight - 120;

  return {
    ball: {
      body: { position: { x: screenWidth / 2, y: 380 } },
      size: [20, 20],
      renderer: Ball,
    },

    paddle: {
      body: { position: { x: screenWidth / 2, y: bottomBoundaryY - 80 } },
      size: [120, 20],
      renderer: Paddle,
    },

    topWall: {
      body: {
        position: {
          x: screenWidth / 2,
          y: topBoundaryY,
        },
      },
      size: [screenWidth, wallThickness],
      renderer: Boundary,
    },

    leftWall: {
      body: {
        position: {
          x: wallThickness / 2,
          y: (topBoundaryY + bottomBoundaryY) / 2,
        },
      },
      size: [wallThickness, bottomBoundaryY - topBoundaryY],
      renderer: Boundary,
    },

    rightWall: {
      body: {
        position: {
          x: screenWidth - wallThickness / 2,
          y: (topBoundaryY + bottomBoundaryY) / 2,
        },
      },
      size: [wallThickness, bottomBoundaryY - topBoundaryY],
      renderer: Boundary,
    },

    bottomWall: {
      body: {
        position: {
          x: screenWidth / 2,
          y: bottomBoundaryY,
        },
      },
      size: [screenWidth, wallThickness],
      renderer: Boundary,
    },

    block_1: {
      body: { position: { x: 60, y: 200 } },
      size: [58, 30],
      hp: 2,
      renderer: Block,
    },

    block_2: {
      body: { position: { x: 155, y: 200 } },
      size: [58, 30],
      hp: 1,
      renderer: Block,
    },

    block_3: {
      body: { position: { x: 300, y: 200 } },
      size: [58, 30],
      hp: 3,
      renderer: Block,
    },

    block_4: {
      body: { position: { x: screenWidth - 55, y: 200 } },
      size: [58, 30],
      hp: 2,
      renderer: Block,
    },

    block_5: {
      body: { position: { x: 95, y: 250 } },
      size: [58, 30],
      hp: 3,
      renderer: Block,
    },

    block_6: {
      body: { position: { x: 230, y: 250 } },
      size: [58, 30],
      hp: 1,
      renderer: Block,
    },

    block_7: {
      body: { position: { x: screenWidth - 100, y: 250 } },
      size: [58, 30],
      hp: 2,
      renderer: Block,
    },
  };
}