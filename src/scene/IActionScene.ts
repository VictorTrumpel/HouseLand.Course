import { Ground } from '@/shared/Ground';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly ground: Ground;
  readonly orbitControls: OrbitControls;

  start(): Promise<void>;
}
