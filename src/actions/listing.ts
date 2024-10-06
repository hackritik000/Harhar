import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { businessDetails } from "@/schema/business.schema";
import { db } from "@/lib/db";
import { TooManyRequest } from "@/utils/tooManyRequest";

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

      console.log(listingDetails);
      return listingDetails;
    },
  }),
};
