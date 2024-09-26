import { createInstances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ComponentRef, useMemo, useRef } from "react";
import { Color, Vector3 } from "three";

const [ParticlesInstnaces, ParticleInstance] = createInstances();

interface Particle {
  color: Color;
  position: Vector3;
  velocity: Vector3;
  /** The particle is dead if it's position is 0 + BOX_SIZE / 2 */
  dead: boolean;
}

const PARTICLE_COUNT = 400;
const BOX_SIZE = 0.4;

export function DeathAnimation() {
  const particles = useMemo(() => {
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        color: Math.random() > 0.3 ? new Color("black") : new Color("blue"),
        position: new Vector3(
          Math.random() * 1,
          Math.random() * 2 + BOX_SIZE / 2,
          Math.random() * 10
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * 0.2,
          Math.random() * 0.2 + 0.2,
          Math.random() * -0.3 - 0.1
        ),
        dead: false,
      });
    }

    return particles;
  }, []);

  const instancesRef = useRef<ComponentRef<typeof ParticleInstance> | null>(
    null
  );

  useFrame(() => {
    if (!instancesRef.current) return;

    particles.forEach((particle, index) => {
      if (particle.dead) return;

      if (particle.position.y < BOX_SIZE / 2) {
        particle.dead = true;
        instancesRef.current!.children[index]!.position.setY(BOX_SIZE / 2);
        return;
      }

      // reduce the y velocity to simulate gravity
      particle.velocity.y -= 0.01;

      particle.position.add(particle.velocity);

      const instance = instancesRef.current!.children[index]!;
      instance.position.set(
        particle.position.x,
        particle.position.y,
        particle.position.z
      );
    });
  });

  return (
    <ParticlesInstnaces limit={PARTICLE_COUNT} ref={instancesRef as any}>
      <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
      <meshStandardMaterial color="blue" />
      {particles.map((particle, index) => (
        <ParticleInstance
          key={index}
          position={particle.position}
          color={particle.color}
        />
      ))}
    </ParticlesInstnaces>
  );
}
