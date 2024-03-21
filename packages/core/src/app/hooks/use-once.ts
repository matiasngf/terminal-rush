import { useCallback, useEffect, useRef } from "react";

export const useCallbackOnce = (callback: () => void) => {
  const called = useRef(false);
  return useCallback(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export const useOnce = (callback: () => void) => {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
