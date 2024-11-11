// src/pages/api/auth.astro
import { generateState, generateCodeVerifier, decodeIdToken } from "arctic";
import { google } from "@/lib/oauth";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { defineAction, ActionError } from "astro:actions";
import type { OAuth2Tokens } from "arctic";
import type { APIContext } from "astro:schema";
import { z } from "astro:schema";
import { createUser, getUserFromGoogleId } from "@/lib/server/user";
// import { createUser} from "@/lib/server/user"

// Define the OAuth action
export const oauthGoogleAuth = defineAction({
  input: z.object({
    code: z.string().nonempty("Authorization code is required"),
    state: z.string().nonempty("State parameter is required"),
  }),
  handler: async (input, context: APIContext) => {
    const { code, state } = context.searchParams.get("code");
    const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
    const codeVerifier = context.cookies.get("google_code_verifier")?.value ?? null;

    if (!storedState || state !== storedState) {
      throw new ActionError({
        code: "STATE_MISMATCH",
        message: "State mismatch error",
      });
    }

    if (!codeVerifier) {
      throw new ActionError({
        code: "MISSING_CODE_VERIFIER",
        message: "Missing code verifier",
      });
    }

    let tokens: OAuth2Tokens;
    try {
      tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (error) {
      throw new ActionError({
        code: "TOKEN_VALIDATION_FAILED",
        message: "Failed to validate the authorization code",
      });
    }

    const claims = decodeIdToken(tokens.idToken());
    const googleUserId = claims.sub;
    const username = claims.name;

    const existingUser = await getUserFromGoogleId(googleUserId); // Replace with DB query
    const sessionToken = generateSessionToken();
    const userId = existingUser ? existingUser.id : (await createUser(googleUserId, username)).id;

    const session = await createSession(sessionToken, userId);
    setSessionTokenCookie(context, sessionToken, session.expiresAt);

    return new Response(null, { status: 302, headers: { Location: "/" } });
  },
});
