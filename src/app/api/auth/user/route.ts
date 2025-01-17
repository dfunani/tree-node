import User from "@/src/public/models/users";
import {
  UserProfile,
  PatchDetails,
  RegisterUser,
  FetchUser,
} from "@/src/public/models/data_classes/auth";
import { getDatabaseConfig } from "@/src/public/utils/factories";

/** Get User profile. */
export async function GET(request: Request) {
  const query = new URL(request.url);
  const id = query.searchParams.get("id");

  if (!id)
    return Response.json({ message: "Invalid User Request." }, { status: 400 });

  try {
    const { db_url, db_name } = getDatabaseConfig();

    const profile = await new User(db_url, db_name).getProfile(id);
    if (!profile)
      return Response.json(
        { message: "User Profile Does Not Exist" },
        { status: 404 }
      );

    const data = UserProfile.safeParse(profile);
    if (!data.success) {
      console.log(`User Error: ${data.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json(
      { message: { ...data }, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User Operation.` },
      {
        status: 500,
      }
    );
  }
}

/** Create/Register a New User. */
export async function POST(request: Request) {
  try {
    const response = await request.json();
    const registration = RegisterUser.safeParse(response);
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

    const user = await new User(db_url, db_name).createUser(registration.data);
    if (!user) {
      return Response.json(
        { message: "User Already Exists." },
        {
          status: 409,
        }
      );
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Respone: ${data.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: {
          ...data,
        },
        timestamp: new Date().toISOString(),
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

/** Update User profiles. */
export async function PATCH(request: Request) {
  try {
    const response = await request.json();
    const patchDetails = PatchDetails.safeParse(response);

    if (!patchDetails.success) {
      console.log(`Invalid User Request: ${patchDetails.error}`);
      return Response.json(
        { message: `Invalid User Update Request.` },
        {
          status: 400,
        }
      );
    }

    const { db_url, db_name } = getDatabaseConfig();

    const user = await new User(db_url, db_name).updateUser(
      patchDetails.data.id,
      patchDetails.data
    );

    if (!user) {
      return Response.json(
        { message: "Invalid User Request." },
        {
          status: 500,
        }
      );
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Respone: ${data.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: {
          ...data,
        },
        Timestamp: new Date().toISOString(),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User Operation.` },
      {
        status: 500,
      }
    );
  }
}

/** Delete Existing User. */
export async function DELETE(request: Request) {
  try {
    const { db_url, db_name } = getDatabaseConfig();
    const response = await request.json();

    const deleteUser = FetchUser.safeParse(response);
    if (!deleteUser.success) {
      console.log(`Invalid User Request: ${deleteUser.error}`);
      return Response.json(
        { message: "Invalid User Request." },
        { status: 500 }
      );
    }

    const user = await new User(db_url, db_name).delete(deleteUser.data.id);
    if (!user) {
      return Response.json(
        { message: "Invalid User Request." },
        {
          status: 500,
        }
      );
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`User Error: ${data.error}`);
      return Response.json(
        { message: "Invalid User Respone." },
        { status: 500 }
      );
    }

    return Response.json({
      message: { ...data },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`User Error: ${error}`);
    return Response.json(
      { message: `Invalid User Operation.` },
      {
        status: 500,
      }
    );
  }
}
