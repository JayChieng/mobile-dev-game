import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Mirror touch movement directly into the paddle body for drag-style control.
const TouchControl = (entities, { touches }) => {
  // Lock player input after the round ends.
  if (entities.physics?.gameOver || entities.physics?.youWin) {
    return entities;
  }

  const paddle = entities.paddle;
  const paddleWidth = 120;

  if (paddle && paddle.body) {
    touches
      .filter((t) => t.type === "move")
      .forEach((t) => {
        let newX = t.event.pageX;

        const minX = paddleWidth / 2;
        const maxX = SCREEN_WIDTH - paddleWidth / 2;

        // Keep the paddle from crossing the left or right walls.
        if (newX < minX) newX = minX;
        if (newX > maxX) newX = maxX;

        Matter.Body.setPosition(paddle.body, {
          x: newX,
          y: paddle.body.position.y,
        });
      });
  }

  return entities;
};

export default TouchControl;
