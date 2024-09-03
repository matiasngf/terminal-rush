import { Canvas } from "@react-three/fiber";
import { Group, WebGLRenderer } from "three";
import { Motorcycle } from "../game/components/vehicles/motorcycle";
import { Renderer } from "../game/components/renderer";
import {
  Grid,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from "@react-three/drei";
import { useState } from "react";

export const CollisionPage = () => {
  const [player, setPlayer] = useState<Group | null>(null);
  return (
    <div className="canvas-container">
      <Canvas
        gl={(canvas) => {
          return new WebGLRenderer({
            canvas,
            antialias: false,
            alpha: false,
          });
        }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <Renderer>
          <Grid args={[100, 100]} />
          <ambientLight intensity={4} />
          <PerspectiveCamera
            makeDefault
            position={[20, 20, 0]}
            ref={(r) => {
              if (r) {
                r.lookAt(0, 0, -6);
              }
            }}
          />
          <OrbitControls makeDefault />
          {player && <TransformControls mode="translate" object={player} />}
          <Motorcycle
            onIntersectionEnter={() => {
              console.log("entered");
            }}
            ref={setPlayer}
          />
          <Motorcycle position={[0, 0, -15]} />
        </Renderer>
      </Canvas>
    </div>
  );
};
