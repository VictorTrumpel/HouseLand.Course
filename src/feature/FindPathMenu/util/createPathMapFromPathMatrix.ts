import { Node as HouseNode } from '@/shared/Graph';

export const createPathMapFromPathMatrix = (pathMatrix: HouseNode[][]) => {
  return pathMatrix.reduce((map: Map<string, HouseNode[]>, path) => {
    const pathId = path.map(({ id }) => id).join();
    map.set(pathId, path);
    return map;
  }, new Map<string, HouseNode[]>());
};
