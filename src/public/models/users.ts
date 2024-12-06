import { connect } from "../utils/database";
import Security from "../utils/cryptography";
import { Logins, Profile, Registrations, Users } from "../utils/types";
import Registration from "@/src/components/registration";
import { ObjectId } from "mongodb";

export default class User {
  static async getCollection() {
    let db = await connect();
    let collection = db.collection("users");

    return collection;
  }

  static async getUser(credentials: Logins): Promise<Users | null> {
    const collection = await User.getCollection();

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

  static async getProfile(id: string): Promise<Profile | null> {
    const collection = await User.getCollection();

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

  static async createUser(registration: Registrations) {
    let collection = await User.getCollection();

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
}
