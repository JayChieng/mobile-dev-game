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

    block_1: createBlock(world, "block_1", 60, 200, 2),
    block_2: createBlock(world, "block_2", 155, 200, 1),
    block_3: createBlock(world, "block_3", 300, 200, 3),
    block_4: createBlock(world, "block_4", SCREEN_WIDTH - 55, 200, 2),
    block_5: createBlock(world, "block_5", 95, 250, 3),
    block_6: createBlock(world, "block_6", 230, 250, 1),
    block_7: createBlock(world, "block_7", SCREEN_WIDTH - 100, 250, 2),
  };
}

export { SCREEN_WIDTH, SCREEN_HEIGHT, WALL_THICKNESS, TOP_BOUNDARY_Y, BOTTOM_BOUNDARY_Y };