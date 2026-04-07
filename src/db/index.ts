import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
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

let _db: NeonHttpDatabase<typeof schema> | undefined;

function getOrCreateDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    _db = drizzle(neon(requirePostgresUrl()), { schema });
  }
  return _db;
}

/**
 * Client Drizzle lazy : évite de planter le chargement du middleware / auth.config
 * si `.env` n’est pas encore configuré ; la première requête DB lève une erreur explicite.
 */
export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      const instance = getOrCreateDb();
      const value = Reflect.get(instance, prop, receiver);
      return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(instance) : value;
    },
  },
);

export { schema };
