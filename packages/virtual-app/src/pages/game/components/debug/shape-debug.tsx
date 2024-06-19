import { Helper } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { BoxHelper } from "three";

export const BoxDebug = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial visible={false} />
      <Helper type={BoxHelper} />
    </mesh>
  );
};
