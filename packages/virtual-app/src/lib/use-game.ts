import { create } from "zustand";

export interface GameStore {
  currentLine: number;
  setLine: (line: number) => void;
  addLine: (ammount?: number) => void;

}

export const useGame = create<GameStore>((set) => {
  return {
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
