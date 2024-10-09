import { db } from "@/lib/db";
import { userProfile } from "@/schema/userprofile.schema";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { z } from "astro/zod";
import { ActionError } from "astro:actions";
import { defineAction } from "astro:actions";
import { eq } from "drizzle-orm";

export const userprofile = {
  updateUserProfile: defineAction({
    accept: "form",
    input: z.object({
      firstName: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long"),
      lastName: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long"),
      email: z.string().email("Invalid Email formet"),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
      address: z.string(),
      city: z.string(),
    }),
    handler: async (input, ctx) => {
      // console.log("input", input);
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      if (!ctx.locals.user?.id) {
        throw new ActionError({
          code: "UNAUTHORIZED",
        });
      }
      const existingUser = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, ctx.locals.user?.id));

      console.log("Existing User Data:", existingUser); // Log existing user data
      console.log("Input Data:", input); // Log input data to compare

      if (existingUser.length === 0) {
        // No user profile found, insert new profile
        await db.insert(userProfile).values({
          ...input,
          userId: ctx.locals.user?.id,
        });
      } else {
        // Update existing profile
        const updatedUser =  await db
          .update(userProfile)
          .set(input)
          .where(eq(userProfile.userId, ctx.locals.user?.id));
          console.log("Updated User:", updatedUser);
      }
      console.log("------------------------------------------");
      return true;
    },
  }),
};
