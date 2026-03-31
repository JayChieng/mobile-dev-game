import Matter from "matter-js";
import { SCREEN_WIDTH, WALL_THICKNESS } from "./entities";

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function getBlockKeys(entities) {
  return Object.keys(entities).filter((key) => key.startsWith("block_"));
}

function getEntityKeyByBody(entities, body) {
  for (const key of Object.keys(entities)) {
    if (entities[key] && entities[key].body === body) {
      return key;
    }
  }
  return null;
}

const Physics = (entities, { time, touches }) => {
  const { engine, world, callbacks } = entities.physics;
  const ball = entities.ball.body;
  const paddle = entities.paddle.body;

  if (!entities.physics.collisionSetup) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      if (entities.physics.gameOver || entities.physics.youWin) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        const labels = [bodyA.label, bodyB.label];

        const hitBottom = labels.includes("ball") && labels.includes("bottomWall");
        if (hitBottom) {
          entities.physics.gameOver = true;
          callbacks?.onGameOver?.();
          return;
        }

        const isBallBlock =
          (bodyA.label === "ball" && bodyB.label.startsWith("block_")) ||
          (bodyB.label === "ball" && bodyA.label.startsWith("block_"));

        if (isBallBlock) {
          const blockBody = bodyA.label.startsWith("block_") ? bodyA : bodyB;
          const blockKey = getEntityKeyByBody(entities, blockBody);

          if (!blockKey || !entities[blockKey]) return;

          entities[blockKey].hp -= 1;
          entities.physics.score += 10;
          callbacks?.onScoreChange?.(entities.physics.score);

          if (entities[blockKey].hp <= 0) {
            Matter.World.remove(world, entities[blockKey].body);
            delete entities[blockKey];
          }

          if (getBlockKeys(entities).length === 0) {
            entities.physics.youWin = true;
            callbacks?.onWin?.();
          }
        }
      });
    });

    entities.physics.collisionSetup = true;
  }

  const moveTouch = touches.find((t) => t.type === "move");
  const pressTouch = touches.find((t) => t.type === "press");
  const activeTouch = moveTouch || pressTouch;

  if (activeTouch?.event?.pageX) {
    const nextX = clamp(
      activeTouch.event.pageX,
      WALL_THICKNESS + entities.paddle.size[0] / 2,
      SCREEN_WIDTH - WALL_THICKNESS - entities.paddle.size[0] / 2
    );

    Matter.Body.setPosition(paddle, {
      x: nextX,
      y: paddle.position.y,
    });
  }

  const now = time.current;

  if (!entities.physics.lastSpeedIncrease) {
    entities.physics.lastSpeedIncrease = now;
  }

  if (now - entities.physics.lastSpeedIncrease >= 3000) {
    Matter.Body.setVelocity(ball, {
      x: ball.velocity.x * 1.05,
      y: ball.velocity.y * 1.05,
    });
    entities.physics.lastSpeedIncrease = now;
  }

  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;