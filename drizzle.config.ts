import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    host: import.meta.env.DB_HOST,
    database: import.meta.env.DB_NAME,
    password: import.meta.env.DB_PASSWORD,
    user: import.meta.env.DB_USER,
    port: import.meta.env.DB_PORT,
    ssl: import.meta.env.PRODUCTION,
  },
});

