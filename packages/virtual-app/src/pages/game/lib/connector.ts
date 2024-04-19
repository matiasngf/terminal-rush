import { create } from "zustand";

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
}

export type ControlKey = keyof Controls;

interface ConnectorStore {
  canvas: HTMLCanvasElement | null;
  controls: Controls
  controlsRef: {
    current: Controls;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setControl: <T extends ControlKey = any>(control: T, value: Controls[T]) => void;
}

export const useConnector = create<ConnectorStore>((set, get) => {
  const controlsDefault = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false
  } satisfies Controls
  return {
    canvas: null,
    controls: controlsDefault,
    controlsRef: { current: controlsDefault },
    setControl: (control, value) => {
      get().controlsRef.current[control] = value;
      set((state) => {
        return {
          controls: {
            ...state.controls,
            [control]: value
          }
        }
      });
    }
  } as const satisfies ConnectorStore;
});



// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).connector = useConnector;
