import { pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
export const cities = pgTable("cities", {
  id: serial("id").primaryKey().notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const catagories = pgTable("catagories", {
    id: serial("id").primaryKey().notNull(),
    category: varchar("catagories", { length: 100 }).notNull(),
    subCategory: varchar("subcatagories", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
