import { Track } from "./track";
import { Player } from "./player";
import { Debug } from "./debug";
import { useSearchParams } from "react-router-dom";

export const MainScene = () => {
  const [searchParams] = useSearchParams();

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
      {searchParams.has("debug") && <Debug />}
    </>
  );
};
