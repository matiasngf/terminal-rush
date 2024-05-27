import { useEffect } from "react";
import { create } from "zustand";


interface UseRafStore {
  rafCallbacks: Record<string, () => void | Promise<void>>;
  registerRafCallback: (callback: () => void) => string;
  unregisterRafCallback: (id: string) => void;
}

const createId = () => Math.random().toString(36).substr(2, 9);

const useRafStore = create<UseRafStore>((set, get) => {
  const store: UseRafStore = {
    rafCallbacks: {},
    registerRafCallback: (callback) => {
      const id = createId();
      const callbacks = get().rafCallbacks;
      callbacks[id] = callback;
      return id;
    },
    unregisterRafCallback: (id) => {
      const callbacks = get().rafCallbacks;
      delete callbacks[id];
    },
  };
  return store;
})

export const useGlobalRafRunner = () => {
  useEffect(() => {

    // 24fps
    const rafTime = 1000 / 24;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const rafHandler = async () => {
      const startTime = performance.now();
      if (signal.aborted) return;
      const callbacks = useRafStore.getState().rafCallbacks;
      // TODO they should be executed in parallel
      for (const id in callbacks) {
        if (signal.aborted) return;
        if (callbacks[id] instanceof Promise) {
          await callbacks[id]();
        } else {
          callbacks[id]()
        }
      }
      const endTime = performance.now();
      const timeTook = endTime - startTime;
      const timeToWait = Math.max(0, rafTime - timeTook);
      setTimeout(rafHandler, timeToWait);
    }

    setTimeout(rafHandler, 0)

    return () => {
      abortController.abort();
    }

  }, [])
}

export const useRaf = (callback: () => void, deps: any[] = []) => {
  useEffect(() => {
    const id = useRafStore.getState().registerRafCallback(callback);
    return () => {
      useRafStore.getState().unregisterRafCallback(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const createRaf = (callback: () => void) => {
  const id = useRafStore.getState().registerRafCallback(callback);
  return () => {
    useRafStore.getState().unregisterRafCallback(id);
  }
}
