import Matter from "matter-js";
import {
  BOTTOM_BOUNDARY_Y,
  SCREEN_WIDTH,
  WALL_THICKNESS,
} from "../entities";

// Keep the paddle inside the playable horizontal range.
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Count remaining blocks so win detection stays data-driven.
function getBlockKeys(entities) {
  return Object.keys(entities).filter((key) => key.startsWith("block_"));
}

// Map a Matter body back to its entity key after a collision event.
function getEntityKeyByBody(entities, body) {
  for (const key of Object.keys(entities)) {
    if (entities[key] && entities[key].body === body) {
      return key;
    }
  }
  return null;
}

// Stop any residual motion when the match has ended.
function freezeBody(body) {
  Matter.Body.setVelocity(body, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(body, 0);
}

function lockObstacleToLane(body, x, y, velocityX) {
  // Reapply a horizontal-only lane so the obstacle stays non-static but never drifts vertically.
  Matter.Body.setPosition(body, { x, y });
  Matter.Body.setVelocity(body, { x: velocityX, y: 0 });
  Matter.Body.setAngularVelocity(body, 0);
}

function lockBallAtBottom(body, radius) {
  Matter.Body.setPosition(body, {
    x: body.position.x,
    y: BOTTOM_BOUNDARY_Y - radius,
  });
  freezeBody(body);
}

function getBallKeys(entities) {
  return Object.keys(entities).filter((key) => key === "ball" || key === "ball2");
}

function getActiveBallKeys(entities) {
  return getBallKeys(entities).filter((key) => !entities[key].fallen);
}

// Advance physics, process collisions, and translate touch input into paddle movement.
const Physics = (entities, { time, touches }) => {
  const { engine, world, callbacks } = entities.physics;
  const ballBodies = getBallKeys(entities).map((key) => entities[key].body);
  const activeBallBodies = getActiveBallKeys(entities).map((key) => entities[key].body);
  const paddle = entities.paddle.body;
  const obstaclePaddle = entities.obstaclePaddle.body;

  // Register collision listeners once for this Matter engine instance.
  if (!entities.physics.collisionSetup) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      // Ignore late collision events after the round is already finished.
      if (entities.physics.gameOver || entities.physics.youWin) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        const labels = [bodyA.label, bodyB.label];

        const hitBottom =
          labels.includes("bottomWall") &&
          (labels.includes("ball") || labels.includes("ball2"));
        // Freeze each ball on first contact with the bottom; the round ends after both balls are down.
        if (hitBottom) {
          const ballKey = bodyA.label === "bottomWall" ? bodyB.label : bodyA.label;

          if (!entities[ballKey] || entities[ballKey].fallen) {
            return;
          }

          entities[ballKey].fallen = true;
          lockBallAtBottom(entities[ballKey].body, entities[ballKey].size[0] / 2);

          if (getActiveBallKeys(entities).length === 0) {
            entities.physics.gameOver = true;
            getBallKeys(entities).forEach((key) => {
              lockBallAtBottom(entities[key].body, entities[key].size[0] / 2);
            });
            freezeBody(paddle);
            freezeBody(obstaclePaddle);
            callbacks?.onGameOver?.();
          }
          return;
        }

        const isBallBlock =
          ((bodyA.label === "ball" || bodyA.label === "ball2") &&
            bodyB.label.startsWith("block_")) ||
          ((bodyB.label === "ball" || bodyB.label === "ball2") &&
            bodyA.label.startsWith("block_"));

        // Only block collisions should reduce hp and award score.
        if (isBallBlock) {
          const blockBody = bodyA.label.startsWith("block_") ? bodyA : bodyB;
          const blockKey = getEntityKeyByBody(entities, blockBody);

          // Ignore stale bodies that were already removed from the entity map.
          if (!blockKey || !entities[blockKey]) return;

          entities[blockKey].hp -= 1;
          entities.physics.score += 10;
          callbacks?.onScoreChange?.(entities.physics.score);

          // Remove the block completely once all of its hp has been consumed.
          if (entities[blockKey].hp <= 0) {
            Matter.World.remove(world, entities[blockKey].body);
            delete entities[blockKey];
          }

          // Winning is defined as clearing every remaining block entity.
          if (getBlockKeys(entities).length === 0) {
            entities.physics.youWin = true;
            callbacks?.onWin?.();
          }
        }
      });
    });

    entities.physics.collisionSetup = true;
  }

  // Hard-stop all movement after win/lose so the final frame stays stable.
  if (entities.physics.gameOver || entities.physics.youWin) {
    ballBodies.forEach(freezeBody);
    freezeBody(paddle);
    freezeBody(obstaclePaddle);
    return entities;
  }

  const moveTouch = touches.find((t) => t.type === "move");
  const pressTouch = touches.find((t) => t.type === "press");
  const activeTouch = moveTouch || pressTouch;

  // Treat both press and drag as paddle control and clamp them into the arena.
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

  const obstacleHalfWidth = entities.obstaclePaddle.size[0] / 2;
  const minObstacleX = WALL_THICKNESS + obstacleHalfWidth;
  const maxObstacleX = SCREEN_WIDTH - WALL_THICKNESS - obstacleHalfWidth;
  const obstacleSpeed = 1.5;
  const obstacleFixedY = entities.obstaclePaddle.fixedY;
  const nextObstacleX =
    obstaclePaddle.position.x + obstacleSpeed * entities.physics.obstacleDirection;

  if (nextObstacleX <= minObstacleX) {
    entities.physics.obstacleDirection = 1;
    lockObstacleToLane(obstaclePaddle, minObstacleX, obstacleFixedY, obstacleSpeed);
  } else if (nextObstacleX >= maxObstacleX) {
    entities.physics.obstacleDirection = -1;
    lockObstacleToLane(obstaclePaddle, maxObstacleX, obstacleFixedY, -obstacleSpeed);
  } else {
    lockObstacleToLane(
      obstaclePaddle,
      nextObstacleX,
      obstacleFixedY,
      obstacleSpeed * entities.physics.obstacleDirection
    );
  }

  const now = time.current;

  if (!entities.physics.lastSpeedIncrease) {
    entities.physics.lastSpeedIncrease = now;
  }

  // Increase speed on a timer to make long rallies progressively harder.
  if (now - entities.physics.lastSpeedIncrease >= 3000) {
    // Gradually increase difficulty while preserving each ball's current travel direction.
    activeBallBodies.forEach((body) => {
      Matter.Body.setVelocity(body, {
        x: body.velocity.x * 1.05,
        y: body.velocity.y * 1.05,
      });
    });
    entities.physics.lastSpeedIncrease = now;
  }

  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;
