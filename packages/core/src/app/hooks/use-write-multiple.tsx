import { useCallback, useState } from "react";

export interface ShowIndexProps {
  s: number | boolean;
}

export const useWriteMultiple = () => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(current + 1);

  const showAt = useCallback((s: number): boolean => current >= s, [current]);

  return { current, next, showAt };
};
