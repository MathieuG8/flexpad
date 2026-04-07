import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL ?? 'file:./data/flexpad.db';
const dbPath = url.startsWith('file:') ? url.slice('file:'.length) : url;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: { url: dbPath },
});
