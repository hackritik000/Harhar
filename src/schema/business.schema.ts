import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./auth.schema";
export const businessDetails = pgTable("business_details", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 50 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  category: varchar("category", { length: 100 }).notNull(),
  businessPhotos: varchar("business_photos", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  websiteLink: varchar("website_link", { length: 255 }),
  googleMapIframe: text("google_map_iframe"),
  businessDescription: text("business_description"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
