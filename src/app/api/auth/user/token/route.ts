import { TokenGenration } from "@/src/public/models/data_classes/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const response = await request.json();
  const credentials = TokenGenration.safeParse(response);
  if (!credentials.success) {
    return Response.json({ message: "Invalid User Request." }, { status: 400 });
  }

  const now = new Date();
  const expires = 30 * 60;
  const exp = now.getTime() + expires * 1000;
  const expiresAt = new Date(exp);

  const payload = {
    sub: process.env.DB_NAME,
    user_id: credentials.data.user_id,
    email: credentials.data.email,
    password: credentials.data.password,
    iat: now.getTime(),
    exp: exp,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return Response.json(
    { message: { token, expires, expiresAt }, timestamp: now },
    { status: 200 }
  );
}
