import { MongoClient } from "mongodb";

export async function connect() {
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