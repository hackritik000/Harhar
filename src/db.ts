import { drizzle } from "drizzle-orm/postgres-js";
import { Pool } from "pg";

const pool = new Pool({
  host: import.meta.env.DB_HOST,
  port: import.meta.env.DB_PORT,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
});

export const db = drizzle(pool);
