// in app/api/auth/[...nextauth]/route.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import User from "@/src/public/models/users";

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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
