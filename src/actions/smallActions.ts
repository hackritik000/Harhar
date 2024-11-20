import { db } from "@/lib/db";
import { catagories, cities, subcategories } from "@/schema/small.schema";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { ActionError, defineAction } from "astro:actions";
import { categoriesDataWithIcon } from "@/utils/categoriesWithIcon";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";
import { cats } from "@/utils/categories";

export const smallActions = {
  showAddCity: defineAction({
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

      await db.select().from(cities).execute();
      return;
    },
  }),

  allCategories: defineAction({
    accept: "json",
    handler: async (_, ctx) => {
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }

      const allCategories = await db.select().from(catagories);
      if (allCategories.length <= 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "There is no categories",
        });
      }

      const filterCategories = allCategories.filter(
        (categories, index, self) => categories.id == categories.id,
      );

      return allCategories;
    },
  }),

  seed: defineAction({
    accept: "json",
    handler: async (_, ctx) => {
      console.log("--------------out------------------");
      for (const [cat, subcat] of Object.entries(cats)) {
        await db
          .insert(subcategories)
          .values({ subcategory:45 });
        console.log(cat, "cat");
        console.log(subcat, "subCat");
        console.log("--------------------------------");
      }
    },
  }),
};
