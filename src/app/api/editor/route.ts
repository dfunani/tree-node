import Editor from "@/src/public/models/editor";
import { Editor as ed } from "@/src/public/models/data_classes";
import { getDatabaseConfig } from "@/src/public/utils/factories";

export async function GET(request: Request) {
  try {
    let query = new URL(request.url);
    let id = query.searchParams.get("id");

    if (!id)
      return Response.json({ message: "Invalid User ID." }, { status: 400 });

    const { db_url, db_name } = getDatabaseConfig();
    const editor = new Editor(db_url, db_name);
    const response = await editor.get(id);

    if (!response) {
      return Response.json(
        { message: "No Editor Data Available for User ID." },
        { status: 404 }
      );
    }

    let user = ed.safeParse(response);
    if (!user.success) {
      console.log(`Editor Error: ${user.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Editor Error: ${error}`);
    return Response.json(
      { message: `Invalid Editor.` },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    let db = await connect();
    let collection = db.collection("nodes");
    let response = await request.json();
    let document = await collection.updateOne(
      { user_id: response.user_id },
      { $set: response },
      { upsert: true }
    );
    return Response.json({ message: document });
  } catch (error) {
    return Response.json({ message: `MongoDB Client Error${error}` });
  }
}

export async function DELETE(req: Request) {
  return Response.json({ M });
}
