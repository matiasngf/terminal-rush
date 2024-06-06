import { useRef } from "react";
import { NpcTypeMotorcycle, useNpc } from "../use-npc";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Motorcycle } from "../../vehicles/motorcycle";
import { CHUNK_SIZE, getMovementAmount, useRoad } from "../../road/use-road";
import { normalizeDelta } from "../../../../../lib/math";
import { COLORS } from "../../../../../lib/colors";

export const MotorcycleNpc = ({ id, startingPosition }: NpcTypeMotorcycle) => {
  const npcPos = useRef(new Vector3(...startingPosition));
  const removeNpc = useNpc((s) => s.removeNpc);
  const vehicleRef = useRef<Group | null>(null);

  const globalSpeedRef = useRoad((s) => s.speedRef);

  useFrame((_, d) => {
    if (!vehicleRef.current) return;

    const delta = normalizeDelta(d);

    const gridMovement = getMovementAmount(globalSpeedRef.current, delta);

    npcPos.current.z += gridMovement;

    vehicleRef.current.position.copy(npcPos.current);
    if (npcPos.current.z > CHUNK_SIZE * 2) {
      removeNpc(id);
    }
  });

  return (
    <Motorcycle
      position={startingPosition}
      color={COLORS.redLight}
      ref={vehicleRef}
    />
  );
};
