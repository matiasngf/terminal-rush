/** The road store will handle the obstacles that the player runs into. */
import { create } from "zustand";

export const CHUNK_SIZE = 20;
export const TOTAL_CHUNKS = 10

export interface ChunnkProps {
  id: number;
  positionShift: number;
}

export interface Chunk {
  id: number;
  Component: (props: ChunnkProps) => JSX.Element;
}

export interface RoadStore {
  speedRef: { current: number };
  pivotRef: { current: number };
  // chunks of objects that will move twords the X axis and desappear at some point
  chunks: Chunk[];
}

export const useRoad = create<RoadStore>(() => ({
  speedRef: { current: 0.001 },
  pivotRef: { current: 0 },
  chunks: [],
}));
