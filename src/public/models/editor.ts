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

  async update(user_id: String, data: Any) {
    const collection = await this.getCollection();

    let document = await collection.updateOne(
      { user_id: user_id },
      { $set: data },
      { upsert: true }
    );
    return document
  }

  async delete(user_id: String){
    const collection = await this.getCollection();

    let document = await collection.deleteOne({user_id: user_id})
    return document
  }
}
