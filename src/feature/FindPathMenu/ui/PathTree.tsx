import { Node as HouseNode } from '@/shared/Graph';
import { Steps } from 'antd';
import { useMemo } from 'react';

export const PathTree = ({
  path,
  housesMap,
}: {
  housesMap: Map<string, HouseNode>;
  path: HouseNode[];
}) => {
  const items = useMemo(() => {
    return path.map(({ id }) => ({ title: housesMap.get(id)?.id }));
  }, [path]);

  return <Steps direction='vertical' items={items} />;
};
