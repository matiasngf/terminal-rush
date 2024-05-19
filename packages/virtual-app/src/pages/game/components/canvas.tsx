import { Canvas } from "@react-three/fiber";
import { MainScene } from "./main-scene";
import { useConnector } from "../../../lib/connector";
import { WebGLRenderer } from "three";

export const GameCanvas = () => {
  return (
    <Canvas
      gl={(canvas) => {
        return new WebGLRenderer({
          canvas,
          antialias: false,
          alpha: false,
        });
      }}
      ref={(canvas) => {
        if (canvas) {
          useConnector.setState({ canvas });
        }
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
