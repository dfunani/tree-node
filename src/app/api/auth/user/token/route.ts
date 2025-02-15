import { APIClient } from "@/src/public/models/api_client";
import { TokenGenration } from "@/src/public/models/data_classes/auth";
import { getDatabaseConfig, generateServerResponses } from "@/src/public/utils/factories";

export async function POST(request: Request) {
  const response = await request.json();
  const credentials = TokenGenration.safeParse(response);
  if (!credentials.success) {
    return generateServerResponses("Invalid User Request.", 400);
  }

  const { db_url, db_name } = getDatabaseConfig();
  const apiClient = new APIClient(db_url, db_name);

  const token = await apiClient.createJWT(credentials.data);
  if (!token) {
    return generateServerResponses("Token Generation Failed.", 500);
  }
  return generateServerResponses(token, 200);
}
