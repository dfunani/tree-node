import User from "@/src/public/models/users";
import { Registrations } from "@/src/public/utils/types";

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
