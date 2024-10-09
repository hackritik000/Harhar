import { db } from "@/lib/db";
import { cities } from "@/schema/small.schema";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const smallActions = {
  showAddCity: defineAction({
    accept: "form",
    input: z.object({
      city: z.string(),
    }),
    handler: async (input, ctx) => {
      console.log("Hii ");
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      console.log("boo");
      const addCity = await db.insert(cities).values({ city: input.city });
      console.error("hii");
      console.log(addCity);
      // return addCity
    },
  }),
};
