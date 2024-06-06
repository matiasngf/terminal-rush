import { Player } from "./player";
import { Road } from "./road";
import { PerspectiveCamera } from "@react-three/drei";
import { CAMERA_NAMES, useGame } from "../../../lib/use-game";
import { useSearchParams } from "react-router-dom";
import { Debug } from "./debug";
import { COLORS } from "../../../lib/colors";
import { NPCs } from "./npc";

export const MainScene = () => {
  const activeCameraTop = useGame(
    (s) => s.activeCamera === CAMERA_NAMES.TOP_DOWN_CAMERA
  );

  const [searchParams] = useSearchParams();
  const isDebug = searchParams.has("debug");

  return (
    <>
      {/* Background color */}
      <color
        attach="background"
        args={[COLORS.blue.clone().multiplyScalar(0.1)]}
      />
      {/* Top Camera */}
      <PerspectiveCamera
        makeDefault={activeCameraTop}
        position={[30, 20, 20]}
        fov={15}
        // rotation={[degToRad(0), degToRad(0), degToRad(0)]}
        ref={(camera) => {
          if (camera) {
            camera.lookAt(0, 1.5, 0);
          }
        }}
      />
      <ambientLight intensity={4} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Player />
      <Road />
      <NPCs />
      {isDebug && <Debug />}
    </>
  );
};

/** This camerea looks really cool:
<PerspectiveCamera
  position={[0, 0, 30]}
  rotation={[0, degToRad(10), degToRad(10)]}
/>
 */
