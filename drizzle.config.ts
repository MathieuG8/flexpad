import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL?.trim();
if (!url || !/^postgres(ql)?:\/\//i.test(url)) {
  throw new Error(
    'Définis DATABASE_URL (PostgreSQL, ex. Neon) avant drizzle-kit : voir .env.example.',
  );
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
});
