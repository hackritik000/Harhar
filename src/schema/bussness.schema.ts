import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const businessDetails = pgTable("business_details", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  businessPhotos: varchar("business_photos", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  websiteLink: varchar("website_link", { length: 255 }).notNull(),
  googleMapIframe: text("google_map_iframe"),
  businessDescription: text("business_description"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
