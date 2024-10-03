import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/*',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    host: 'localhost',
    database: 'db',
    user: 'root',
    password: 'root',
    port: 5432,
    ssl: false,
  },
});
