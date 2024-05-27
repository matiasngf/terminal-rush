import { SpotLight, useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useState } from "react";
import {
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  SpotLight as SpotLightType,
  Vector3,
  type Group,
} from "three";
import { useControls } from "leva";
import { COLORS } from "../../../../../lib/colors";
import { type GLTF } from "three-stdlib";

interface MotoNodes extends GLTF {
  nodes: {
    MeshLine: Line;
    SM_Light_Back: Mesh;
    SM_Light_Circle: Mesh;
    SM_Light_Front: Mesh;
    SM_Racer: Mesh;
    Scene: Group;
  };
}

export const Motorcycle = forwardRef<Group, GroupProps>((props, ref) => {
  const { nodes } = useGLTF("/moto.glb") as unknown as MotoNodes;

  const [light, setLight] = useState<SpotLightType | null>(null);

  const materials = useMemo(
    () => ({
      outerBodyMaterial: new MeshStandardMaterial({ color: COLORS.black }),
      lightsMeshMaterial: new MeshStandardMaterial({
        color: COLORS.blueLight,
      }),
      lightsLineMaterial: new LineBasicMaterial({
        color: COLORS.blueLight,
        linewidth: 1,
      }),
    }),
    []
  );

  useControls(() => ({
    lineColor: {
      value: "#487cff",
      onChange: (value: string) => {
        materials.lightsLineMaterial.color.set(value);
        materials.lightsMeshMaterial.color.set(value);
      },
    },
  }));

  const scene = useMemo(() => {
    nodes.SM_Light_Back.material = materials.lightsMeshMaterial;
    nodes.SM_Light_Circle.material = materials.lightsMeshMaterial;
    nodes.SM_Light_Front.material = materials.lightsMeshMaterial;
    nodes.MeshLine.material = materials.lightsLineMaterial;
    nodes.SM_Racer.material = materials.outerBodyMaterial;

    nodes.MeshLine.scale.z = 1.04;

    console.log(nodes);

    return nodes.Scene;
  }, [nodes, materials]);

  // return null;

  const { position, direction } = useMemo(
    () => ({
      position: new Vector3(),
      direction: new Vector3(),
    }),
    []
  );

  useFrame(() => {
    if (!light) return;
    // calculate direction using vehicle position
    scene.getWorldPosition(position);
    scene.getWorldDirection(direction);
    light.target.position.copy(position).add(direction.multiplyScalar(20));
  });

  return (
    <group ref={ref} {...props}>
      <SpotLight
        position={[0, 1, -4]}
        intensity={20}
        penumbra={1}
        angle={2}
        anglePower={8}
        distance={20}
        decay={0}
        castShadow={false}
        ref={(r) => {
          if (r) setLight(r);
        }}
      />
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
});
