import { House } from '@/shared/House';

export const getIdsOfPathNodes = (
  houseNameFrom: string,
  houseNameTo: string,
  housesInfo: House[]
) => {
  return housesInfo.reduce(
    (nodeFromToIds, info) => {
      const { name, id } = info;

      const isHouseFrom = name === houseNameFrom;
      const isHouseTo = name === houseNameTo;

      if (isHouseFrom) {
        nodeFromToIds.nodeFromId = id;
      }

      if (isHouseTo) {
        nodeFromToIds.nodeToId = id;
      }

      return nodeFromToIds;
    },
    { nodeFromId: '', nodeToId: '' }
  );
};
