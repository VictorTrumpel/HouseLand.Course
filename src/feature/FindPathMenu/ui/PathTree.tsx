import { Node as HouseNode } from '@/shared/Graph';
import { Steps } from 'antd';
import { useMemo } from 'react';
import { House } from '@/shared/House';

export const PathTree = ({
  path,
  housesMap,
}: {
  housesMap: Map<string, House>;
  path: HouseNode[];
}) => {
  const items = useMemo(() => {
    return path.map(({ id }) => ({ title: housesMap.get(id)?.name }));
  }, [path]);

  return <Steps direction='vertical' items={items} />;
};
