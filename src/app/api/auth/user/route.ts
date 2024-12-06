import User from "@/src/public/models/users";
import { Registrations } from "@/src/public/utils/types";

export async function GET(request: Request) {
  let query = new URL(request.url);
  let id = query.searchParams.get("id");

  if (!id)
    return Response.json({ Message: "User Does Not Exist" }, { status: 404 });

  let user = await User.getProfile(id);
  console.log(user);

  if (!user)
    return Response.json({ Message: "User Does Not Exist" }, { status: 404 });

  return Response.json({ Message: user }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    let response: Registrations = await request.json();

    let document = await User.createUser(response);

    if (!document) {
      return Response.json(
        { Message: "User Already Exists." },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      { Message: document },
      {
        status: 201,
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
