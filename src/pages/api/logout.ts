import { deleteSessionTokenCookie } from "@/lib/server/session";
import { db } from "@/lib/db"; // Import Drizzle ORM setup
import { sessionTable as sessions } from "@/schema/auth.schema"; // Assuming `sessions` is the Drizzle schema for the sessions table
import type { APIContext } from "astro";
import { eq } from 'drizzle-orm';

// Define a new function to invalidate the session in the database
async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id,sessionId));
}

export async function POST(context: APIContext): Promise<Response> {
  if (context.locals.session === null) {
    return new Response(null, { status: 401 });
  }

  const sessionId = context.locals.session.id;

  // Invalidate the session in the database
  await invalidateSession(sessionId);

  // Delete the session token cookie to log the user out
  deleteSessionTokenCookie(context);

  return new Response();
}
