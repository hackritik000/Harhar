import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./auth.schema";

export const userProfile = pgTable("user_profile", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId : text("user_id").notNull().references(()=>userTable.id),
    firstName : varchar("first_name").notNull(),
    lastName : varchar("last_name"),
    userProfileImg:varchar("userprofile_img"),
    email : varchar("email").notNull().references(()=>userTable.email),
    phone : varchar("phone"),
    address : varchar("address"),
    city : varchar("city"),
    createdAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull(),
})