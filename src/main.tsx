import { InitScene } from './scene/InitScene';
import { LoadAssetsScene } from './scene/LoadAssetsScene';
import { MainFlowScene } from './scene/MainFlowScene';
import { HouseMenu } from './feature/HouseMenu/HouseMenu';
import { createRoot } from 'react-dom/client';
import './index.css';
import { IndexDB } from '../indexDB';

const indexDb = new IndexDB();

indexDb.onSuccessOpened = async () => {
  const scene = new InitScene();
  scene.start();

  // @ts-ignore
  window.scene = scene;

  const assetScene = new LoadAssetsScene();
  await assetScene.start();

  const mainFlowScene = new MainFlowScene(scene, assetScene.assetMap);
  mainFlowScene.start();

  const root = createRoot(document.getElementById('root')!);

  root.render(
    <>
      <HouseMenu scene={mainFlowScene} />
    </>
  );
};
