import Matter from "matter-js";
import { SCREEN_WIDTH, WALL_THICKNESS } from "../entities";

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

// Advance physics, process collisions, and translate touch input into paddle movement.
const Physics = (entities, { time, touches }) => {
  const { engine, world, callbacks } = entities.physics;
  const ball = entities.ball.body;
  const paddle = entities.paddle.body;

  // Register collision listeners once for this Matter engine instance.
  if (!entities.physics.collisionSetup) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      // Ignore late collision events after the round is already finished.
      if (entities.physics.gameOver || entities.physics.youWin) return;

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        const labels = [bodyA.label, bodyB.label];

        const hitBottom = labels.includes("ball") && labels.includes("bottomWall");
        // A ball touching the bottom sensor means the player has lost the round.
        if (hitBottom) {
          // Freeze both bodies immediately so loss state cannot drift for another frame.
          entities.physics.gameOver = true;
          freezeBody(ball);
          freezeBody(paddle);
          callbacks?.onGameOver?.();
          return;
        }

        const isBallBlock =
          (bodyA.label === "ball" && bodyB.label.startsWith("block_")) ||
          (bodyB.label === "ball" && bodyA.label.startsWith("block_"));

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
    freezeBody(ball);
    freezeBody(paddle);
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

  const now = time.current;

  if (!entities.physics.lastSpeedIncrease) {
    entities.physics.lastSpeedIncrease = now;
  }

  // Increase speed on a timer to make long rallies progressively harder.
  if (now - entities.physics.lastSpeedIncrease >= 3000) {
    // Gradually increase difficulty while preserving the current travel direction.
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
