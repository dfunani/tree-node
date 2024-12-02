import { connect } from "../utils/database";
import Security from "../utils/cryptography";
import { Logins, Registrations, Users } from "../utils/types";

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
      name: response.name,
      surname: response.surname,
      dob: response.dob,
      city: response.city,
      country: response.country,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      image: response.image
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
