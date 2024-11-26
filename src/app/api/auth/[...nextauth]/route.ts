// in app/api/auth/[...nextauth]/route.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth, { getServerSession, RequestInternal } from "next-auth";
import Security from "@/public/utils/cryptography";

const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials !== req.body) {
          return null;
        }
        if (!credentials || !credentials.email || credentials.password) {
          return null;
        }

        const hash = new Security().encrypt(credentials.password);
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
