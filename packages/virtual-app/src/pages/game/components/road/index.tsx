import { useRef } from "react";
import { CHUNK_SIZE, Chunk, useRoad } from "./use-road";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { BaseRoad } from "./chunks/base-road";

const getNewChunk = (): Chunk => {
  const randomId = Math.floor(Math.random() * 1000);
  return {
    id: randomId,
    Component: BaseRoad, // Todo: create more chunks and pick one randomly
  };
};

export const Road = () => {
  const groupRef = useRef<Group | null>(null);
  const chunks = useRoad((s) => s.chunks);
  const speedRef = useRoad((s) => s.speedRef);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const movementAmout = delta * speedRef.current * CHUNK_SIZE;
    group.position.z -= movementAmout;
    if (group.position.z < -CHUNK_SIZE) {
      const diff = CHUNK_SIZE + group.position.z;

      const newChunk = getNewChunk();
      useRoad.setState((s) => {
        const arr = [...s.chunks, newChunk];
        arr.shift();
        return { chunks: arr };
      });
      group.position.z = -diff;
    }
  });

  return (
    <group ref={groupRef}>
      {chunks.map((chunk, index) => (
        <chunk.Component id={chunk.id} key={chunk.id} positionShift={index} />
      ))}
    </group>
  );
};
