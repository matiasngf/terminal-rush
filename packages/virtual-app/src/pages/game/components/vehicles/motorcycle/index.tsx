import { SpotLight, useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useState } from "react";
import {
  LineBasicMaterial,
  MeshStandardMaterial,
  SpotLight as SpotLightType,
  Vector3,
  type Group,
} from "three";
import { useControls } from "leva";

export const Motorcycle = forwardRef<Group, GroupProps>((props, ref) => {
  const { nodes, materials } = useGLTF("/tron_moto_sdc__free.glb");

  const [light, setLight] = useState<SpotLightType | null>(null);

  const lightLineMaterial = useMemo(
    () => new LineBasicMaterial({ color: "#487cff", linewidth: 1 }),
    []
  );

  useControls(() => ({
    lineColor: {
      value: "#487cff",
      onChange: (value: string) => {
        lightLineMaterial.color.set(value);
      },
    },
  }));

  const scene = useMemo(() => {
    // (materials.material is not used)

    const outerBody = materials.carosserie as MeshStandardMaterial;
    outerBody.color.set("#000000");

    const centerBand = materials["2_carosserie"] as MeshStandardMaterial;
    centerBand.color.set("#000000");

    const lights = materials["Material.001"] as MeshStandardMaterial;
    lights.color.set("#ffffff");
    lights.emissiveIntensity = 1;

    nodes.Sketchfab_model.traverse((child) => {
      if (child.position.x > 0) {
        child.position.x -= 365;
      }

      if ("material" in child && child.material === lights) {
        child.material = lightLineMaterial;
      }
    });

    return nodes.RootNode;
  }, [nodes, lightLineMaterial, materials]);

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
      <group
        position={[0, 1, 0]}
        scale={[0.01, 0.01, 0.01]}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
});
