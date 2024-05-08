import { useRef } from "react";
import { Car } from "../car";
import { Group } from "three";
import { useConnector } from "../../../../lib/connector";
import { useSubscribe } from "../../../../lib/subscribable";

import { useGame } from "../../../../lib/use-game";
import { useFrame } from "@react-three/fiber";
import { clampLerp, lerp, round } from "../../../../lib/math";

/** Max lines on the road */
export const LINES = 5;
const lineWidth = 1.5;
const maxRotation = Math.PI;

export const Player = () => {
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

    const normalizedDelta = round((1000 * delta) / 8, 4);

    let difference =
      round(
        clampLerp(refs.current.position, currentLine, normalizedDelta * 0.08),
        4
      ) - refs.current.position;

    if (Math.abs(difference) < 0.001) {
      refs.current.position = currentLine;
    } else {
      difference =
        difference > 0 ? Math.min(difference, 1) : Math.max(difference, -1);
      refs.current.position += difference;
    }

    const direction = refs.current.position - refs.current.prevPosition;
    refs.current.prevPosition = refs.current.position;

    //set position
    carRef.current.position.x = refs.current.position * lineWidth;

    //set rotations

    carRef.current.rotation.z = lerp(
      carRef.current.rotation.z,
      -direction * maxRotation * 0.2,
      0.2
    );

    carRef.current.rotation.y = lerp(
      carRef.current.rotation.y,
      -direction * maxRotation,
      0.4
    );
  });

  return <Car ref={carRef} />;
};
