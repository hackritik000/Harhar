export const prerender = true;

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: import.meta.env.DB_HOST,
  port: import.meta.env.DB_PORT,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
});

export const db = drizzle(pool);
