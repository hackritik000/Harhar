import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { businessDetails } from "@/schema/business.schema";

import { db } from "@/lib/db";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { eq } from "drizzle-orm";
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
      console.log(input);
      const listing = await db.insert(businessDetails).values(input);
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

      const listingDetails = await db
        .select()
        .from(businessDetails)
        .where(eq(businessDetails.id, input.listingId));
      console.log(listingDetails);
    },
  }),
};
