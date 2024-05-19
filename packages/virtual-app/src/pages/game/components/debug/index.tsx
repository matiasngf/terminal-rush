import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useKeyControls } from "../../../../lib/use-controls";
import { type Camera } from "three";
import { useState } from "react";

export const Debug = () => {
  useKeyControls();

  const [camera, setCamera] = useState<Camera | undefined>(undefined);

  return (
    <>
      <PerspectiveCamera
        makeDefault={false}
        position={[0, 5, 10]}
        ref={(r) => {
          if (r) {
            setCamera(r);
          }
        }}
      />
      <OrbitControls camera={camera} />
    </>
  );
};
