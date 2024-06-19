/** The road store will handle the obstacles that the player runs into. */
import { create } from "zustand";
import { getNewChunk } from "./get-chunk";

/** Max lines on the road */
export const LINES = 5;
export const lineWidth = 4;

export const CHUNK_SIZE = LINES * lineWidth;
export const TOTAL_CHUNKS = 10

export interface ChunnkProps {
  id: string;
}

export interface Chunk {
  id: string;
  Component: (props: ChunnkProps) => JSX.Element;
}

export interface RoadStore {
  speedRef: { current: number };
  pivotRef: { current: number };
  // chunks of objects that will move twords the X axis and desappear at some point
  chunks: Chunk[];
}

export const getMovementAmount = (speed: number, delta: number) =>
  delta * speed * CHUNK_SIZE;

const initialChunks = Array.from({ length: TOTAL_CHUNKS }, () => getNewChunk());

export const useRoad = create<RoadStore>(() => ({
  speedRef: { current: 0.02 },
  pivotRef: { current: 0 },
  chunks: initialChunks,
}));
