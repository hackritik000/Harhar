export const prerender = true;
import type { NewApiContext } from "@/interface/extended.interface";
import { db } from "@/lib/db";
import { userTable } from "@/schema/auth.schema";
import { HASH_OPTION } from "@/utils/constant";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { verify } from "@node-rs/argon2";
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";

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
    handler: async (input, ctx: NewApiContext) => {
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, input.username));
      if (!existingUser) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "username don't exist",
        });
      }

      if (!existingUser[0]?.password_hash) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "password is not found",
        });
      }
      const validPassword = await verify(
        existingUser[0].password_hash,
        input.password,
        HASH_OPTION
      );
    },
  }),
};
