import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./auth.schema";

export const passwordReset = pgTable("password_reset", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: text("user_id").notNull().references(()=> userTable.id),
    otpHash: text("otp_hash").notNull(),
    otpExpiresAt: timestamp("otp_expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})