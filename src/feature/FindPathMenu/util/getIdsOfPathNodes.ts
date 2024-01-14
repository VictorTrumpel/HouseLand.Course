import { HousesTableCols } from './../../../../indexDB';

export const getIdsOfPathNodes = (
  houseNameFrom: string,
  houseNameTo: string,
  housesInfo: HousesTableCols[]
) => {
  return housesInfo.reduce(
    (nodeFromToIds, info) => {
      const { houseName, id } = info;

      const isHouseFrom = houseName === houseNameFrom;
      const isHouseTo = houseName === houseNameTo;

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
