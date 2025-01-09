import Security from "@/src/public/utils/cryptography";
import {
  Logins,
  Profile,
  Registrations,
  Users,
} from "@/src/public/utils/types";
import { ObjectId } from "mongodb";
import Model from "@/src/public/models/model";

export default class User extends Model {
  constructor(db_uri: string, db_name: string) {
    super(db_uri, db_name, "users");
  }

  async getUser(credentials: Logins): Promise<Users | null> {
    const collection = await this.getCollection();

    const client = new Security();
    credentials.email = client.encrypt(credentials.email);
    credentials.password = client.hash(credentials.password);

    let response = await collection.findOne({
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

  async getProfile(id: string): Promise<Profile | null> {
    const collection = await this.getCollection();

    let response = await collection.findOne({
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

  async createUser(registration: Registrations) {
    let collection = await this.getCollection();

    const client = new Security();
    registration.email = client.encrypt(registration.email);
    registration.password = client.hash(registration.password);

    let existing_user = await collection.findOne({ email: registration.email });
    if (existing_user) {
      return null;
    }

    let now = new Date();
    let document = await collection.insertOne({
      ...registration,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    return document;
  }

  async updateUser(profile: { id: string } & Profile) {
    let collection = await this.getCollection();

    let now = new Date();
    let document = await collection.updateOne(
      { _id: ObjectId.createFromBase64(profile.id) },
      {
        ...profile,
        updatedAt: now.toISOString(),
      }
    );
    return document;
  }
}
