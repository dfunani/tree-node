import { LoginUser, Credentials } from "@/src/public/models/data_classes/auth";
import User from "@/src/public/models/users";
import Security from "@/src/public/utils/cryptography";
import { getDatabaseConfig, generateServerResponses } from "@/src/public/utils/factories";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/route";

/** Retrieves Login Details. */
export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const apiKey = request.headers.get("x-api-key");
  const session = await getServerSession(request, response, authOptions);
  console.log(session)
  if (!session) {
    return generateServerResponses(response, "Invalid User Session.", 401);
  }

  // if(!apiKey || !(apiKey i) ) {
  try {
    const response = await request.json();
    const credentials = Credentials.safeParse(response);
    if (!credentials.success) {
      return generateServerResponses(response, "Invalid User Request.", 400);
    }

    const { db_url, db_name } = getDatabaseConfig();
    
    const user = await new User(db_url, db_name).getUser(credentials.data);
    if (!user)
      return generateServerResponses(response, "User Does Not Exist", 404);

    const data = LoginUser.safeParse(user);
    if (!data.success) {
      console.log(`Invalid User Response: ${data.error}`);
      return generateServerResponses(response, "Invalid User Response.", 500);
    }

    const client = new Security();
    data.data.email = client.decrypt(data.data.email);
    data.data.password = "**********";

    return generateServerResponses(response, { ...data }, 200);
  } catch (error) {
    console.log(`User Error: ${error}`);
    return generateServerResponses(response, "Invalid User Operation.", 500);
  }
}
