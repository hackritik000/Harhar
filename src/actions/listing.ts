import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { businessDetails } from "@/schema/bussness.schema";

import { db } from "@/lib/db";
export const listing = {
  listing: defineAction({
    accept: "form",
    input: z.object({}),
    handler: async () => {
      const listingData = await db.select().from(businessDetails);
      return listingData;
    },
  }),
};
