import { useRef } from "react";
import { Car } from "../car";
import { Mesh } from "three";
import { useConnector } from "../../../../lib/connector";
import { useSubscribe } from "../../../../lib/subscribable";

export const Player = () => {
  const ref = useRef<Mesh | null>(null);

  const left = useConnector((s) => s.subscribable.left);
  const right = useConnector((s) => s.subscribable.right);
  useSubscribe(left, () => {
    if (!ref.current) return;
    ref.current.position.x -= 0.2;
  });
  useSubscribe(right, () => {
    if (!ref.current) return;
    ref.current.position.x += 0.2;
  });

  return <Car ref={ref} />;
};
