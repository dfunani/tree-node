import Model from "@/src/public/models/model";
import Security from "@/src/public/utils/cryptography";
import { JWTPayload } from "./data_classes/auth";
import User from "./users";
import { AuthenticationError } from "../errors/auth";
import jwt from "jsonwebtoken";

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

  async getToken(token: string) {
    const collection = await this.getCollection();

    const response = await collection.findOne({
      token: token,
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

  async createAPIKey(user_id: string, expires: number = 3600) {
    const collection = await this.getCollection();
    const now = new Date();
    const expiresAt = now.getDate() + expires;
    const security = new Security();
    const active = true;
    const apiKey = security.hash(
      JSON.stringify({
        user_id: user_id,
        insertedAt: now,
        expiresAt: expiresAt,
      })
    );

    const response = await collection.insertOne({
      user_id: user_id,
      apiKey: apiKey,
      expiresAt: expiresAt,
      active: active,
      createdAt: now,
      updatedAt: now,
    });

    if (!response) return null;

    return {
      user_id: user_id,
      apiKey: apiKey,
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

  async validateAPIKey(key: string) {
    const collection = await this.getCollection();

    const response = await collection.findOne({
      apiKey: key,
    });

    if (!response)
      throw new AuthenticationError("Invalid User API response. API key Doesn't Exist.");

    if (!response.active)
      throw new AuthenticationError("Invalid User API Key. API key Inactive.");
  }

  async validateJWT(token: string) {
    const bearer = token?.split(" ")[1];
    const verify = jwt.verify(bearer, process.env.JWT_SECRET);
    const now = new Date().getTime();
    const user = new User(this.db_uri, "users");

    if (
      !verify ||
      verify.exp < now ||
      verify.iat > now ||
      verify.sub !== process.env.DB_NAME
    )
      throw new AuthenticationError("Invalid User Token. Token Expired.");

    const validToken = JWTPayload.safeParse(verify);
    if (!validToken.success) {
      throw new AuthenticationError("Invalid User Token. Invalid Payload.");
    }

    const resultUser = user.getUser({
      email: validToken.data.email,
      password: validToken.data.password,
    });
    if (!resultUser)
      throw new AuthenticationError("Invalid User Token. Invalid User.");
    
    const resultProfile = user.getProfile(validToken.data.user_id);
    if (!resultProfile)
      throw new AuthenticationError("Invalid User Token. Invalid Profile.");
  }
}
