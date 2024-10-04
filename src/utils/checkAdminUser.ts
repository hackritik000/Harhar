import { db } from "@/lib/db";
import { userTable } from "@/schema/auth.schema";
import { eq } from "drizzle-orm";

export const checkAdminUser = async (userId: string): Promise<boolean> => {
  const getUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));
  if (getUser.at(0)?.isAdmin) {
    return true;
  }
  return false;
};
