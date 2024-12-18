import { Authorize, Credentials } from "@/src/public/models/data_classes";
import User from "@/src/public/models/users";
import Security from "@/src/public/utils/cryptography";

export async function POST(request: Request) {
  try {
    let response = await request.json();
    let credentials = Credentials.safeParse(response);
    if (!credentials.success) {
      console.log(`Invalid User Request: ${credentials.error}`);
      return Response.json(
        { message: "Invalid User Request." },
        { status: 400 }
      );
    }

    let user = await User.getUser(credentials.data);
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

    return Response.json({ message: data.data }, { status: 200 });
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
