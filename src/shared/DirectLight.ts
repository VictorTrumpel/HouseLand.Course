import { DirectionalLight } from 'three';

export class DirectLight extends DirectionalLight {
  constructor() {
    super(0xffffff, 3);
    this.position.set(0, 20, 10);
    this.castShadow = true;
    this.shadow.camera.top = 2;
    this.shadow.camera.bottom = -2;
    this.shadow.camera.left = -2;
    this.shadow.camera.right = 2;
  }
}
