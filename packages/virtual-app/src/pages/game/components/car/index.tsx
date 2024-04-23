import { GroupProps } from "@react-three/fiber";
import { forwardRef } from "react";
import type { Group } from "three";

export const Car = forwardRef<Group, GroupProps>((props, ref) => {
  return (
    <group ref={ref} {...props}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
});
