import { useState } from 'react';
import { Card, Input, Flex, Button, Alert, Form } from 'antd';
import { Graph, Node as HouseNode } from '@/shared/Graph';
import { getIdsOfPathNodes } from './util/getIdsOfPathNodes';
import { createPathMapFromPathMatrix } from './util/createPathMapFromPathMatrix';
import { PathTree } from './ui/PathTree';
import { House } from '@/shared/House';
import cn from 'classnames';
import './FindPathMenu.css';

interface PathPainterFeature {
  housePathGraph: Graph;
  highLightPath: (fromId: string, toId: string, color: 0x635c5a | 0x4096ff) => void;
}

interface HousePainterFeature {
  housesMap: Map<string, House>;
}

type PropsType = {
  pathPainter: PathPainterFeature | null;
  housePainter: HousePainterFeature | null;
};

export const FindPathMenu = ({ pathPainter, housePainter }: PropsType) => {
  const [pathsMap, setPathsMap] = useState<Map<string, HouseNode[]>>(new Map());
  const [findError, setFindError] = useState('');
  const [activePathId, setActivePathId] = useState('');
  const [activePath, setActivePath] = useState<HouseNode[]>([]);

  const handlePathClick = (nodesPath: HouseNode[]) => {
    setColorPathOfNodes(activePath, 0x635c5a);
    setColorPathOfNodes(nodesPath, 0x4096ff);

    setActivePathId(nodesPath.map(({ id }) => id).join());
    setActivePath(nodesPath);
  };

  const setColorPathOfNodes = (nodesPath: HouseNode[], color: 0x635c5a | 0x4096ff) => {
    if (!pathPainter) return;

    for (let i = 0; i < nodesPath.length - 1; i++) {
      const currentNode = nodesPath[i];
      const nextNode = nodesPath[i + 1];

      pathPainter.highLightPath(currentNode.id, nextNode.id, color);
    }
  };

  const handleSearchPath = async (values: { from: string; to: string }) => {
    const housePathGraph = pathPainter?.housePathGraph;
    const housesMap = housePainter?.housesMap;

    if (!housePathGraph || !housesMap) return;

    const allHousesInfo = [...housesMap.values()];

    const { nodeFromId, nodeToId } = getIdsOfPathNodes(values.from, values.to, allHousesInfo);

    const nodeFrom = housePathGraph.map.get(nodeFromId);
    const nodeTo = housePathGraph.map.get(nodeToId);

    const hasNodes = nodeTo && nodeFrom;

    if (!hasNodes) {
      setFindError('Маршрут не найден');
      return;
    }

    const possiblePathMatrix = housePathGraph.getAllPaths(nodeFrom, nodeTo);
    const pathsMap = createPathMapFromPathMatrix(possiblePathMatrix);

    console.log('possiblePathMatrix :>> ', possiblePathMatrix);
    console.log('pathsMap :>> ', pathsMap);

    setPathsMap(pathsMap);
    setFindError(possiblePathMatrix.length === 0 ? 'Маршрут не найден' : '');
  };

  if (!pathPainter || !housePainter) return <></>;

  return (
    <Card rootClassName='find-path-container' title='Найти маршрут'>
      <Form onFinish={handleSearchPath}>
        <Flex gap='middle' vertical>
          <Form.Item
            name='from'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Поле обязательно' }]}
          >
            <Input placeholder='откуда' />
          </Form.Item>

          <Form.Item
            name='to'
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: 'Поле обязательно' }]}
          >
            <Input placeholder='куда' />
          </Form.Item>

          <Button htmlType='submit' type='primary'>
            Найти
          </Button>
        </Flex>
      </Form>

      {findError ? (
        <Alert type='info' message={findError} style={{ marginTop: '20px' }} />
      ) : (
        <div>
          {[...pathsMap.entries()].map(([pathId, path]) => (
            <Alert
              key={pathId}
              onClick={() => handlePathClick(path)}
              className={cn('path-container', { active: pathId === activePathId })}
              description={<PathTree path={path} housesMap={housePainter.housesMap} />}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
