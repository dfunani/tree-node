// in app/api/auth/[...nextauth]/route.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth, { Account, Session, DefaultSession } from "next-auth";
import User from "@/src/public/models/users";
import { JWT } from "next-auth/jwt";
import Security from "@/src/public/utils/cryptography";
import { AdapterUser } from "next-auth/adapters";
import { Users } from "@/src/public/utils/types";

type TokenProps = {
  token: JWT;
  user: AdapterUser | User;
  account: Account | null;
};

type SessionProps = {
  session: Session;
  token: JWT;
  user: AdapterUser;
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
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    createdAt: string;
    updatedAt: string;
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
    async jwt({ token }: TokenProps) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      token.picture = null;
      
      return token;
    },
    async session({ session, token, user }: SessionProps) {
      // Send properties to the client, like an access_token and user id from a provider.
      console.log(token)
      const client = new Security();
      if (session.user?.email) {
        session.user.email = client.decrypt(session.user?.email);
      }

      session.user.isNewUser = user?.createdAt == user?.updatedAt;
      session.user.id = user?.id;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
