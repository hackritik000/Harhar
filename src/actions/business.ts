import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { businessDetails } from "@/schema/business.schema";
import { db } from "@/lib/db";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { eq } from "drizzle-orm";
import { checkValidUser } from "@/utils/checkValidUser";
export const business = {
  addBusiness: defineAction({
    accept: "form",
    input: z.object({
      businessName: z
        .string()
        .min(3, "Business must be at least 3 characters long")
        .max(30, "Business must be at most 30 characters long"),
      ownerName: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long"),
      email: z.string().email("Invalid Email formet"),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
      category: z.string(),
      address: z.string(),
      city: z.string(),
      websiteLink: z.string(),
      googleMapIframe: z.string(),
      businessDescription: z.string(),
    }),
    handler: async (input, ctx) => {
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

      await db.insert(businessDetails).values({
        ...input,
        userId: ctx.locals.user?.id,
      });
      return;
    },
  }),
  showListing: defineAction({
    accept: "json",
    handler: async (input, ctx) => {
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      let isOwner = false;
      if (ctx.locals.user?.id) {
        isOwner = await checkValidUser(ctx.locals.user?.id, input.listingId);
      }
      const listingDetails = await db
        .select()
        .from(businessDetails)
        .where(eq(businessDetails.id, input.listingId));
      return { isOwner, ...listingDetails[0] };
    },
  }),

  deleteListing: defineAction({
    accept: "form",
    input: z.object({
      listingId: z.string(),
    }),
    handler: async (input, ctx) => {
      // console.log("Hello ")
      // console.log(input)
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      const deletedListing = await db
        .delete(businessDetails)
        .where(eq(businessDetails.id, input.listingId));

      // console.log(deletedListing,"______________________-----______________--_______                        ")

      if (!deletedListing) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "something went wrong while deleteing listing",
        });
      }
      return;
    },
  }),

  editListing: defineAction({
    accept: "json",
    input: z.object({ id: z.string() }),
    handler: async (input, ctx) => {
      // console.log("_____________++++_____++++____+++_____+++",input.id);

      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      const listing = await db
        .select()
        .from(businessDetails)
        .where(eq(businessDetails.id, input.id));
      if (!listing) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "something went wrong while editing listing",
        });
      }

      return listing;
    },
  }),

  updateListing: defineAction({
    accept: "form",
    input: z.object({
      listing_id: z.string(),
      businessName: z
        .string()
        .min(3, "Business must be at least 3 characters long")
        .max(30, "Business must be at most 30 characters long"),
      ownerName: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long"),
      email: z.string().email("Invalid Email formet"),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
      category: z.string(),
      address: z.string(),
      city: z.string(),
      websiteLink: z.string(),
      googleMapIframe: z.string(),
      businessDescription: z.string(),
    }),
    handler: async (input) => {
      await db
        .update(businessDetails)
        .set(input)
        .where(eq(businessDetails.id, input.listing_id))
        .execute();
      return;
    },
  }),
};
