import { APIClient } from "@/src/public/models/api_client";
import { TokenGenration } from "@/src/public/models/data_classes/auth";
import { getDatabaseConfig } from "@/src/public/utils/factories";

export async function POST(request: Request) {
  const response = await request.json();
  const credentials = TokenGenration.safeParse(response);
  if (!credentials.success) {
    return Response.json({ message: "Invalid User Request." }, { status: 400 });
  }

  const { db_url, db_name } = getDatabaseConfig();
  const apiClient = new APIClient(db_url, db_name);

  const token = await apiClient.createJWT(credentials.data);
  if (!token) {
    return Response.json(
      { message: "Token Generation Failed." },
      { status: 500 }
    );
  }
  return Response.json(
    { message: token, timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
