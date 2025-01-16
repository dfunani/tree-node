import Editor from "@/src/public/models/editor";
import {
  Delete,
  Editor as ed,
  RegisterUser,
} from "@/src/public/models/data_classes";
import { getDatabaseConfig } from "@/src/public/utils/factories";

/** Get the Editor Nodes/Edges. */
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
        message: { ...user },
        Timestamp: new Date().toISOString(),
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

/** Save Editor Nodes/Edges. */
export async function POST(request: Request) {
  try {
    const { db_url, db_name } = getDatabaseConfig();
    const editor = new Editor(db_url, db_name);

    let response = await request.json();
    let user = ed.safeParse(response);
    if (!user.success) {
      console.log(`Editor Error: ${user.error}`);
      return Response.json(
        { message: "Invalid Editor Request." },
        { status: 500 }
      );
    }

    let document = await editor.update(response.user_id, response);
    if (!document) {
      return Response.json(
        { message: "Invalid Editor Request." },
        {
          status: 500,
        }
      );
    }

    let result = RegisterUser.safeParse(document);
    if (!result.success) {
      console.log(`User Error: ${result.error}`);
      return Response.json(
        { message: "Invalid Editor Respone." },
        { status: 500 }
      );
    }

    return Response.json({
      message: { ...result },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ message: `Invalid Editor Authorization.` });
  }
}

/** Delete Editor Nodes/Edges. */
export async function DELETE(request: Request) {
  try {
    const { db_url, db_name } = getDatabaseConfig();
    const editor = new Editor(db_url, db_name);

    let response = await request.json();
    let user = Delete.safeParse(response);
    if (!user.success) {
      console.log(`Editor Error: ${user.error}`);
      return Response.json(
        { message: "Invalid User Request." },
        { status: 500 }
      );
    }

    let document = await editor.delete(response.user_id);
    if (!document) {
      return Response.json(
        { message: "Invalid Editor Request." },
        {
          status: 500,
        }
      );
    }

    let result = RegisterUser.safeParse(document);
    if (!result.success) {
      console.log(`User Error: ${result.error}`);
      return Response.json(
        { message: "Invalid Editor Respone." },
        { status: 500 }
      );
    }

    return Response.json({
      message: { ...result },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ message: `Invalid Editor Authorization.` });
  }
}
