import { OrbitControls } from "@react-three/drei";
import { useKeyControls } from "../../../../lib/use-controls";

export const Debug = () => {
  useKeyControls();

  return <OrbitControls />;
};
