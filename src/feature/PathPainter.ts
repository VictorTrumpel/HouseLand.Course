import { IndexDB, HousesTableCols } from './../../indexDB';
import { Vector2 } from 'three';
import { PathLine } from '@/shared/PathLine';
import { SceneConnector } from '@/entities/SceneConnector';
import { House } from '@/shared/House';
import { Graph, Node } from '@/shared/Graph';
import { PathsMap } from '@/entities/PathsMap';

export class PathPainter {
  private pathLineFrom: PathLine | null = null;
  private houseFrom: House | null = null;
  private indexDb = new IndexDB();

  pathsMap = new PathsMap();
  housePathGraph = new Graph();

  constructor(private sceneConnector: SceneConnector) {
    window.addEventListener('dblclick', this.handleWindowDbClick);

    this.mountPathsFromIndexDb();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.pathLineFrom) {
      this.sceneConnector.removeFromScene?.(this.pathLineFrom);
      this.pathLineFrom = null;
    }
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  private handleMouseMove = (event: PointerEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(event);
    if (pointer) this.aimPathLine(pointer);
  };

  private handleWindowDbClick = (event: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(event);

    if (!pointer) return;

    const pickedElement = this.sceneConnector.getIntersectWithScene?.(pointer)?.[0];

    const house = pickedElement?.object?.userData;

    const isHouse = house instanceof House;

    if (!isHouse) return;

    const isPathStarted = this.pathLineFrom !== null;

    if (!isPathStarted) {
      this.startMountPathFrom(house);

      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('pointermove', this.handleMouseMove);
      return;
    }

    this.finishMountPath(house);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('pointermove', this.handleMouseMove);
  };

  highLightPath(houseFromId: string, houseToId: string, color: 0x635c5a | 0x4096ff) {
    const path = this.pathsMap.getPath(houseFromId, houseToId);
    path?.setColor(color);
  }

  private finishMountPath(house: House) {
    if (!this.pathLineFrom || !this.houseFrom) throw new Error('Path did not started');

    const fromPoint = this.pathLineFrom.userData.fromPoint as [number, number, number];
    const toPoint = [house.mesh.position.x, 0, house.mesh.position.z] as [number, number, number];

    this.pathLineFrom.setFromTo(fromPoint, toPoint);

    const houseFrom = this.houseFrom;
    const houseTo = house;

    if (this.pathsMap.hasPath(houseFrom.id, houseTo.id)) {
      this.sceneConnector.removeFromScene?.(this.pathLineFrom);
      return;
    }

    const nodeMap = this.housePathGraph.map;

    const nodeFrom = nodeMap.get(houseFrom.id) || new Node(houseFrom.id);
    const nodeTo = nodeMap.get(houseTo.id) || new Node(houseTo.id);

    this.housePathGraph.addChildren(nodeFrom, nodeTo);
    this.pathsMap.setPathToPathsMap(nodeFrom.id, nodeTo.id, this.pathLineFrom);

    this.pathLineFrom = null;
    this.houseFrom = null;

    this.indexDb.saveHousesGraph(this.housePathGraph);
  }

  private startMountPathFrom(house: House) {
    this.pathLineFrom = new PathLine();
    this.houseFrom = house;
    this.pathLineFrom.userData.fromPoint = [house.mesh.position.x, 0, house.mesh.position.z];
    this.pathLineFrom.setFromTo(
      [house.mesh.position.x, 0, house.mesh.position.z],
      [house.mesh.position.x, 0, house.mesh.position.z]
    );
    this.sceneConnector.addToScene?.(this.pathLineFrom);
  }

  private async mountPathsFromIndexDb() {
    const housesGraph = await this.indexDb.getHousesGraph();
    const allHousesOnScene = await this.indexDb.getAllHousesInfo();

    const housesMap = new Map<string, HousesTableCols>();

    allHousesOnScene.forEach((house) => housesMap.set(house.id, house));

    if (!housesGraph) return;

    this.housePathGraph = new Graph(housesGraph.map);

    const graph = this.housePathGraph.map;

    const queue = [...graph.values()];

    const visitedNodes = new Set<string>();

    while (queue.length) {
      const node = queue.pop();

      if (node === undefined) break;

      if (visitedNodes.has(node.id)) continue;

      visitedNodes.add(node.id);

      const parentHouse = housesMap.get(node.id);

      if (!parentHouse) continue;

      for (const childNode of node.children) {
        const childHouse = housesMap.get(childNode.id);

        if (!childHouse || visitedNodes.has(childNode.id)) continue;

        const path = new PathLine();

        path.setFromTo(
          [parentHouse.positionX, 0, parentHouse.positionZ],
          [childHouse.positionX, 0, childHouse.positionZ]
        );

        this.pathsMap.setPathToPathsMap(parentHouse.id, childHouse.id, path);

        this.sceneConnector.addToScene?.(path);
      }

      queue.push(...node.children);
    }
  }

  private aimPathLine(pointer: Vector2) {
    if (!this.pathLineFrom) throw new Error('Path did not started');

    const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);

    if (!intersect) return;

    const fromPoint = this.pathLineFrom.userData.fromPoint as [number, number, number];

    this.pathLineFrom.setFromTo(fromPoint, [intersect.point.x, 0, intersect.point.z]);
  }
}
