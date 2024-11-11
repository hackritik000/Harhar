// import { generateState, generateCodeVerifier, decodeIdToken } from "arctic";
// import { google } from "@/lib/oauth"; // Make sure this is the correct import path for the Google instance
// import {
//   generateSessionToken,
//   createSession,
//   setSessionTokenCookie,
// } from "@/lib/server/session";
// import type { APIContext } from "astro";
// import type { OAuth2Tokens } from "arctic";
// import { getUserFromGoogleId } from "@/lib/server/user";

// export async function GET(context: APIContext): Promise<Response> {
//   const code = context.url.searchParams.get("code");
//   const state = context.url.searchParams.get("state");

//   // Retrieve cookies for state and code verifier
//   const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
//   const codeVerifier =
//     context.cookies.get("google_code_verifier")?.value ?? null;

//   // Log for debugging
//   console.log("Code:", code);

//   console.log("Received state:", state);
//   console.log("Stored state:", storedState);
//   console.log("Code verifier:", codeVerifier);

//   // Validation checks
//   if (!code || !state || !storedState || !codeVerifier) {
//     console.error("Missing or invalid request parameters");
//     return new Response("Invalid request parameters", { status: 400 });
//   }
//   if (state !== storedState) {
//     console.error("State mismatch error");
//     return new Response("State mismatch", { status: 400 });
//   }

//   let tokens: OAuth2Tokens;
//   try {
//     // Exchange authorization code for tokens
//     tokens = await google.validateAuthorizationCode(code, codeVerifier);
//   } catch (error) {
//     console.error("Error during token validation:", error);
//     return new Response("Authentication failed", { status: 500 });
//   }

//   // Decode ID token to get user information
//   const claims = decodeIdToken(tokens.idToken());
//   const googleUserId = claims.sub;
//   const username = claims.name;

//   // Check if the user exists, create a new user if not
//   const existingUser = await getUserFromGoogleId(googleUserId); // Replace with actual DB query
//   if (existingUser !== null) {
//     const sessionToken = generateSessionToken();
//     const session = await createSession(sessionToken, existingUser.id);
//     setSessionTokenCookie(context, sessionToken, session.expiresAt);
//     return context.redirect("/");
//   }

//   // Create new user and session if the user doesn't exist
//   const user = await createUser(googleUserId, username); // Replace with actual DB query
//   const sessionToken = generateSessionToken();
//   const session = await createSession(sessionToken, user.id);
//   setSessionTokenCookie(context, sessionToken, session.expiresAt);
//   return context.redirect("/");
// }
