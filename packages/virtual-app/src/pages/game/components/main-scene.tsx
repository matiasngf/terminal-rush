import { Track } from "./track";
import { useKeyControls } from "../../../lib/use-controls";
import { Player } from "./player";

export const MainScene = () => {
  useKeyControls();
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Track />
      <Player />
    </>
  );
};
