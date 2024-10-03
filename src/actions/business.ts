import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { NewApiContext } from "@/interface/extended.interface";
export const business = {
  addListing: defineAction({
    accept: "form",
    input: z.object({
      business_name: z
        .string()
        .min(3, "Business must be at least 3 characters long")
        .max(30, "Business must be at most 30 characters long"),
      owner_name: z
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
      website_link: z.string(),
      google_map_iframe: z.string(),
      business_description: z.string(),
    }),
    handler: async (input, ctx: NewApiContext) => {
      console.log(input);
    },
  }),
};
