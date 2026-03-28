import React from "react";
import { View } from "react-native";
import Hud from "./components/Hud";
import createTestEntities from "./entities";

export default function App() {
  const entities = createTestEntities();

  return (
    <View style={{ flex: 1, backgroundColor: "#67e8f9" }}>
      <Hud
        score={120}
        gameOver={false}
        youWin={false}
        onRestart={() => console.log("Restart pressed")}
      />

      {Object.entries(entities).map(([key, entity]) => {
        const Renderer = entity.renderer;
        return <Renderer key={key} {...entity} />;
      })}
    </View>
  );
}