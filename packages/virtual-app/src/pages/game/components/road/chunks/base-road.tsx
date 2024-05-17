import { CHUNK_SIZE, ChunnkProps } from "../use-road";

export const BaseRoad = ({ positionShift }: ChunnkProps) => {
  return (
    <group position={[0, 0, positionShift]}>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};
