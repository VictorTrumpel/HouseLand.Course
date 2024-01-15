import { IndexDB } from './../../indexDB';
import { SceneConnector } from './../entities/SceneConnector';
import { House } from '@/shared/House';
import { PlaneGeometry, MeshMatcapMaterial, Mesh, MeshLambertMaterial, Vector2 } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { assetsConfig } from '@/constants/assetsConfig';

export class HousePainter {
  private indexDB = new IndexDB();
  private draftHouse: House | null = null;
  private helperArmPlane: Mesh | null = null;

  housesMap = new Map<string, House>();

  constructor(private sceneConnector: SceneConnector, private assetMap: Map<string, GLTF>) {
    this.assetMap = assetMap;

    window.addEventListener('pointerdown', this.handlePointerDown);

    this.mountHouseFromIndexDb();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.draftHouse) {
      this.draftHouse.removeHouseLabel();
      this.draftHouse.removeHouseArm();
      this.sceneConnector.removeFromScene?.(this.draftHouse.mesh);
      this.sceneConnector.enableOrbitControl();
      this.draftHouse = null;
      if (this.helperArmPlane) {
        this.sceneConnector.removeFromScene?.(this.helperArmPlane);
      }
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.addEventListener('pointerup', this.handlePointerUp);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  private handleClickArmOfDraftHouse = () => {
    const houseArm = this.draftHouse?.houseArm;

    if (!houseArm || !this.draftHouse) return;

    const geometry = new PlaneGeometry(100, 100);
    const material = new MeshMatcapMaterial({ opacity: 0, transparent: true });
    this.helperArmPlane = new Mesh(geometry, material);
    this.helperArmPlane.position.y = houseArm.position.y;
    this.helperArmPlane.rotateX(-Math.PI / 2);
    this.helperArmPlane.renderOrder = 1;

    this.sceneConnector.disableOrbitControl();

    this.sceneConnector.addToScene?.(this.helperArmPlane);

    const houseArmMaterial = houseArm.material as MeshLambertMaterial;

    houseArmMaterial.color.set(0xffe921);

    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointermove', this.handlePointerMove);
  };

  private handlePointerMove = (event: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(event);
    if (pointer && this.draftHouse) {
      this.moveHouseAlongGround(pointer, this.draftHouse);
    }
  };

  private handlePointerUp = () => {
    const houseArm = this.draftHouse?.houseArm;

    if (!houseArm) return;

    const houseArmMaterial = houseArm.material as MeshLambertMaterial;

    houseArmMaterial.color.set(0x6794ab);

    this.sceneConnector.enableOrbitControl();

    if (this.helperArmPlane) {
      this.sceneConnector.removeFromScene?.(this.helperArmPlane);
    }

    window.removeEventListener('pointermove', this.handlePointerMove);
  };

  private handlePointerDown = (event: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(event);

    if (!this.draftHouse || !pointer) return;

    const firstIntersect = this.sceneConnector.getIntersectWithSprite?.(
      pointer,
      this.draftHouse.mesh
    );

    const isClickedOnHouseArm = firstIntersect?.object === this.draftHouse.houseArm;

    if (!isClickedOnHouseArm) return;

    this.handleClickArmOfDraftHouse();
  };

  private handleWindowDbClick = (e: MouseEvent) => {
    const pointer = this.sceneConnector.getPointerPosition?.(e);

    if (!pointer) return;

    const intersect = this.sceneConnector.getIntersectWithGround?.(pointer);

    if (!intersect) return;

    this.draftHouse?.moveHouseTo(intersect.point);
  };

  private handleSaveHouse = () => {
    if (!this.draftHouse) return;
    this.saveHouse(this.draftHouse);
    this.draftHouse = null;
  };

  mountDraftHouseOnScene(assetTitle: string) {
    const house = this.createHouseByAssetTitle(assetTitle);

    if (!house) return;

    house.onSaveHouse = this.handleSaveHouse;

    house.setOpacity(0.5);

    this.draftHouse = house;

    this.sceneConnector.addToScene?.(house.mesh);

    house.createHouseLabel();

    house.createHouseArm();

    window.addEventListener('keydown', this.handleKeyDown);
  }

  saveHouse(house: House) {
    house.setOpacity(1);
    house.isMount = true;

    this.housesMap.set(house.id, house);

    this.indexDB.saveHouseInfo({
      id: house.id,
      positionX: house.mesh.position.x,
      positionZ: house.mesh.position.z,
      assetTitle: house.config.title,
      houseName: house.name,
    });
  }

  private moveHouseAlongGround(pointer: Vector2, house: House) {
    const houseArm = house.houseArm;

    if (!houseArm || !this.helperArmPlane) return;

    const intersect = this.sceneConnector.getIntersectWithSprite?.(pointer, this.helperArmPlane);

    if (!intersect) return;

    house.mesh.position.x = intersect.point.x;
    house.mesh.position.z = intersect.point.z;
  }

  private createHouseByAssetTitle(assetTitle: string, id?: string) {
    const houseGLTF = this.assetMap.get(assetTitle);
    const assetConfig = assetsConfig.find(({ title }) => title === assetTitle);

    if (!houseGLTF || !assetConfig) return;

    const houseMesh = houseGLTF.scene.clone(true);

    return new House(houseMesh, assetConfig, id);
  }

  private async mountHouseFromIndexDb() {
    const houseInfo = await this.indexDB.getAllHousesInfo();

    for (const info of houseInfo) {
      const house = this.createHouseByAssetTitle(info.assetTitle, info.id)!;

      house.name = info.houseName;

      this.sceneConnector.addToScene?.(house.mesh);

      house.mesh.position.x = info.positionX;
      house.mesh.position.z = info.positionZ;

      house.isMount = true;

      house.createHouseLabel();

      this.housesMap.set(house.id, house);
    }
  }
}
