import { SceneConnector } from './../entities/SceneConnector';
import { House } from '@/shared/House';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class HousePainter {
  private draftHouse: House | null = null;

  constructor(private sceneConnector: SceneConnector, private assetMap: Map<string, GLTF>) {
    this.assetMap = assetMap;

    window.addEventListener('dblclick', this.handleWindowDbClick);
  }

  private handleWindowDbClick = (e: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(e);

    if (!pointer) return;

    const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);

    if (!intersect) return;

    this.draftHouse?.moveHouseTo(intersect.point);
  };

  private handleSaveHouse = () => {
    if (!this.draftHouse) return;
    this.draftHouse.setOpacity(1);
    this.draftHouse = null;
  };

  mountDraftHouseOnScene(title: string) {
    const houseGLTF = this.assetMap.get(title);

    if (!houseGLTF) return;

    const houseMesh = houseGLTF.scene.clone(true);

    const house = new House(houseMesh);

    house.onSaveHouse = this.handleSaveHouse;

    house.setOpacity(0.5);

    this.draftHouse = house;

    this.sceneConnector.addToScene?.(house.mesh);
  }
}
