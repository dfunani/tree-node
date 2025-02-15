import { connection } from "@/src/public/utils/database";

export default class Model {
  db_uri: string;
  db_name: string;
  collection: string;

  constructor(db_uri: string, db_name: string, collection: string) {
    this.db_uri = db_uri;
    this.db_name = db_name;
    this.collection = collection;
  }

  async getCollection() {
    const db = await connection(this.db_uri, this.db_name);
    const collection = db.collection(this.collection);

    return collection;
  }
}
