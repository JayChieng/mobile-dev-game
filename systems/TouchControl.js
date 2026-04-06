import Matter from "matter-js";
import { Dimensions } from "react-native";

// Get the screen width for clamping
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TouchControl = (entities, { touches }) => {
  // We use "paddle" because that is the label used in your entities.js
  const paddle = entities.paddle;
  const paddleWidth = 120; // This matches the PADDLE_WIDTH in your entities.js

  if (paddle && paddle.body) {
    touches
      .filter((t) => t.type === "move")
      .forEach((t) => {
        // Calculate the new X position from the touch event
        let newX = t.event.pageX;

        // STEP 5: Prevent paddle from leaving the screen (Clamping)
        // We calculate the boundaries so the edge of the paddle stops at the wall
        const minX = paddleWidth / 2;
        const maxX = SCREEN_WIDTH - paddleWidth / 2;

        if (newX < minX) newX = minX;
        if (newX > maxX) newX = maxX;

        // Update the physical body position
        Matter.Body.setPosition(paddle.body, {
          x: newX,
          y: paddle.body.position.y, // Lock the Y axis so it doesn't move up/down
        });
      });
  }

  return entities;
};

export default TouchControl;