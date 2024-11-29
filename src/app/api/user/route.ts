import Security from "@/public/utils/cryptography";
import { connect } from "@/public/utils/database";
import { Regsitrations } from "@/public/utils/types";

export async function POST(request: Request) {
  try {
    let response: Regsitrations = await request.json();
    let db = await connect();
    let collection = db.collection("users");

    const client = new Security();
    response.email = client.encrypt(response.email);
    response.password = client.hash(response.password);

    let user = await collection.findOne({ email: response.email });
    if (user) {
      return Response.json(
        { Message: "User Already Exists" },
        {
          status: 400,
        }
      );
    }

    let document = await collection.updateOne(
      { email: response.email },
      { $set: response },
      { upsert: true }
    );
    return Response.json(
      { Message: document },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      { Message: `User Error: ${error}` },
      {
        status: 500,
      }
    );
  }
}
