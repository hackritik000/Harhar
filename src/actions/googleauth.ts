// src/pages/api/auth.astro
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/oauth";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
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

// Define the OAuth action
export const oauthGoogleAuth = {
  callback: defineAction({
    handler: async (_, context: ActionAPIContext) => {
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

  index: defineAction({
    handler: async (_, context: ActionAPIContext) => {
      console.log("ranjeet is calling me");
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
      ]);

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
      return new Response(null, {
        status: 200,
        headers: { Location: url.toString() },
      });
    },
  }),
};
