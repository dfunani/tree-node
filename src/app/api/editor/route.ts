import Editor from "@/src/public/models/editor";
import { getDatabaseConfig } from "@/src/public/utils/factories";
import { DeleteEditor, FetchEditor } from "@/src/public/models/data_classes/editor";

/** Get the Editor Nodes/Edges. */
export async function GET(request: Request) {
  let query = new URL(request.url);
  let id = query.searchParams.get("id");

  if (!id)
    return Response.json({ message: "Invalid Editor ID." }, { status: 400 });

  try {
    const { db_url, db_name } = getDatabaseConfig();
    const editor = await new Editor(db_url, db_name).get(id);
    if (!editor) {
      return Response.json(
        { message: "No Editor Data Available for User ID." },
        { status: 404 }
      );
    }

    let data = FetchEditor.safeParse(editor);
    if (!data.success) {
      console.log(`Editor Error: ${data.error}`);
      return Response.json(
        { message: "Invalid Editor Respone." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: { ...data },
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
    let response = await request.json();

    let editorData = FetchEditor.safeParse(response);
    if (!editorData.success) {
      console.log(`Editor Error: ${editorData.error}`);
      return Response.json(
        { message: "Invalid Editor Request." },
        { status: 500 }
      );
    }

    const { db_url, db_name } = getDatabaseConfig();
    const editor = await new Editor(db_url, db_name).update(
      editorData.data.user_id,
      editorData.data
    );
    if (!editor) {
      return Response.json(
        { message: "Invalid Editor Request." },
        {
          status: 500,
        }
      );
    }

    let data = DeleteEditor.safeParse(editor);
    if (!data.success) {
      console.log(`Invalid Editor Respone: ${data.error}`);
      return Response.json(
        { message: "Invalid Editor Respone." },
        { status: 500 }
      );
    }

    return Response.json({
      message: { ...data },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`Editor Error: ${error}`)
    return Response.json({ message: `Invalid Editor Operation.` });
  }
}

/** Delete Editor Nodes/Edges. */
export async function DELETE(request: Request) {
  try {
    let response = await request.json();
    let deleteEditor = DeleteEditor.safeParse(response);
    
    if (!deleteEditor.success) {
      console.log(`Editor Error: ${deleteEditor.error}`);
      return Response.json(
        { message: "Invalid Editor Request." },
        { status: 500 }
      );
    }
    const { db_url, db_name } = getDatabaseConfig();
    const editor = await new Editor(db_url, db_name).delete(deleteEditor.data.user_id);
    if (!editor) {
      return Response.json(
        { message: "Invalid Editor Request." },
        {
          status: 500,
        }
      );
    }

    let data = DeleteEditor.safeParse(editor);
    if (!data.success) {
      console.log(`Invalid Editor Response: ${data.error}`);
      return Response.json(
        { message: "Invalid Editor Respone." },
        { status: 500 }
      );
    }

    return Response.json({
      message: { ...data },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`Editor Error: ${error}`);
    return Response.json({ message: `Invalid Editor Operation.` });
  }
}
