import { MongoClient } from "mongodb";
import { DatabaseError } from "@/src/public/errors/database";

export async function connection(uri: string, name: string) {
  const client = new MongoClient(uri);
  if (!client) {
    throw new DatabaseError("Database Client Error.");
  }

  const connect = await client.connect();
  if (!connect) {
    throw new Error("Database Connection Error.");
  }

  const db = connect.db(name);
  if (!db) {
    throw new Error("Database Name Error.");
  }

  return db;
}
