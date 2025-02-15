import Security from "@/src/public/utils/cryptography";
import {
  CredentialsType,
  ProfileType,
  RegistrationType,
  UserType,
} from "@/src/public/types/user";
import { ObjectId } from "mongodb";
import Model from "@/src/public/models/model";

export default class User extends Model {
  constructor(db_uri: string, db_name: string) {
    super(db_uri, db_name, "users");
  }

  async getUser(credentials: CredentialsType): Promise<UserType | null> {
    const collection = await this.getCollection();

    const client = new Security();
    credentials.email = client.encrypt(credentials.email);
    credentials.password = client.hash(credentials.password);

    const response = await collection.findOne({
      email: credentials.email,
      password: credentials.password,
    });
    if (!response) return null;

    return {
      id: response._id.toString(),
      email: response.email,
      password: response.password,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async getProfile(id: string): Promise<ProfileType | null> {
    const collection = await this.getCollection();

    const response = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!response) return null;

    return {
      name: response.name,
      surname: response.surname,
      dob: response.dob,
      city: response.city,
      country: response.country,
      image: response.image,
    };
  }

  async createUser(registration: RegistrationType) {
    const collection = await this.getCollection();

    const client = new Security();
    registration.email = client.encrypt(registration.email);
    registration.password = client.hash(registration.password);

    const existing_user = await collection.findOne({
      email: registration.email,
    });
    if (existing_user) {
      return null;
    }

    const now = new Date();
    const document = await collection.insertOne({
      ...registration,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    return {
      id: document.insertedId.toString(),
    };
  }

  async updateUser(id: string, profile: ProfileType) {
    const collection = await this.getCollection();

    const existing_user = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing_user) {
      return null;
    }

    const now = new Date();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...profile,
          updatedAt: now.toISOString(),
        },
      }
    );
    return {
      id: id,
    };
  }

  async delete(id: string) {
    const collection = await this.getCollection();

    const existing_user = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing_user) {
      return null;
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return {
      id: id,
    };
  }
}
