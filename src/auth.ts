import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, UserLogged } from "@/interfaces/auth.interface";
import { deleteCookie } from "@/action/cookie";
import { parsePermissions } from "@/utils/permission";
import { refreshAccessToken } from "@/services/auth/auth-post.service";
import { me } from "@/services/user/user-get.service";

async function RAT(token: string) {
  try {
    const { data: refreshToken } = await refreshAccessToken(token);
    if (!refreshToken) return null;

    const { data: userShow } = await me(refreshToken.access_token as string);
    if (!userShow) return null;
    console.log(userShow);

    const user = {
      name: userShow.name + " " + userShow.lastname,
      email: userShow.email,
      role: userShow.role.name,
      permissions: parsePermissions(userShow.role.permissions),
    };

    return {
      ...user,
      accessToken: refreshToken.access_token,
      refreshToken: refreshToken.refresh_token,
    };
  } catch (error) {
    console.error("RAT error:", error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Backend",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      authorize: async (credentials) => {
        if (credentials?.token) {
          await deleteCookie("refresh_token");
          return RAT(credentials.token as string);
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as UserLogged).role;
        token.permissions = (user as UserLogged).permissions;
        token.accessToken = (user as UserLogged).accessToken;
        token.refreshToken = (user as UserLogged).refreshToken;
        return token;
      }

      if (token.accessToken) {
        try {
          const decoded: DecodedToken = jwtDecode(token.accessToken as string);
          const now = Math.floor(Date.now() / 1000);

          if (decoded.exp > now) {
            return token;
          }
        } catch (error) {
          console.error("jwt error:", error);
        }
      }

      if (token.refreshToken) {
        const refreshed = await RAT(token.refreshToken as string);

        if (!refreshed) {
          token.error = "RefreshTokenExpired";
        }

        if (refreshed) {
          token.accessToken = refreshed.accessToken;
          token.refreshToken = refreshed.refreshToken;
          token.role = refreshed.role;
          token.permissions = refreshed.permissions;
          return token;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.permissions = token.permissions as string[];
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;

      if (session.error) {
        await signOut();
      }

      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname === "/") return true;
      if (nextUrl.pathname.startsWith("/auth/verify-email/")) return true;
      const isLoggedIn = !!auth?.user;
      const isPublicRoute =
        nextUrl.pathname.startsWith("/auth/sign-in") ||
        nextUrl.pathname.startsWith("/auth/sign-up") ||
        nextUrl.pathname.startsWith("/auth/callback");

      if (isLoggedIn && isPublicRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL("/auth/sign-in", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
});
