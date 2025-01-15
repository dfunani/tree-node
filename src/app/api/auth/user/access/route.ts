import { Authorize, Credentials } from "@/src/public/models/data_classes";
import User from "@/src/public/models/users";
import Security from "@/src/public/utils/cryptography";
import { getDatabaseConfig } from "@/src/public/utils/factories";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let response = await request.json();
    let credentials = Credentials.safeParse(response);
    if (!credentials.success) {
      return Response.json(
        { message: "Invalid User Request." },
        { status: 400 }
      );
    }

    const { db_url, db_name } = getDatabaseConfig();

    let user = await new User(db_url, db_name).getUser(credentials.data);
    if (!user)
      return Response.json({ message: "User Does Not Exist" }, { status: 404 });

    let data = Authorize.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Response: ${data.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    const client = new Security();
    data.data.email = client.decrypt(data.data.email);
    data.data.password = "**********";

    return Response.json(
      { message: { ...data }, Timestamp: new Date().toISOString()},
      { status: 200 }
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
