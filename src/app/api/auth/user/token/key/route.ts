import { APIClient } from "@/src/public/models/api_client";
import { TokenGenration } from "@/src/public/models/data_classes/auth";
import User from "@/src/public/models/users";
import { getDatabaseConfig } from "@/src/public/utils/factories";

export async function GET(request: Request) {
  return new Response("Not Implemented", { status: 501 });
}

export async function POST(request: Request) {
  const response = await request.json();
  const credentials = TokenGenration.safeParse(response);
  if (!credentials.success) {
    return Response.json(
      { error: "Invalid Credentials.", text: credentials.error },
      { status: 400 }
    );
  }

  const { db_url, db_name } = getDatabaseConfig();

  const user = new User(db_url, db_name);
  const login = user.getUser(credentials.data);
  if (!login) {
    return Response.json({ error: "User Not Found." }, { status: 404 });
  }

  const profile = user.getProfile(credentials.data.user_id);
  if (!profile) {
    return Response.json({ error: "User Profile Not Found." }, { status: 404 });
  }

  const token = await new APIClient(db_url, db_name).createAPIKey(
    credentials.data.user_id,
    credentials.data.expires
  );
  if (!token) {
    return Response.json(
      { error: "Token Generation Failed." },
      { status: 500 }
    );
  }

  return Response.json({ message: token }, { status: 201 });
}
