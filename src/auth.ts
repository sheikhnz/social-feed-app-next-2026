import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { credentialsSignInSchema } from "@/lib/schemas/sign-in";

const { authSecret } = getServerEnv();

/**
 * Use an explicit secret when configured; otherwise Auth.js reads AUTH_SECRET / NEXTAUTH_SECRET itself.
 */
export const { handlers, auth, signOut } = NextAuth({
  ...(authSecret ? { secret: authSecret } : {}),
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSignInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    authorized: () => true,
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
