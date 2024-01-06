import { Ground } from '@/shared/Ground';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

export interface IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly ground: Ground;

  start(): Promise<void>;
}
