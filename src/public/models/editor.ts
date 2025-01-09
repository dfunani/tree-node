import Model from "@/src/public/models/model";

export default class Editor extends Model {
  constructor(db_uri: string, db_name: string) {
    super(db_uri, db_name, "nodes");
  }

  async get(user_id: string): Promise<Ed | null> {
    const collection = await this.getCollection();

    let response = await collection.findOne({ user_id: user_id });

    if (!response) return null;

    return {
      id: response._id.toString(),
      user_id: response.user_id,
      edges: response.edges,
      nodes: response.nodes,
    };
  }
}
