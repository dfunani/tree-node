// in app/api/auth/[...nextauth]/route.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth, { Account, Session, DefaultSession } from "next-auth";
import User from "@/src/public/models/users";
import { DefaultJWT, JWT } from "next-auth/jwt";
import Security from "@/src/public/utils/cryptography";
import { AdapterUser } from "next-auth/adapters";
import { Users } from "@/src/public/utils/types";

type TokenProps = {
  token: JWT;
  user: AdapterUser | User; // Remove the extra properties from the user object
};

type SessionProps = {
  session: Session;
  token: JWT;
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      isNewUser: boolean;
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
    isNewUser: boolean;
    accessToken: string;
  }
}

const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        let user = await User.getUser(credentials);
        if (!user) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: TokenProps) {
      let client = new Security();
      token.accessToken = client.hash("Hello World");
      if (user && "updatedAt" in user && "createdAt" in user) {
        token.id = user.id;
        token.isNewUser = user.createdAt == user.updatedAt;
      }

      return token;
    },
    async session({ session, token }: SessionProps) {
      const client = new Security();
      if (session.user?.email) {
        session.user.email = client.decrypt(session.user?.email);
      }

      session.user.isNewUser = token?.isNewUser as boolean;
      session.user.id = token.id as string;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
