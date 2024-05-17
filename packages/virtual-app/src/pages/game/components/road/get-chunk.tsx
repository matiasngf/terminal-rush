import { Chunk } from "./use-road";
import { BaseRoad } from "./chunks/base-road";

export const getNewChunk = (): Chunk => {
  const randomId = Math.floor(Math.random() * 1000);
  return {
    id: randomId,
    Component: BaseRoad, // Todo: create more chunks and pick one randomly
  };
};
