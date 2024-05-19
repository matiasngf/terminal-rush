import { CHUNK_SIZE } from "../use-road";

export const BaseRoad = () => {
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};
