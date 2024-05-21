import { GameCanvas } from "./components/canvas";
import { Leva } from "leva";
import { useSearchParams } from "react-router-dom";

export const GamePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isDebug = searchParams.has("debug");
  return (
    <div className="canvas-container">
      <Leva hidden={!isDebug} />
      <GameCanvas />
    </div>
  );
};
