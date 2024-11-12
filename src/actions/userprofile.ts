import type { NewApiContext } from "@/interface/extended.interface";
import { uploadImage } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { userProfile } from "@/schema/userprofile.schema";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { z } from "astro/zod";
import { ActionError } from "astro:actions";
import { defineAction } from "astro:actions";
import { eq, or } from "drizzle-orm";

export const userprofile = {
  updateUserProfile: defineAction({
    accept: "form",
    input: z.object({
      firstName: z.string(),
      // .min(3, "Username must be at least 3 characters long")
      // .max(30, "Username must be at most 30 characters long"),
      lastName: z.string(),
      // .min(3, "Username must be at least 3 characters long")
      // .max(30, "Username must be at most 30 characters long"),
      email: z.string(),
      // .email("Invalid Email formet"),
      phone: z.string(),
      // .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
      address: z.string(),
      city: z.string(),
      userProfileImg: z.instanceof(File),
    }),
    handler: async (input, ctx) => {
      console.log("hello1");
      // console.log("input", input);
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      console.log("hello2");
      if (!ctx.locals.user?.id) {
        throw new ActionError({
          code: "UNAUTHORIZED",
        });
      }
      console.log("hello3");
      const existingUser = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, ctx.locals.user?.id));

      console.log("hello4");
      let ImageResult;
      try {
        const result = await uploadImage(input.userProfileImg);
        console.log(result);
        ImageResult = result;
        
      } catch (error) {
        console.log(error);
        throw new ActionError({
          code:"INTERNAL_SERVER_ERROR",
          message:error.message
        })
      }

      console.log("hello5");
      if (existingUser.length === 0) {
        // No user profile found, insert new profile
        await db.insert(userProfile).values({
          ...input,
          userProfileImg:ImageResult.url,
          userId: ctx.locals.user?.id,
        });
        console.log("hello6");
      } else {
        // Update existing profile
        await db
          .update(userProfile)
          .set({...input,userProfileImg:ImageResult.url})
          .where(eq(userProfile.userId, ctx.locals.user?.id));
        console.log("hello7");
      }
      console.log("hello8");
      return true;
    },
  }),

  getUserProfile: defineAction({
    accept: "json",
    handler: async (_, ctx: NewApiContext) => {
      if (!ctx.locals.user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
        });
      }
      const user = await db
        .select()
        .from(userProfile)
        .where(
          or(
            eq(userProfile.userId, ctx.locals.user.id),
          ),
        );
      
        return user.at(0)
    },
  }),
};
