import { useEffect } from "react";
import { create } from "zustand";


interface UseRafStore {
  rafCallbacks: Record<string, () => void>;
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

const raf = function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

export const useGlobalRafRunner = () => {
  useEffect(() => {

    const abortController = new AbortController();
    const signal = abortController.signal;

    const rafHandler = () => {
      if (signal.aborted) return;
      const callbacks = useRafStore.getState().rafCallbacks;
      for (const id in callbacks) {
        callbacks[id]();
      }
      raf(rafHandler);
    }

    raf(rafHandler);

    return () => {
      abortController.abort();
    }

  }, [])
}

export const useRaf = (callback: () => void) => {
  useEffect(() => {
    const id = useRafStore.getState().registerRafCallback(callback);
    return () => {
      useRafStore.getState().unregisterRafCallback(id);
    }
  }, [callback])
}

export const createRaf = (callback: () => void) => {
  const id = useRafStore.getState().registerRafCallback(callback);
  return () => {
    useRafStore.getState().unregisterRafCallback(id);
  }
}
