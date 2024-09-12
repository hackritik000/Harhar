export const prerender = true;
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  signIn: defineAction({
    input: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long")
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          "Username can only contain letters, numbers, underscores, and dashes"
        ),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be at most 128 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        ),
    }),
    handler: async (input, ctx) => {},
  }),
};
