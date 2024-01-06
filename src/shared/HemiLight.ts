import { HemisphereLight } from 'three';

export class HemiLight extends HemisphereLight {
  constructor() {
    super(0xffffff, 0x444444, 3);
    this.position.set(0, 20, 0);
  }
}
