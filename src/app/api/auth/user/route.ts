import User from "@/src/public/models/users";
import {
  Profile,
  Registration,
  PatchDetails,
} from "@/src/public/models/data_classes";

export async function GET(request: Request) {
  let query = new URL(request.url);
  let id = query.searchParams.get("id");

  if (!id)
    return Response.json({ message: "Invalid User Request." }, { status: 400 });

  try {
    let response = await User.getProfile(id);
    if (!response)
      return Response.json({ message: "User Does Not Exist" }, { status: 404 });

    let user = Profile.safeParse(response);
    if (!user.success)
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );

    return Response.json({ message: user }, { status: 200 });
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
      return Response.json(
        { message: `Invalid User Request.` },
        {
          status: 400,
        }
      );
    }

    let document = await User.createUser(registration.data);

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
      return Response.json(
        { message: `Invalid User Update Request.` },
        {
          status: 400,
        }
      );
    }

    let document = await User.createUser(details.data);

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
  } catch (error) {}
}
