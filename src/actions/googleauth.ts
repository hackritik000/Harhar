// src/pages/api/auth.astro
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/oauth";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
  invalidateSession,
  deleteSessionTokenCookie,
} from "@/lib/server/session";
import {
  defineAction,
  ActionError,
  type ActionAPIContext,
} from "astro:actions";
import type { OAuth2Tokens } from "arctic";
import createUser, {
  getUserFromGoogleId,
  type GoogleIdTokenClaims,
} from "@/lib/server/user";
import { z } from "astro:schema";
// Define the OAuth action
export const oauthGoogleAuth = {
  callback: defineAction({
    accept: "json",
    input: z.object({}),
    handler: async (_, context: ActionAPIContext) => {
      console.log("hello");

      const code = context.url.searchParams.get("code");
      const state = context.url.searchParams.get("state");
      const storedState =
        context.cookies.get("google_oauth_state")?.value ?? null;
      const codeVerifier =
        context.cookies.get("google_code_verifier")?.value ?? null;

      if (!storedState || state !== storedState) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "State mismatch error",
        });
      }

      if (!codeVerifier || !code) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Missing code verifier",
        });
      }

      let tokens: OAuth2Tokens;
      try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
      } catch (error) {
        console.error(error);
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Failed to validate the authorization code",
        });
      }

      const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;
      const googleUserId = claims.sub;
      const email = claims.email;
      const username = claims.name;

      if (!email || !username || googleUserId) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });
      }

      const existingUser = await getUserFromGoogleId(googleUserId); // Replace with actual DB query
      if (existingUser !== null) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id);
        setSessionTokenCookie(context, sessionToken, session.expiresAt);
        return new Response(null, { status: 200, headers: { Location: "/" } });
      }

      // Create new user and session if the user doesn't exist
      const user = await createUser(googleUserId, email, username); // Replace with actual DB query
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, user.id);
      setSessionTokenCookie(context, sessionToken, session.expiresAt);
      return new Response(null, { status: 200, headers: { Location: "/" } });
    },
  }),

  googlelogin: defineAction({
    accept: "form",
    input: z.object({}),
    handler: async (
      _,
      context: ActionAPIContext,
    ): Promise<{ redirectUrl: string }> => {
      console.log("Initiating Google login");

      // Generate state and code verifier
      const state = generateState();
      const codeVerifier = generateCodeVerifier();

      // Generate Google OAuth authorization URL
      const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
      ]);

      // Set cookies for state and code verifier
      context.cookies.set("google_oauth_state", state, {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
      });
      context.cookies.set("google_code_verifier", codeVerifier, {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
      });

      // Return the URL as a JSON response
      return { redirectUrl: url.toString() };
    },
  }),

  logout: defineAction({
    handler: async (_, context: ActionAPIContext) => {
      if (context.locals.session === null) {
        return new Response(null, {
          status: 401,
        });
      }
      await invalidateSession(context.locals.session.id);
      deleteSessionTokenCookie(context);
      return new Response(null, {
        status: 200,
        headers: { Location: "/login" },
      });
    },
  }),
};
