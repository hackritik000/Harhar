import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { businessDetails } from "@/schema/business.schema";
import { db } from "@/lib/db";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { eq } from "drizzle-orm";

export const listing = {
  listing: defineAction({
    accept: "form",
    input: z.object({}),
    handler: async () => {
      const listingData = await db.select().from(businessDetails);
      return listingData;
    },
  }),

  showAllListing: defineAction({
    accept: "json",
    input: z.object({}),
    handler: async (_, ctx) => {
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      const listingDetails = await db.select().from(businessDetails);
      if (listingDetails.length < 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There is no listing in your db",
        });
      }
      return listingDetails;
    },
  }),

  showMyListing: defineAction({
    accept: "json",
    handler: async (input, ctx) => {
      const myListing = await db
        .select()
        .from(businessDetails)
        .where(eq(businessDetails.ownerName, ""));

        console.log(myListing)

      return myListing;
    },
  }),
};
