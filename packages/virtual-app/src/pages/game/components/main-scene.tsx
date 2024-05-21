import { Player } from "./player";
import { Road } from "./road";
import { PerspectiveCamera } from "@react-three/drei";
import { CAMERA_NAMES, useGame } from "../../../lib/use-game";
import { useSearchParams } from "react-router-dom";
import { Debug } from "./debug";
import { degToRad } from "three/src/math/MathUtils.js";

export const MainScene = () => {
  const activeCameraTop = useGame(
    (s) => s.activeCamera === CAMERA_NAMES.TOP_DOWN_CAMERA_NAME
  );

  const [searchParams] = useSearchParams();
  const isDebug = searchParams.has("debug");

  return (
    <>
      {/* Background color */}
      <color attach="background" args={["#003c70"]} />
      {/* Top Camera */}
      <PerspectiveCamera
        makeDefault={activeCameraTop}
        position={[0, 40, -20]}
        rotation={[degToRad(-90), degToRad(0), degToRad(90)]}
      />
      <ambientLight intensity={4} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Player />
      <Road />
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
