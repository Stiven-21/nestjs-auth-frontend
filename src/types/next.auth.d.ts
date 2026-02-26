import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string[];
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User {
    role?: string;
    permissions?: string[];
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    permissions?: string[];
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}
