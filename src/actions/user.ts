import { ActionError, defineAction } from "astro:actions";
import type { NewApiContext } from "@/interface/extended.interface";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/schema/auth.schema";
import { HASH_OPTION } from "@/utils/constant";
import { TooManyRequest } from "@/utils/tooManyRequest";
import { hash, verify } from "@node-rs/argon2";
import { z } from "astro:schema";
import { eq, gt, or } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { sendPasswordResetEmail } from "@/utils/sendEmail";

export const user = {
  login: defineAction({
    accept: "form",
    input: z.object({
      username: z
        .string()
        .min(3)
        .max(30, "Username must be at most 30 characters long")
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          "Username can only contain letters, numbers, underscores, and dashes",
        ),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(30, "Password must be at most 128 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(
          /[@$!%*?&]/,
          "Password must contain at least one special character",
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
      if (!existingUser || existingUser.length <= 0) {
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
        HASH_OPTION,
      );

      if (!validPassword) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "password don't match",
        });
      }
      const session = await lucia.createSession(existingUser[0]?.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      ctx.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      // console.log
      return { session };
    },
  }),

  register: defineAction({
    accept: "form",
    input: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long")
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          "Username can only contain letters, numbers, underscores, and dashes",
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
          "Password must contain at least one special character",
        ),
    }),

    handler: async (input, ctx: NewApiContext) => {
      console.log("Validation passed", input);
      if (TooManyRequest(ctx)) {
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
        });
      }
      const userId = generateIdFromEntropySize(10);
      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, input.username));

      if (existingUser.length > 0) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "username already exist",
        });
      }

      const password_hash = await hash(input.password, HASH_OPTION);

      await db.insert(userTable).values({
        id: userId,
        username: input.username,
        password_hash,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      ctx.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return true;
    },
  }),

  logOut: defineAction({
    accept: "form",
    handler: async (_, ctx: NewApiContext) => {
      if (!ctx.locals.session) {
        return new Response(null, {
          status: 401,
        });
      }
      await lucia.invalidateSession(ctx.locals.session.id);

      const sessionCookie = lucia.createBlankSessionCookie();
      ctx.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return true;
    },
  }),

  forgotPassword: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Please enter a valid email address"),
    }),
    handler: async (input, ctx: NewApiContext) => {
      const { email } = input;
      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email));

      if (existingUser.length === 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Email address not found",
        });
      }

      // Generate a reset token and save it to the database with an expiry
      const resetToken = generateIdFromEntropySize(16); // Or use another method to generate tokens
      const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

      await db
        .update(userTable)
        .set({ reset_token: resetToken, reset_token_expiry: resetTokenExpiry })
        .where(eq(userTable.email, email));

      // Send password reset email
      const resetLink = `${ctx.url.origin}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(email, resetLink);

      return { message: "Password reset link sent to your email" };
    },
  }),

  resetPassword: defineAction({
    accept: "form",
    input: z.object({
      token: z.string(),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(
          /[@$!%*?&]/,
          "Password must contain at least one special character",
        ),
    }),
    handler: async (input, ctx: NewApiContext) => {
      const { token, newPassword } = input;

      // Find user by reset token
      // const user = await db
      //   .select()
      //   .from(userTable)
      //   .where(eq(userTable.reset_token, token))
      //   .where(
      //     userTable.reset_token_expiry.gt(new Date()), // Ensure token has not expired
      //   );
      const user = await db
        .select()
        .from(userTable)
        .where(
          or(
            eq(userTable.reset_token, token),
            gt(userTable.reset_token_expiry, new Date()),
          ),
        )

      if (!user || user.length === 0) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired reset token",
        });
      }

      // Hash the new password and update the user record
      const password_hash = await hash(newPassword, HASH_OPTION);
      await db
        .update(userTable)
        .set({
          password_hash,
          reset_token: null,
          reset_token_expiry: null,
        })
        .where(eq(userTable.id, user[0].id));

      return { message: "Password reset successfully" };
    },
  }),
};
