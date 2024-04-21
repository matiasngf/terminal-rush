import { MeshProps } from "@react-three/fiber";
import { forwardRef } from "react";
import type { Mesh } from "three";

export const Car = forwardRef<Mesh, MeshProps>((props, ref) => {
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
});
