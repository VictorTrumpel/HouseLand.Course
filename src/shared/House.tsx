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

  private houseLabel: CSS2DObject | null = null;

  name = '';

  isMount: boolean = false;

  onSaveHouse: () => void = () => null;

  constructor(mesh: Group, assetConfig: (typeof assetsConfig)[number], id?: string) {
    this.mesh = mesh;

    this.id = id || uuidv4();

    this.config = assetConfig;

    this.attachMeshes();
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

  removeHouseLabel() {
    if (this.houseLabel) this.mesh.remove(this.houseLabel);
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

    this.houseLabel = new CSS2DObject(labelContainer);

    this.houseLabel.position.x = this.config.labelPosition[0];
    this.houseLabel.position.y = this.config.labelPosition[1];
    this.houseLabel.position.z = this.config.labelPosition[2];

    this.mesh.add(this.houseLabel);
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
