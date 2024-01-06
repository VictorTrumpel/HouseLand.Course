import { Scene, Color, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { IActionScene } from './IActionScene';
import { Grid } from '@/shared/Grid';
import { Ground } from '@/shared/Ground';
import { DirectLight } from '@/shared/DirectLight';
import { HemiLight } from '@/shared/HemiLight';

export class InitScene implements IActionScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly renderer2D: CSS2DRenderer;
  readonly ground: Ground;
  readonly orbitControls: OrbitControls;

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    this.renderer2D.render(this.scene, this.camera);
  };

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer2D.setSize(window.innerWidth, window.innerHeight);
  };

  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);

    const directionalLight = new DirectLight();
    this.scene.add(directionalLight);

    this.ground = new Ground();
    this.scene.add(this.ground);

    const grid = new Grid();
    this.scene.add(grid);

    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(-11.3, 50, 200);

    const hemiLight = new HemiLight();
    this.scene.add(hemiLight);

    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.append(this.renderer.domElement);

    this.renderer2D = new CSS2DRenderer();
    document.body.append(this.renderer2D.domElement);
    this.renderer2D.domElement.style.position = 'absolute';
    this.renderer2D.domElement.style.top = '0px';

    this.orbitControls = new OrbitControls(this.camera, this.renderer2D.domElement);

    this.orbitControls.maxPolarAngle = Math.PI / 2;

    this.onWindowResize();

    window.addEventListener('resize', this.onWindowResize);
  }

  async start() {
    this.animate();
  }
}
