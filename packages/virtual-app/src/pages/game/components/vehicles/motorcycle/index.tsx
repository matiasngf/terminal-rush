import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo } from "react";
import {
  Line,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  ShaderMaterial,
  SpotLight as SpotLightType,
  Vector3,
  type Group,
} from "three";
import { useControls } from "leva";
import { COLORS } from "../../../../../lib/colors";
import { type GLTF } from "three-stdlib";

interface MotoNodes extends GLTF {
  nodes: {
    SM_Glow_Line: Line;
    SM_Light_Back: Mesh;
    SM_Light_Circle: Mesh;
    SM_Light_Front: Mesh;
    SM_Racer: Mesh;
    Scene: Group;
  };
}

export const Motorcycle = forwardRef<Group, GroupProps>((props, ref) => {
  const { nodes } = useGLTF("/moto.glb") as unknown as MotoNodes;

  const light = useMemo(() => new SpotLightType("white", 20, 30, 0.5), []);

  light.decay = 0.1;

  const materials = useMemo(
    () => ({
      outerBodyMaterial: new MeshBasicMaterial({ color: COLORS.black }),
      lightsMeshMaterial: new MeshPhysicalMaterial({
        color: COLORS.blueLight,
        emissive: COLORS.blueLight,
        emissiveIntensity: 10,
      }),
      lightsLineMaterial: new ShaderMaterial({
        uniforms: {
          color: { value: COLORS.blueLight },
          emissive: { value: COLORS.blueLight },
          emissiveIntensity: { value: 1 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform vec3 emissive;
          uniform float emissiveIntensity;
          varying vec3 vNormal;
          varying vec3 vPosition;
      
          void main() {
            vec3 emissiveColor = emissive * emissiveIntensity;
            gl_FragColor = vec4(color + emissiveColor, 1.0);
          }
        `,
      }),
    }),
    []
  );

  useControls(() => ({
    lineColor: {
      value: `#${COLORS.blueLight.getHexString()}`,
      onChange: (value: string) => {
        COLORS.blueLight.set(value);
      },
    },
  }));

  const scene = useMemo(() => {
    nodes.SM_Light_Back.material = materials.lightsMeshMaterial;
    nodes.SM_Light_Front.material = materials.lightsMeshMaterial;
    nodes.SM_Light_Circle.material = materials.lightsLineMaterial;
    nodes.SM_Glow_Line.material = materials.lightsLineMaterial;
    nodes.SM_Racer.material = materials.outerBodyMaterial;

    return nodes.Scene;
  }, [nodes, materials]);

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

    light.position.y = 1;
    light.position.z = -6;

    light.target.position.copy(direction);
  });

  return (
    <>
      <group ref={ref} {...props}>
        <primitive object={light}>
          <primitive object={light.target} />
        </primitive>
        <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <primitive object={scene} />
        </group>
      </group>
    </>
  );
});
