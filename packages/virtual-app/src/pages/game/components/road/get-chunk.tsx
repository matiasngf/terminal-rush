import { Chunk } from "./use-road";
import { BaseRoad } from "./chunks/base-road";
import { v4 } from "uuid";

export const getNewChunk = (): Chunk => {
  const randomId = v4();
  return {
    id: randomId,
    Component: BaseRoad, // Todo: create more chunks and pick one randomly
  };
};
