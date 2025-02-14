import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { APIClient } from "@/src/public/models/api_client";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getDatabaseConfig } from "./factories";
import { AuthenticationError } from "../errors/auth";

export function validateEmail(email: string): boolean {
  // let reg = new RegExp(``, "i")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

function generateServerSession(response: Response) {
  return {
    ...response,
    getHeader: (name: string) => response.headers?.get(name),
    setHeader: (name: string, value: string) =>
      response.headers?.set(name, value),
  } as unknown as NextApiResponse;
}

async function authTokens(request: Request, response: Response) {
  const apiKey = request.headers.get("x-api-key");
  const token = request.headers.get("authorization");
  const session = await getServerSession(
    request as unknown as NextApiRequest,
    generateServerSession(response),
    authOptions
  );
  return { apiKey, token, session };
}

async function validateTokens(apiKey: string, token: string) {
  const { db_url, db_name } = getDatabaseConfig();

  const apiClient = new APIClient(db_url, db_name);

  if (apiKey) {
    await apiClient.validateAPIKey(apiKey as string);
  }

  if (token) {
    await apiClient.validateJWT(token);
  }
}

export async function validateAuthMethod(request: Request, response: Response) {
  const { apiKey, token, session } = await authTokens(request, response);

  if (!apiKey && !session && !token) {
    throw new AuthenticationError(
      "Unauthorized User Session. Please Login to Continue."
    );
  }

  if (!session) {
    await validateTokens(apiKey as string, token as string);
  }
}
