import { AuthenticationError } from "@/src/public/errors/auth";
import { APIClient } from "@/src/public/models/api_client";
import { TokenGenration } from "@/src/public/models/data_classes/auth";
import User from "@/src/public/models/users";
import {
  generateServerResponses,
  getDatabaseConfig,
} from "@/src/public/utils/factories";

export async function POST(request: Request) {
  try {
    const response = await request.json();

    const credentials = TokenGenration.safeParse(response);
    if (!credentials.success) {
      return generateServerResponses("Invalid User Request.", 400);
    }

    const { db_url, db_name } = getDatabaseConfig();
    const user = new User(db_url, db_name);

    const login = await user.getUser(credentials.data);
    if (!login) {
      return generateServerResponses("User Does Not Exist", 404);
    }

    const profile = await user.getProfile(credentials.data.user_id);
    if (!profile) {
      return generateServerResponses("User Profile Does Not Exist", 404);
    }

    const apiClient = new APIClient(db_url, db_name);
    const token = await apiClient.createAPIKey(
      credentials.data.user_id,
      credentials.data.expires
    );
    if (!token) {
      generateServerResponses("Failed to Generate Token", 500);
    }

    return generateServerResponses(token, 201);
  } catch (error) {
    console.log(`User Error: ${error}`);
    return generateServerResponses("Invalid User Operation.", 500);
  }
}
