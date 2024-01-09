import { Group, Mesh, Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';
import { createRoot } from 'react-dom/client';
import { HouseLabel } from '@/shared/HouseLabel/HouseLabel';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { assetsConfig } from '@/constants/assetsConfig';

export class House {
  readonly mesh: Group;
  readonly id: string;
  readonly config: (typeof assetsConfig)[number];

  name = '';

  isMount: boolean = false;

  onSaveHouse: () => void = () => null;

  constructor(mesh: Group, assetConfig: (typeof assetsConfig)[number], id?: string) {
    this.mesh = mesh;

    this.id = id || uuidv4();

    this.config = assetConfig;

    this.attachMeshes();

    // this.createHouseLabel();
  }

  private handleChangeHouseName = (name: string) => {
    this.name = name;
  };

  saveHouse() {
    this.isMount = true;
    this.onSaveHouse();
  }

  setOpacity(opacity: number) {
    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
  }

  moveHouseTo(vector: Vector3) {
    this.mesh.position.copy(vector);
  }

  createHouseLabel() {
    const labelContainer = document.createElement('div');

    const root = createRoot(labelContainer);

    root.render(
      <HouseLabel
        isMount={this.isMount}
        onSave={this.saveHouse.bind(this)}
        defaultName={this.name}
        onChangeName={this.handleChangeHouseName}
      />
    );

    const label = new CSS2DObject(labelContainer);

    this.mesh.add(label);
  }

  private attachMeshes() {
    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = child.material.clone();
        child.userData = this;
      }
    });
  }
}
