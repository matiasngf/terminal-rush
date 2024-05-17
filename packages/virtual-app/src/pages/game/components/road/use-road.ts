/** The road store will handle the obstacles that the player runs into. */
import { create } from "zustand";
import { getNewChunk } from "./get-chunk";

export const CHUNK_SIZE = 50;
export const TOTAL_CHUNKS = 5

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

const initialChunks = Array.from({ length: TOTAL_CHUNKS }, () => getNewChunk());

export const useRoad = create<RoadStore>(() => ({
  speedRef: { current: 0.005 },
  pivotRef: { current: 0 },
  chunks: initialChunks,
}));
