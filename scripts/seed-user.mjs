/**
 * Crée les comptes de démo (après db:push).
 * Usage : pnpm run db:seed
 *
 * Les variables sont lues depuis l’environnement ET depuis le fichier `.env` à la racine
 * (comme ça, pas besoin de `set` sous PowerShell).
 *
 * Compte client démo : SEED_EMAIL / SEED_PASSWORD / SEED_ROLE (user|admin)
 * Compte admin dédié : ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
 * Si le compte ADMIN_EMAIL existe déjà : mettre ADMIN_UPSERT=true pour mettre à jour mot de passe, nom et rôle admin.
 */
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { sql, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

/** Charge `.env` dans process.env (sans écraser les variables déjà définies dans le shell). */
function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  let text = fs.readFileSync(envPath, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (let line of text.split(/\r?\n/)) {
    const hash = line.indexOf('#');
    if (hash !== -1) line = line.slice(0, hash);
    line = line.trim();
    if (!line) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadDotEnv();

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'),
  image: text('image'),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  role: text('role').notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

const raw = process.env.DATABASE_URL ?? 'file:./data/flexpad.db';
const filePath = raw.startsWith('file:') ? raw.slice(5) : raw;
const dbFile = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const sqlite = new Database(dbFile);
const db = drizzle(sqlite, { schema: { users } });

/**
 * @param {{ email: string; password: string; name: string; role: 'user' | 'admin' }} p
 */
function ensureUser(p) {
  const email = p.email.toLowerCase().trim();
  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    console.log('Déjà présent (ignoré):', email);
    return;
  }
  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(p.password, 12);
  db.insert(users)
    .values({ id, email, name: p.name, passwordHash, role: p.role })
    .run();
  console.log('Créé:', email, '| rôle:', p.role);
  console.log('  Mot de passe:', p.password);
}

/**
 * Crée l’admin ou, si ADMIN_UPSERT=true, met à jour mot de passe / nom / rôle.
 */
function ensureOrUpsertAdmin(p) {
  const email = p.email.toLowerCase().trim();
  const upsert =
    process.env.ADMIN_UPSERT === '1' ||
    process.env.ADMIN_UPSERT === 'true' ||
    process.env.ADMIN_UPSERT === 'yes';
  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    if (upsert) {
      const passwordHash = bcrypt.hashSync(p.password, 12);
      db.update(users)
        .set({ passwordHash, name: p.name, role: 'admin' })
        .where(eq(users.email, email))
        .run();
      console.log('Mis à jour (ADMIN_UPSERT):', email, '| rôle: admin');
      console.log('  Nouveau mot de passe:', p.password);
    } else {
      console.log('Déjà présent (ignoré):', email);
      console.log(
        '  → Pour changer le mot de passe : ajoutez ADMIN_UPSERT=true dans .env puis relancez pnpm run db:seed',
      );
    }
    return;
  }
  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(p.password, 12);
  db.insert(users)
    .values({ id, email, name: p.name, passwordHash, role: 'admin' })
    .run();
  console.log('Créé:', email, '| rôle: admin');
  console.log('  Mot de passe:', p.password);
}

// --- Compte vitrine démo ---
const demoEmail = process.env.SEED_EMAIL ?? 'demo@flexpad.local';
const demoRole = process.env.SEED_ROLE === 'admin' ? 'admin' : 'user';
ensureUser({
  email: demoEmail,
  password: process.env.SEED_PASSWORD ?? 'flexpad-demo',
  name: process.env.SEED_NAME ?? 'Compte démo',
  role: demoRole,
});

// --- Administrateur dédié (accès /dashboard/admin) ---
const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@flexpad.local').toLowerCase().trim();
if (adminEmail !== demoEmail.toLowerCase().trim()) {
  ensureOrUpsertAdmin({
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD ?? 'flexpad-admin',
    name: process.env.ADMIN_NAME ?? 'Administrateur FlexPad',
  });
} else {
  console.log('ADMIN_EMAIL identique au compte démo : compte admin séparé non créé (utilisez un autre ADMIN_EMAIL).');
}

sqlite.close();
