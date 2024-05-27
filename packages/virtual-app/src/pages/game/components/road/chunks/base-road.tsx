import { CHUNK_SIZE } from "../use-road";
import { Grid } from "../../entities/grid";

export const BaseRoad = () => {
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#00003D" />
      </mesh>
      <Grid position={[0, 0.1, 0]} size={CHUNK_SIZE / 2} divisions={10} />
    </group>
  );
};
