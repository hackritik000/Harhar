import { db } from "@/lib/db";
import {
  sessionTable as session,
  userTable as user,
} from "@/schema/auth.schema";
import { eq, and, lt } from "drizzle-orm";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { User } from "@/lib/server/user";
import type { APIContext } from "astro";
import type { ActionAPIContext } from "astro:actions";

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [row] = await db
    .select({
      sessionId: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      googleId: user.googleId,
      email: user.email,
      username: user.username,
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(eq(session.id, sessionId));

  if (!row) {
    return { session: null, user: null };
  }

  const sessionData = {
    id: row.sessionId,
    userId: row.userId,
    expiresAt: row.expiresAt,
  };
  const userData = {
    id: row.userId,
    googleId: row.googleId,
    email: row.email,
    username: row.username,
  };

  if (Date.now() >= sessionData.expiresAt.getTime()) {
    await db.delete(session).where(eq(session.id, sessionData.id));
    return { session: null, user: null };
  }

  // Extend session expiration if within 15 days of expiry
  if (
    Date.now() >=
    sessionData.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
  ) {
    sessionData.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(session)
      .set({ expiresAt: sessionData.expiresAt })
      .where(eq(session.id, sessionData.id));
  }

  return { session: sessionData, user: userData };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(session).where(eq(session.id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await db.delete(session).where(eq(session.userId, userId));
}

export function setSessionTokenCookie(
  context: ActionAPIContext,
  token: string,
  expiresAt: Date,
): void {
  context.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(context: APIContext): void {
  context.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  return encodeBase32(tokenBytes).toLowerCase();
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db.insert(session).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return { id: sessionId, userId, expiresAt };
}

export interface Session {
  id: string;
  expiresAt: Date;
  userId: string;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
