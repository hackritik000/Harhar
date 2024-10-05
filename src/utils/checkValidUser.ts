import { db } from "@/lib/db";
import { businessDetails } from "@/schema/business.schema";
import { eq } from "drizzle-orm";
export const checkValidUser = async (
  userId: string,
  businessId: string,
): Promise<boolean> => {
  // console.log("_____okkkk",userId)
  if (!userId) {
    return false;
  }
  const isOwner = await db
    .select()
    .from(businessDetails)
    .where(eq(businessDetails.id, businessId));
  if (!isOwner) {
    return false;
  }
  if (isOwner.at(0)?.userId == userId) {
    return true;
  }
  return false;
};
