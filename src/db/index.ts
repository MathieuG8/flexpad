import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

function requirePostgresUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || !/^postgres(ql)?:\/\//i.test(url)) {
    throw new Error(
      'DATABASE_URL doit être une URL PostgreSQL (ex. Neon via Vercel : Marketplace → Neon, plan gratuit). ' +
        'Copie la chaîne `postgresql://…` dans .env et sur Vercel (Variables d’environnement).',
    );
  }
  return url;
}

const sql = neon(requirePostgresUrl());
export const db = drizzle(sql, { schema });
export { schema };
