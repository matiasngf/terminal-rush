import { create } from "zustand";

export const PLAYER_CAMERA_NAME = 'player' as const;
export const ORBIT_CAMERA_NAME = 'orbit' as const;
export const TOP_DOWN_CAMERA_NAME = 'top-down' as const;

export const CAMERA_NAMES = {
  PLAYER_CAMERA_NAME: 'player',
  ORBIT_CAMERA_NAME: 'orbit',
  TOP_DOWN_CAMERA_NAME: 'top-down',
} as const;

export type CameraName = typeof CAMERA_NAMES[keyof typeof CAMERA_NAMES];

export interface GameStore {
  activeCamera: CameraName;
  currentLine: number;
  setLine: (line: number) => void;
  addLine: (ammount?: number) => void;
}


export const useGame = create<GameStore>((set) => {
  return {
    activeCamera: 'player',
    currentLine: 0,
    setLine: (line: number) => {
      set({ currentLine: line })
    },
    addLine: (ammount = 1) => {
      set((state) => {
        return { currentLine: state.currentLine + (ammount) }
      })
    }

  } as const satisfies GameStore
})
