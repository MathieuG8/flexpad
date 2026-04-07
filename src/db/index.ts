import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

function resolveDbFile(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./data/flexpad.db';
  const filePath = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

const dbFile = resolveDbFile();
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const sqlite = new Database(dbFile);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export { schema };
