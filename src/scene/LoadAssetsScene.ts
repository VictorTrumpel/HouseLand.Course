import { assetsConfig } from './../constants/assetsConfig';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class LoadAssetsScene {
  readonly assetMap = new Map<string, GLTF>();

  private loader: GLTFLoader = new GLTFLoader();

  async start() {
    for (const asset of assetsConfig) {
      const gltf = await this.loadModel(asset.path);
      this.assetMap.set(asset.title, gltf);
    }
  }

  private async loadModel(path: string): Promise<GLTF> {
    return new Promise((res, rej) => {
      this.loader.load(path, res, () => null, rej);
    });
  }
}
