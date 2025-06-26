import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { encode as jwtEncode } from "next-auth/jwt";
import { db } from "~/server/db";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const adapter = PrismaAdapter(db);
export const authConfig = {
  providers: [
    GoogleProvider,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials.email) {
          throw new InvalidLoginError();
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) {
          throw new InvalidLoginError();
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) {
          throw new InvalidLoginError();
        }
        return user;
      },
    }),
  ],
  adapter,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    jwt: async ({ token, account }) => {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID in token");
        }

        const session = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!session) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return jwtEncode(params);
    },
  },
} satisfies NextAuthConfig;
