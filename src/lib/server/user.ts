import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { userTable as users } from "@/schema/auth.schema"; // Assuming `users` table schema is defined here
import { generateIdFromEntropySize } from "lucia";

export async function createUser(
  googleId: string,
  email: string,
  username: string,
): Promise<User> {
    const userId = generateIdFromEntropySize(10)
  // Insert the new user and return the inserted user data
  const user = await db
    .insert(users)
    .values({id: userId, googleId, email, username })
    .returning({
      id: users.id,
      googleId: users.googleId,
      email: users.email,
      username: users.username,
    });

  if (!user || !user[0]) {
    throw new Error("Unexpected error");
  }

  return user[0];
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  // Select the user by googleId
  const [user] = await db
    .select({
      id: users.id,
      googleId: users.googleId,
      email: users.email,
      username: users.username,
    })
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);

  return user ?? null;
}

export interface User {
  id: string;
  email?: string;
  googleId: string;
  username?: string;
//   picture: string;
}
