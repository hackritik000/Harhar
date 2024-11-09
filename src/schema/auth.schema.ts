import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  googleId: text("google_id"), // Google
  email: varchar("email", { length: 50 }).unique(),
  username: varchar("username", { length: 50 }).unique(),
  password_hash: text("password_hash"),
  reset_token: varchar("reset_token", { length: 255 }), // Token for resetting password
  reset_token_expiry: timestamp("reset_token_expiry", { mode: "date" }), // Token expiry time
  isAdmin: boolean("isAdmin").default(false),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
