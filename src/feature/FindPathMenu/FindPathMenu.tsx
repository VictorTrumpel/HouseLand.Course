import { useState } from 'react';
import { Card, Input, Flex, Button, Alert, Form } from 'antd';
import { Graph, Node as HouseNode } from '@/shared/Graph';
import { IndexDB } from '../../../indexDB';
import { getIdsOfPathNodes } from './util/getIdsOfPathNodes';
import { createPathMapFromPathMatrix } from './util/createPathMapFromPathMatrix';
import { PathTree } from './ui/PathTree';
import cn from 'classnames';
import './FindPathMenu.css';

interface PathPainterFeature {
  housePathGraph: Graph;
}

type PropsType = {
  pathPainter: PathPainterFeature | null;
  db: IndexDB;
};

export const FindPathMenu = ({ pathPainter, db }: PropsType) => {
  const [pathsMap, setPathsMap] = useState<Map<string, HouseNode[]>>(new Map());
  const [findError, setFindError] = useState('');
  const [activePathId, setActivePathId] = useState('');

  const handleSearchPath = async (values: { from: string; to: string }) => {
    const housePathGraph = pathPainter?.housePathGraph;

    if (!housePathGraph) return;

    const allHousesInfo = await db.getAllHousesInfo();

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

  if (!pathPainter) return <></>;

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
              onClick={() => null}
              className={cn('path-container', { active: pathId === activePathId })}
              description={<PathTree path={path} housesMap={pathPainter.housePathGraph.map} />}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
