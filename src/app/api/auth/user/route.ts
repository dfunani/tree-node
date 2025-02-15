import User from "@/src/public/models/users";
import {
  UserProfile,
  PatchDetails,
  RegisterUser,
  FetchUser,
} from "@/src/public/models/data_classes/auth";
import {
  getDatabaseConfig,
  generateServerResponses,
  getIdFromRequest,
} from "@/src/public/utils/factories";

import { AuthenticationError } from "@/src/public/errors/auth";
import { validateAuthMethod } from "@/src/public/utils/validators";

/** Get User profile. */
export async function GET(request: Request, response: Response) {
  const id = getIdFromRequest(request);
  if (!id) return generateServerResponses("Invalid User Request.", 400);

  try {
    await validateAuthMethod(request, response);
    const { db_url, db_name } = getDatabaseConfig();

    const profile = await new User(db_url, db_name).getProfile(id);
    if (!profile)
      return generateServerResponses("User Profile Does Not Exist", 404);

    const data = UserProfile.safeParse(profile);
    if (!data.success) {
      console.log(`User Error: ${data.error}`);
      return generateServerResponses("Invalid User Response.", 500);
    }

    return generateServerResponses({ ...data }, 200);
  } catch (error) {
    console.log(`User Error: ${error}`);
    if (error instanceof AuthenticationError) {
      return generateServerResponses("Unauthorized User Operations.", 403);
    }
    return generateServerResponses("Invalid User Operation.", 500);
  }
}

/** Create/Register a New User. */
export async function POST(request: Request) {
  try {
    const response = await request.json();
    const registration = RegisterUser.safeParse(response);
    if (!registration.success) {
      console.log(`Invalid User Request: ${registration.error}`);
      return generateServerResponses("Invalid User Request.", 400);
    }

    const { db_url, db_name } = getDatabaseConfig();

    const user = await new User(db_url, db_name).createUser(registration.data);
    if (!user) {
      return generateServerResponses("User Already Exists.", 409);
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Response: ${data.error}`);
      return generateServerResponses("Invalid User Response.", 500);
    }

    return generateServerResponses({ ...data }, 201);
  } catch (error) {
    console.log(`User Error: ${error}`);
    return generateServerResponses("Invalid User Registration.", 500);
  }
}

/** Update User profiles. */
export async function PATCH(request: Request) {
  try {
    const response = await request.json();
    const patchDetails = PatchDetails.safeParse(response);

    if (!patchDetails.success) {
      console.log(`Invalid User Request: ${patchDetails.error}`);
      return generateServerResponses("Invalid User Update Request.", 400);
    }

    const { db_url, db_name } = getDatabaseConfig();

    const user = await new User(db_url, db_name).updateUser(
      patchDetails.data.id,
      patchDetails.data
    );

    if (!user) {
      return generateServerResponses("Invalid User Request.", 500);
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Response: ${data.error}`);
      return generateServerResponses("Invalid User Response.", 500);
    }

    return generateServerResponses({ ...data }, 200);
  } catch (error) {
    console.log(`User Error: ${error}`);
    return generateServerResponses("Invalid User Operation.", 500);
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
      return generateServerResponses("Invalid User Request.", 500);
    }

    const user = await new User(db_url, db_name).delete(deleteUser.data.id);
    if (!user) {
      return generateServerResponses("Invalid User Request.", 500);
    }

    const data = FetchUser.safeParse(user);
    if (!data.success) {
      console.log(`User Error: ${data.error}`);
      return generateServerResponses("Invalid User Response.", 500);
    }

    return generateServerResponses({ ...data }, 200);
  } catch (error) {
    console.log(`User Error: ${error}`);
    return generateServerResponses("Invalid User Operation.", 500);
  }
}
