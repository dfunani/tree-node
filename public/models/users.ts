import { connect } from "../utils/database";
import Security from "../utils/cryptography";
import { Logins, Users } from "../utils/types";



export default class User {
  static async getUser(credentials: Logins): Promise<Users | null> {
    let db = await connect();
    let collection = db.collection("users");

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
    };
  }
}
