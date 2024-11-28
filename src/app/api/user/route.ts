import Security from "@/public/utils/cryptography";
import { Regsitration } from "@/public/utils/types";
import { MockPostData } from "@/tests/mock";
import { MongoClient } from "mongodb";
import { redirect } from "next/navigation";

async function connect() {
  const uri = `mongodb+srv://${process.env.username}:${process.env.password}@${process.env.db_host}/?retryWrites=true&w=majority&appName=${process.env.db_name}`;
  let db_name = "tree_node";

  const client = new MongoClient(uri);
  if (!client) {
    throw new Error("Mongo Client Error.");
  }

  let connection = await client.connect();
  if (!connection) {
    throw new Error("Mongo Connection Error.");
  }

  let db = connection.db(db_name);
  if (!db) {
    throw new Error("Mongo DB Name Error.");
  }

  return db;
}

export async function GET(request: Request) {
  try {
    let db = await connect();
    let collection = db.collection("nodes");
    if (request.body && "user_id" in request.body) {
      let id = request.body["user_id"];
      let response = await collection.findOne({ user_id: id });
      return Response.json({ Message: response });
    }
    return Response.json({
      Message: [{ user_id: null, nodes: [], edges: [] }],
    });
  } catch (error) {
    return Response.json({ Message: `MongoDB Client Error${error}` });
  }
}

export async function POST(request: Request) {
  try {
    let response = await request.json();
    console.log(response);
    let db = await connect();
    let collection = db.collection("users");

    let user = await collection.findOne({ email: response.email });
    if (user) {
      return Response.json(
        { Message: "User Already Exists" },
        {
          status: 400,
        }
      );
    }

    response.password = new Security().encrypt(response.password)

    let document = await collection.updateOne(
      { email: response.email },
      { $set: response },
      { upsert: true }
    );
    return Response.json(
      { Message: document },
      {
        status: 200,
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
