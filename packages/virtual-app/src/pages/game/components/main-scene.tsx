import { Player } from "./player";
import { Debug } from "./debug";
import { useSearchParams } from "react-router-dom";
import { Road } from "./road";
import { PerspectiveCamera } from "@react-three/drei";
import { type PerspectiveCamera as PerspectiveType } from "three";
import { useEffect, useState } from "react";

export const MainScene = () => {
  const [searchParams] = useSearchParams();

  const [camera, setCamera] = useState<PerspectiveType | null>(null);

  useEffect(() => {
    if (!camera) return;
    camera.lookAt(0, 0, -10);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <>
      {/* Background color */}
      <color attach="background" args={["#003c70"]} />
      <PerspectiveCamera
        ref={setCamera}
        makeDefault
        fov={30}
        near={10}
        far={150}
        position={[0, 7, 20]}
      />
      <ambientLight intensity={4} />
      <spotLight
        position={[0, 10, 10]}
        angle={0.7}
        penumbra={0.2}
        decay={0}
        intensity={3}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Player />
      <Road />
      {searchParams.has("debug") && <Debug />}
    </>
  );
};
