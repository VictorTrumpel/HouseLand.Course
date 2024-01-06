import { GridHelper } from 'three';

export class Grid extends GridHelper {
  constructor() {
    super(100, 20, 0x000000, 0x000000);

    const gridMaterial = this.material;
    const isMaterialArr = gridMaterial instanceof Array;
    if (!isMaterialArr) {
      gridMaterial.opacity = 0.2;
      gridMaterial.transparent = true;
    }
  }
}
