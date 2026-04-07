/**
 * Crée les comptes de démo (après `pnpm db:push`).
 * Usage : pnpm run db:seed
 *
 * Charge `.env` avant la connexion DB (comme ça, pas besoin de `set` sous PowerShell).
 */
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';

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
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
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

const { db } = await import('../src/db/index');
const { users } = await import('../src/db/schema');

type Role = 'user' | 'admin';

async function ensureUser(p: {
  email: string;
  password: string;
  name: string;
  role: Role;
}) {
  const email = p.email.toLowerCase().trim();
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing[0]) {
    console.log('Déjà présent (ignoré):', email);
    return;
  }
  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(p.password, 12);
  await db.insert(users).values({ id, email, name: p.name, passwordHash, role: p.role });
  console.log('Créé:', email, '| rôle:', p.role);
  console.log('  Mot de passe:', p.password);
}

async function ensureOrUpsertAdmin(p: { email: string; password: string; name: string }) {
  const email = p.email.toLowerCase().trim();
  const upsert =
    process.env.ADMIN_UPSERT === '1' ||
    process.env.ADMIN_UPSERT === 'true' ||
    process.env.ADMIN_UPSERT === 'yes';
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing[0]) {
    if (upsert) {
      const passwordHash = bcrypt.hashSync(p.password, 12);
      await db
        .update(users)
        .set({ passwordHash, name: p.name, role: 'admin' })
        .where(eq(users.email, email));
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
  await db.insert(users).values({ id, email, name: p.name, passwordHash, role: 'admin' });
  console.log('Créé:', email, '| rôle: admin');
  console.log('  Mot de passe:', p.password);
}

const demoEmail = process.env.SEED_EMAIL ?? 'demo@flexpad.local';
const demoRole = process.env.SEED_ROLE === 'admin' ? 'admin' : 'user';
await ensureUser({
  email: demoEmail,
  password: process.env.SEED_PASSWORD ?? 'flexpad-demo',
  name: process.env.SEED_NAME ?? 'Compte démo',
  role: demoRole,
});

const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@flexpad.local').toLowerCase().trim();
if (adminEmail !== demoEmail.toLowerCase().trim()) {
  await ensureOrUpsertAdmin({
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD ?? 'flexpad-admin',
    name: process.env.ADMIN_NAME ?? 'Administrateur FlexPad',
  });
} else {
  console.log(
    'ADMIN_EMAIL identique au compte démo : compte admin séparé non créé (utilisez un autre ADMIN_EMAIL).',
  );
}
