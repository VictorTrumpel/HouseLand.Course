import { Graph } from './src/shared/Graph';

export type HousesTableCols = {
  id: string;
  positionX: number;
  positionZ: number;
  assetTitle: string;
  houseName: string;
};

export class IndexDB {
  private DATABASE_NAME = 'house';

  private VERSION = 1;

  private openRequest!: IDBOpenDBRequest;
  private db: IDBDatabase | null = null;

  static _INSTANCE: IndexDB | null = null;

  onSuccessOpened: (() => void) | null = null;

  constructor() {
    if (IndexDB._INSTANCE === null) {
      this.openRequest = indexedDB.open(this.DATABASE_NAME, this.VERSION);

      this.openRequest.onupgradeneeded = this.handleUpgradeNeeded;
      this.openRequest.onsuccess = this.handleSuccessOpened;

      IndexDB._INSTANCE = this;

      return;
    }

    return IndexDB._INSTANCE;
  }

  private handleUpgradeNeeded = () => {
    const db = this.openRequest.result;

    if (!db.objectStoreNames.contains('houses')) {
      db.createObjectStore('houses', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('housesPaths')) {
      db.createObjectStore('housesPaths');
    }

    this.db = db;
  };

  private handleSuccessOpened = () => {
    this.db = this.openRequest.result;
    this.onSuccessOpened?.();
  };

  saveHouseInfo(info: HousesTableCols) {
    if (!this.db) return;

    const transaction = this.db.transaction('houses', 'readwrite');
    const store = transaction.objectStore('houses');
    store.add(info);
  }

  getAllHousesInfo(): Promise<HousesTableCols[]> {
    return new Promise((res) => {
      if (!this.db) {
        res([]);
        return;
      }

      const transaction = this.db.transaction('houses', 'readwrite');
      const store = transaction.objectStore('houses');

      const request = store.getAll();

      request.onsuccess = (event) => {
        const target = event.target as unknown as { result: HousesTableCols[] };
        res(target.result);
        return;
      };

      request.onerror = () => {
        res([]);
      };
    });
  }

  saveHousesGraph(houseGraph: Graph) {
    if (!this.db) return;
    const transaction = this.db.transaction('housesPaths', 'readwrite');
    const store = transaction.objectStore('housesPaths');
    store.delete('paths');
    store.add(houseGraph, 'paths');
  }

  getHousesGraph(): Promise<Graph | undefined> {
    return new Promise((res) => {
      if (!this.db) {
        res(undefined);
        return;
      }

      const transaction = this.db.transaction('housesPaths', 'readwrite');
      const store = transaction.objectStore('housesPaths');
      const request = store.getAll();

      request.onsuccess = (event) => {
        const target = event.target as unknown as { result: Graph[] };
        res(target.result[0]);
        return;
      };

      request.onerror = () => {
        res(undefined);
      };
    });
  }
}
