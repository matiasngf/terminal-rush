import { useMemo, useRef, useState } from "react";
import { AdditiveBlending, Group, MeshBasicMaterial } from "three";
import { useConnector } from "../../../../lib/connector";
import { useSubscribe } from "../../../../lib/subscribable";

import { CAMERA_NAMES, useGame } from "../../../../lib/use-game";
import { useFrame, useThree } from "@react-three/fiber";
import {
  clamp,
  clampLerp,
  lerp,
  normalizeDelta,
  round,
} from "../../../../lib/math";
import { lineWidth } from "../road/use-road";
import * as q from "three.quarks";

/// TODO: fix this asset
import { Motorcycle } from "../vehicles/motorcycle";
import { PerspectiveCamera } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

const maxRotation = Math.PI;

export const Player = () => {
  const activeCamera = useGame(
    (s) => s.activeCamera === CAMERA_NAMES.PLAYER_CAMERA
  );
  const containerRef = useRef<Group | null>(null);
  const carRef = useRef<Group | null>(null);

  const refs = useRef({
    // position from the last frame
    prevPosition: 0,
    // position for the current frame
    position: 0,
  });
  const currentLine = useGame((s) => s.currentLine);
  const addLine = useGame((s) => s.addLine);

  const left = useConnector((s) => s.subscribable.left);
  const right = useConnector((s) => s.subscribable.right);

  useSubscribe(left, () => {
    if (!carRef.current) return;
    addLine(-1);
  });
  useSubscribe(right, () => {
    if (!carRef.current) return;
    addLine(1);
  });

  useFrame((_, delta) => {
    if (!carRef.current) return;

    const normalizedDelta = normalizeDelta(delta);

    let difference =
      round(
        clampLerp(refs.current.position, currentLine, normalizedDelta * 0.06),
        4
      ) - refs.current.position;

    if (Math.abs(difference) < 0.01) {
      refs.current.position = currentLine;
    } else {
      difference =
        difference > 0
          ? clamp(difference, 0.01, 1)
          : clamp(difference, -1, -0.01);

      refs.current.position += difference;
    }

    const direction = refs.current.position - refs.current.prevPosition;
    refs.current.prevPosition = refs.current.position;

    //set position
    carRef.current.position.x = round(refs.current.position, 1) * lineWidth;

    //set rotations

    carRef.current.rotation.z = lerp(
      carRef.current.rotation.z,
      -direction * maxRotation * 0.5,
      0.3
    );

    carRef.current.rotation.y = lerp(
      carRef.current.rotation.y,
      -direction * maxRotation,
      0.1
    );
  });

  const [gameOver, setGameOver] = useState(false);

  const scene = useThree((state) => state.scene);

  const [batchSystem] = useMemo(() => {
    const batchSystem = new q.BatchedParticleRenderer();

    const explossionSystem = new q.ParticleSystem({
      duration: 1,
      looping: true,
      startLife: new q.IntervalValue(0.1, 0.2),
      startSpeed: new q.ConstantValue(1),
      startSize: new q.IntervalValue(1, 5),
      startColor: new q.ConstantColor(new q.Vector4(1, 1, 1, 1)),
      material: new MeshBasicMaterial({
        color: 0xff0000,
        blending: AdditiveBlending,
      }),
      shape: new q.ConeEmitter({}),

      emissionBursts: [
        {
          time: 2,
          count: new q.ConstantValue(100),
          cycle: 1,
          interval: 0.01,
          probability: 1,
        },
      ],
      renderOrder: 2,
      startTileIndex: new q.ConstantValue(91),
      uTileCount: 10,
      vTileCount: 10,
      renderMode: q.RenderMode.Mesh,
    });

    batchSystem.addSystem(explossionSystem);

    scene.add(batchSystem);
    scene.add(explossionSystem.emitter);

    return [batchSystem, explossionSystem] as const;
  }, [scene]);

  useFrame((_, delta) => {
    batchSystem.update(delta);
  });

  if (gameOver) return null;

  return (
    <>
      <group ref={containerRef}>
        <PerspectiveCamera
          makeDefault={activeCamera}
          fov={30}
          position={[0, 10, 20]}
          rotation={[degToRad(-20), 0, 0]}
        />
        <group>
          <Motorcycle
            onIntersectionEnter={() => {
              useConnector.getState().onLose.runCallbacks();
              setGameOver(true);
            }}
            ref={carRef}
          />
        </group>
      </group>
    </>
  );
};
