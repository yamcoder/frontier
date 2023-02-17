import { openDB } from "idb";

export class IDBService {

  #db = openDB('frontear-store', 1, {
    upgrade(db) {
      db.createObjectStore('state');
    },
  });

  async getState(key: 'boardState' | 'nodes') {
    return (await this.#db).get('state', key);
  }

  async setState(val: any, key: 'boardState' | 'nodes') {
    return (await this.#db).put('state', val, key);
  }
}
