import { db } from "@/lib/db";
import { cities } from "@/schema/small.schema";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const smallActions = {
  showAddCity: defineAction({
<<<<<<< HEAD
    accept: "form",
=======
>>>>>>> 1448967eee483f4c3528c3d2b53da94ff47e8008
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
<<<<<<< HEAD
      console.log("boo");
      const addCity = await db.insert(cities).values({ city: input.city });
      console.error("hii");
      console.log(addCity);
      // return addCity
    },
  }),
=======

      const citySmallCase = input.city.toLowerCase();
      const addCity = await db.insert(cities).values({ city: citySmallCase });
      console.error("hii");
      console.log(addCity);
      if (!addCity) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return { message: "New city aded succssfully" };

      // return addCity
    },
  }),

  allCities: defineAction({
    accept: "form",
    handler: async (_, ctx) => {
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      const allCities = await db.select().from(cities).execute();
      console.log(cities);
    },
  }),
>>>>>>> 1448967eee483f4c3528c3d2b53da94ff47e8008
};
