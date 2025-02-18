import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { APIClient } from "@/src/public/models/api_client";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getDatabaseConfig } from "@/src/public/utils/factories";
import { AuthenticationError } from "@/src/public/errors/auth";

export class AuthService {
  request: Request;
  response: Response;

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }

  generateServerSession() {
    return {
      ...this.response,
      getHeader: (name: string) => this.response.headers?.get(name),
      setHeader: (name: string, value: string) =>
        this.response.headers?.set(name, value),
    } as unknown as NextApiResponse;
  }

  async #authTokens() {
    const apiKey = this.request.headers.get("x-api-key");
    const token = this.request.headers.get("authorization");
    const session = await getServerSession(
      this.request as unknown as NextApiRequest,
      this.generateServerSession(),
      authOptions
    );
    return { apiKey, token, session };
  }

  async #validateTokens(apiKey: string, token: string) {
    const { db_url, db_name } = getDatabaseConfig();

    const apiClient = new APIClient(db_url, db_name);

    if (apiKey) {
      await apiClient.validateAPIKey(apiKey as string);
    }

    if (token) {
      await apiClient.validateJWT(token);
    }
  }

  async validateAuthMethod() {
    const { apiKey, token, session } = await this.#authTokens();

    if (!apiKey && !session && !token) {
      throw new AuthenticationError(
        "Unauthorized User Session. Please Login to Continue."
      );
    }

    if (!session) {
      await this.#validateTokens(apiKey as string, token as string);
    }
  }
}
