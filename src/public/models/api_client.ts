import Model from "@/src/public/models/model";
import Security from "@/src/public/utils/cryptography";

export class APIClient extends Model {
  constructor(db_uri: string, db_name: string) {
    super(db_uri, db_name, "tokens");
  }

  async getAllTokens(user_id: string) {
    const collection = await this.getCollection();
    const response = await collection.find({ user_id: user_id }).toArray();

    if (!response) return null;

    return response.map((token) => {
      return {
        id: token._id.toString(),
        user_id: token.user_id,
        token: token.token,
        expiresAt: token.expires,
        active: token.active,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };
    });
  }

  async getActiveToken(user_id: string) {
    const collection = await this.getCollection();

    const response = await collection.findOne({
      user_id: user_id,
      active: true,
    });

    if (!response) return null;

    return {
      id: response._id.toString(),
      user_id: response.user_id,
      token: response.token,
      expiresAt: response.expires,
      active: response.active,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async createToken(user_id: string, expires: number = 3600) {
    const collection = await this.getCollection();
    const now = new Date();
    const expiresAt = now.getDate() + expires;
    const security = new Security();
    const active = true;
    const token = security.hash(
      JSON.stringify({
        user_id: user_id,
        insertedAt: now,
        expiresAt: expiresAt,
      })
    );

    const response = await collection.insertOne({
      user_id: user_id,
      token: token,
      expiresAt: expiresAt,
      active: active,
      createdAt: now,
      updatedAt: now,
    });

    if (!response) return null;

    return {
      user_id: user_id,
      token: token,
      expiresAt: expiresAt,
      active: active,
      createdAt: now,
      updatedAt: now,
    };
  }

  async deleteToken(user_id: string) {
    const collection = await this.getCollection();
    const response = await collection.updateOne(
      { user_id: user_id },
      { $set: { active: false } }
    );

    if (!response) return null;

    return response;
  }
}
