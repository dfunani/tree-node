import { Session, DefaultSession, User } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { StaticImageData } from "next/image";

export type TokenProps = {
  token: JWT;
  user:
    | AdapterUser
    | (User & {
        id: string;
        createdAt?: string;
        updatedAt?: string;
      });
};

export type SessionProps = {
  session: Session;
  token: JWT;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      isNewUser: boolean;
      id: string;
      email: string;
    } & Omit<DefaultSession["user"], "image">;
  }

  interface JWT extends DefaultJWT {
    id: string;
    isNewUser: boolean;
    accessToken: string;
  }
}

export type UpdateNodeProfile = {
  name?: string;
  surname?: string;
  dob?: string;
  city?: string;
  country?: string;
  image?: string | null | StaticImageData;
};