import { Canvas } from "@react-three/fiber";
import { MainScene } from "./main-scene";
import { useConnector } from "../lib/connector";

export const GameCanvas = () => {
  return (
    <Canvas
      ref={(canvas) => {
        if (canvas) {
          useConnector.setState({ canvas });
        }
      }}
      camera={{
        fov: 40,
        position: [0, 5, 15],
      }}
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <MainScene />
    </Canvas>
  );
};
