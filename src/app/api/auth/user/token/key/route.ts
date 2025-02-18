import { AuthenticationError } from "@/src/public/errors/auth";
import { APIClient } from "@/src/public/models/api_client";
import {
  APIKeyGeneration,
  APIKeyResponse,
  TokenGeneration,
} from "@/src/public/models/data_classes/auth";
import User from "@/src/public/models/users";
import {
  generateServerResponses,
  getDatabaseConfig,
  getIdFromRequest,
} from "@/src/public/utils/factories";
import { AuthService } from "@/src/public/models/auth";

export async function GET(request: Request, response: Response) {
  const id = getIdFromRequest(request);
  if (!id) {
    return generateServerResponses("Invalid User Request", 400);
  }

  try {
    await new AuthService(request, response).validateAuthMethod();;

    const { db_url, db_name } = getDatabaseConfig();
    const apiClient = new APIClient(db_url, db_name);
    const tokens = await apiClient.getAllAPIKey(id);
    if (!tokens) {
      return generateServerResponses("No Tokens to Retrieve.", 400);
    }

    return generateServerResponses(tokens, 200);
  } catch (error) {
    console.log(`API Key Error: ${error}`);

    if (error instanceof AuthenticationError) {
      return generateServerResponses("Unauthorized User Operations.", 403);
    }

    return generateServerResponses("Internal Server Error", 500);
  }
}

/** Create a new API Key. */
export async function POST(request: Request) {
  try {
    const response = await request.json();

    const credentials = TokenGeneration.safeParse(response);
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
    console.log(`API Key Error: ${error}`);
    return generateServerResponses("Internal Server Error.", 500);
  }
}

/** Deactivate/Delete APIKey */
export async function DELETE(request: Request, response: Response) {
  try {
    await new AuthService(request, response).validateAuthMethod();;
    const res = await request.json();

    const credentials = APIKeyGeneration.safeParse(res);
    if (!credentials.success) {
      return generateServerResponses("Invalid User Request.", 400);
    }

    const { db_url, db_name } = getDatabaseConfig();
    const apiClient = new APIClient(db_url, db_name);

    const key = await apiClient.deleteAPIKey(
      credentials.data.user_id,
      credentials.data.token
    );
    if (!key) {
      return generateServerResponses("API Key Deletion Failed.", 500);
    }

    const data = APIKeyResponse.safeParse(key);
    if (!data.success) {
      console.log(`API Key Error: ${data.error}`);
      return generateServerResponses("API Key Deletion Failed.", 500);
    }

    return generateServerResponses(data.data, 200);
  } catch (error) {
    console.log(`API Key Error: ${error}`);

    if (error instanceof AuthenticationError) {
      return generateServerResponses("Unauthorized API Key Operations.", 403);
    }

    return generateServerResponses("Internal Server Error.", 500);
  }
}
