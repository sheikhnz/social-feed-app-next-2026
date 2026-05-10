import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
  }
}
