import { openDB } from "idb";
import type { Node } from "../nodes/abstract-node";
import type { Scene } from './../core/scene';

export class IDBService {

  #db = openDB('frontear-store', 1, {
    upgrade(db) {
      db.createObjectStore('state');
    },
  });

  async getState(key: 'scene' | 'nodes') {
    return (await this.#db).get('state', key);
  }

  async setScene(val: Scene) {
    return (await this.#db).put('state', val, 'scene');
  }

  async setNodes(val: Node[]) {
    const nodes = val.map(({ ctx, scene, ...rest }) => rest);
    return (await this.#db).put('state', nodes, 'nodes');
  }
}
