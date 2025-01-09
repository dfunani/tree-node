import User from "@/src/public/models/users";
import {
  Profile,
  Registration,
  PatchDetails,
  Editor,
} from "@/src/public/models/data_classes";
import { getDatabaseConfig } from "@/src/public/utils/factories";

export async function GET(request: Request) {
  let query = new URL(request.url);
  let id = query.searchParams.get("id");

  if (!id)
    return Response.json({ message: "Invalid User Request." }, { status: 400 });

  try {
    const { db_url, db_name } = getDatabaseConfig();

    let response = await new User(db_url, db_name).getProfile(id);
    if (!response)
      return Response.json({ message: "User Does Not Exist" }, { status: 404 });

    let editor = Editor.safeParse(response);
    if (!editor.success) {
      console.log(`Editor Error: ${editor.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json({ message: editor }, { status: 200 });
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User ID.` },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    let response = await request.json();
    let registration = Registration.safeParse(response);
    if (!registration.success) {
      console.log(`Invalid User Request: ${registration.error}`);
      return Response.json(
        { message: `Invalid User Request.` },
        {
          status: 400,
        }
      );
    }

    const { db_url, db_name } = getDatabaseConfig();

    let document = await new User(db_url, db_name).createUser(
      registration.data
    );

    if (!document) {
      return Response.json(
        { message: "User Already Exists." },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        message: {
          id: document.insertedId,
          Timestamp: new Date().toISOString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User Registration.` },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    let response = request.json();
    let details = PatchDetails.safeParse(response);

    if (!details.success) {
      console.log(`Invalid User Request: ${details.error}`);
      return Response.json(
        { message: `Invalid User Update Request.` },
        {
          status: 400,
        }
      );
    }

    const { db_url, db_name } = getDatabaseConfig();

    let document = await new User(db_url, db_name).updateUser(details.data);

    if (!document) {
      return Response.json(
        { message: "Invalid User Request.." },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: {
          id: document.upsertedId,
          Timestamp: new Date().toISOString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User Authorization.` },
      {
        status: 500,
      }
    );
  }
}
