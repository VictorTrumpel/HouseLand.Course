import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Raycaster, Vector2, Object3D, Group, Mesh, Event } from 'three';
import { IActionScene } from './IActionScene';
import { HousePainter } from '@/feature/HousePainter';
import { PathPainter } from '@/feature/PathPainter';
import { SceneConnector } from '@/entities/SceneConnector';

export class MainFlowScene {
  readonly actionScene: IActionScene;
  readonly assetMap: Map<string, GLTF>;

  private raycaster: Raycaster = new Raycaster();

  private housePainter: HousePainter | null = null;
  private pathPainter: PathPainter | null = null;

  private sceneConnector = new SceneConnector();

  constructor(actionScene: IActionScene, assetMap: Map<string, GLTF>) {
    this.actionScene = actionScene;
    this.assetMap = assetMap;

    this.sceneConnector.getPointerPosition = this.getPointerPosition.bind(this);
    this.sceneConnector.getIntersectWithGround = this.getIntersectWithGround.bind(this);
    this.sceneConnector.getIntersectWithScene = this.getIntersectWithScene.bind(this);
    this.sceneConnector.addToScene = this.addToScene.bind(this);
    this.sceneConnector.removeFromScene = this.removeFromScene.bind(this);
  }

  async start() {
    this.pathPainter = new PathPainter(this.sceneConnector);

    this.housePainter = new HousePainter(this.sceneConnector, this.assetMap);
  }

  mountDraftHouseOnScene(title: string) {
    this.housePainter?.mountDraftHouseOnScene(title);
  }

  private addToScene(element: Object3D<Event> | Group | Mesh) {
    this.actionScene.scene.add(element);
  }

  private removeFromScene(element: Object3D<Event> | Group | Mesh) {
    this.actionScene.scene.remove(element);
  }

  private getPointerPosition(event: PointerEvent | MouseEvent) {
    const pointer = new Vector2();

    pointer.x = (event.clientX / this.actionScene.renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / this.actionScene.renderer.domElement.clientHeight) * 2 + 1;

    return pointer;
  }

  private getIntersectWithGround(pointer: Vector2) {
    this.raycaster.setFromCamera(pointer, this.actionScene.camera);
    return this.raycaster.intersectObject(this.actionScene.ground)[0];
  }

  private getIntersectWithScene(pointer: Vector2) {
    this.raycaster.setFromCamera(pointer, this.actionScene.camera);
    return this.raycaster.intersectObjects(this.actionScene.scene.children, true);
  }
}
