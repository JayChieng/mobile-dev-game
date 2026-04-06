import Matter from "matter-js";
import { Dimensions } from "react-native";
import Ball from "./components/Ball";
import Paddle from "./components/Paddle";
import Block from "./components/Block";
import Boundary from "./components/Boundary";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const WALL_THICKNESS = 10;
const TOP_BOUNDARY_Y = 130;
const BOTTOM_BOUNDARY_Y = SCREEN_HEIGHT - 120;

const BALL_RADIUS = 10;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 20;
const BLOCK_WIDTH = 58;
const BLOCK_HEIGHT = 30;
const BLOCK_COUNT = 7;
const BLOCK_MIN_HP = 1;
const BLOCK_MAX_HP = 3;
const BLOCK_PADDING = 20;

// Create one static block entity that stores both Matter data and render metadata.
function createBlock(world, key, x, y, hp) {
  const body = Matter.Bodies.rectangle(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, {
    isStatic: true,
    label: key,
  });

  Matter.World.add(world, body);

  return {
    body,
    size: [BLOCK_WIDTH, BLOCK_HEIGHT],
    hp,
    type: "block",
    renderer: Block,
  };
}

// Generate an inclusive random integer for hp values and random block positions.
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Reject candidate positions that would visually overlap an existing block.
function overlapsWithExistingBlocks(position, blocks) {
  return blocks.some((block) => {
    const overlapX =
      Math.abs(block.x - position.x) < BLOCK_WIDTH + BLOCK_PADDING;
    const overlapY =
      Math.abs(block.y - position.y) < BLOCK_HEIGHT + BLOCK_PADDING;

    return overlapX && overlapY;
  });
}

// Scatter blocks across the upper half of the arena on each new game.
function generateBlockLayouts() {
  const blocks = [];
  const minX = WALL_THICKNESS + BLOCK_WIDTH / 2 + 6;
  const maxX = SCREEN_WIDTH - WALL_THICKNESS - BLOCK_WIDTH / 2 - 6;
  const playableHeight = BOTTOM_BOUNDARY_Y - TOP_BOUNDARY_Y;
  const minY = TOP_BOUNDARY_Y + 55;
  const maxY = TOP_BOUNDARY_Y + playableHeight / 2 - 30;

  for (let index = 0; index < BLOCK_COUNT; index += 1) {
    let position = null;

    // Try random positions first so each restart feels different without overlapping blocks.
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = {
        x: randomInt(minX, maxX),
        y: randomInt(minY, maxY),
      };

      // Keep the candidate only when it does not collide with earlier blocks.
      if (!overlapsWithExistingBlocks(candidate, blocks)) {
        position = candidate;
        break;
      }
    }

    // Use a deterministic fallback so block generation never fails completely.
    if (!position) {
      // Fall back to a loose grid if random placement runs out of valid spots.
      const column = index % 4;
      const row = Math.floor(index / 4);
      position = {
        x: minX + column * (BLOCK_WIDTH + BLOCK_PADDING),
        y: minY + row * (BLOCK_HEIGHT + BLOCK_PADDING),
      };
    }

    blocks.push({
      key: `block_${index + 1}`,
      x: position.x,
      y: position.y,
      hp: randomInt(BLOCK_MIN_HP, BLOCK_MAX_HP),
    });
  }

  return blocks;
}

// Create a full Matter world plus the renderable entities consumed by the game engine.
export default function createEntities(callbacks = {}) {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = 0;

  const world = engine.world;

  const ball = Matter.Bodies.circle(
    SCREEN_WIDTH / 2,
    BOTTOM_BOUNDARY_Y - 100,
    BALL_RADIUS,
    {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      inertia: Infinity,
      inverseInertia: 0,
      label: "ball",
    }
  );

  const paddle = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    BOTTOM_BOUNDARY_Y - 80,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    {
      isStatic: true,
      label: "paddle",
    }
  );

  const topWall = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    TOP_BOUNDARY_Y,
    SCREEN_WIDTH,
    WALL_THICKNESS,
    {
      isStatic: true,
      label: "topWall",
    }
  );

  const leftWall = Matter.Bodies.rectangle(
    WALL_THICKNESS / 2,
    (TOP_BOUNDARY_Y + BOTTOM_BOUNDARY_Y) / 2,
    WALL_THICKNESS,
    BOTTOM_BOUNDARY_Y - TOP_BOUNDARY_Y,
    {
      isStatic: true,
      label: "leftWall",
    }
  );

  const rightWall = Matter.Bodies.rectangle(
    SCREEN_WIDTH - WALL_THICKNESS / 2,
    (TOP_BOUNDARY_Y + BOTTOM_BOUNDARY_Y) / 2,
    WALL_THICKNESS,
    BOTTOM_BOUNDARY_Y - TOP_BOUNDARY_Y,
    {
      isStatic: true,
      label: "rightWall",
    }
  );

  const bottomWall = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    BOTTOM_BOUNDARY_Y,
    SCREEN_WIDTH,
    WALL_THICKNESS,
    {
      isStatic: true,
      isSensor: true,
      label: "bottomWall",
    }
  );

  Matter.Body.setVelocity(ball, { x: 3.5, y: -5 });

  Matter.World.add(world, [ball, paddle, topWall, leftWall, rightWall, bottomWall]);

  // Materialize the randomized block layout into named entity entries.
  const blockEntities = Object.fromEntries(
    generateBlockLayouts().map(({ key, x, y, hp }) => [
      key,
      createBlock(world, key, x, y, hp),
    ])
  );

  return {
    physics: {
      engine,
      world,
      callbacks,
      score: 0,
      gameOver: false,
      youWin: false,
      lastSpeedIncrease: 0,
    },

    ball: {
      body: ball,
      size: [BALL_RADIUS * 2, BALL_RADIUS * 2],
      renderer: Ball,
    },

    paddle: {
      body: paddle,
      size: [PADDLE_WIDTH, PADDLE_HEIGHT],
      renderer: Paddle,
    },

    topWall: {
      body: topWall,
      size: [SCREEN_WIDTH, WALL_THICKNESS],
      renderer: Boundary,
    },

    leftWall: {
      body: leftWall,
      size: [WALL_THICKNESS, BOTTOM_BOUNDARY_Y - TOP_BOUNDARY_Y],
      renderer: Boundary,
    },

    rightWall: {
      body: rightWall,
      size: [WALL_THICKNESS, BOTTOM_BOUNDARY_Y - TOP_BOUNDARY_Y],
      renderer: Boundary,
    },

    bottomWall: {
      body: bottomWall,
      size: [SCREEN_WIDTH, WALL_THICKNESS],
      renderer: Boundary,
    },
    ...blockEntities,
  };
}

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WALL_THICKNESS,
  TOP_BOUNDARY_Y,
  BOTTOM_BOUNDARY_Y,
};
