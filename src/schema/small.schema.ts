import { pgTable, varchar, timestamp, serial, text } from "drizzle-orm/pg-core";
export const cities = pgTable("cities", {
  id: serial("id").primaryKey().notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const catagories = pgTable("catagories", {
  id: serial("id").primaryKey().notNull(),
  category: varchar("catagories", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey().notNull(),
  subcategory: serial("subcategory").notNull(),
  categoryId: serial("category_id")
    .notNull()
    .references(() => catagories.id),
});
