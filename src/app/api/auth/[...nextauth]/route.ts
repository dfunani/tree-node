// in app/api/auth/[...nextauth]/route.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth, { Account, Session } from "next-auth";
import User from "@/src/public/models/users";
import { now } from "next-auth/client/_utils";
import { Users } from "@/src/public/utils/types";
import { JWT } from "next-auth/jwt";
import Security from "@/src/public/utils/cryptography";

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

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: Users }) {
      // Persist the OAuth access_token and or the user id to the token right after signin

      return token;
    },
    async session({ session, token, user }: { session: Session; token: JWT, user: Users }) {
      // Send properties to the client, like an access_token and user id from a provider.
      const client = new Security();
      // let email = client.decrypt(user?.email);

      session.user = {
        email: session?.user?.email,
        isNewUser: user?.createdAt == user?.updatedAt,
        image: user?.image
      };
      console.log({session})
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
