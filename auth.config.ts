import Credentials from '@auth/core/providers/credentials';
import { eq } from 'drizzle-orm';
import { defineConfig } from 'auth-astro';
import bcrypt from 'bcryptjs';
import { db } from './src/db';
import { users } from './src/db/schema';

/** Auth.js exige un secret ; en dev on évite le 500 si .env manque. En prod : obligatoire via .env ou l’hébergeur. */
function resolveAuthSecret(): string {
  const fromVite = import.meta.env.AUTH_SECRET;
  const fromProcess =
    typeof process !== 'undefined' && process.env.AUTH_SECRET
      ? process.env.AUTH_SECRET
      : undefined;
  const secret = fromVite || fromProcess;
  if (secret) return secret;
  if (import.meta.env.DEV) {
    console.warn(
      '[auth] AUTH_SECRET absent : secret de développement utilisé. Copie .env.example vers .env et définis AUTH_SECRET pour la production.',
    );
    return 'dev-only-flexpad-auth-secret-ne-pas-utiliser-en-production-32chars';
  }
  throw new Error(
    'AUTH_SECRET manquant. Ajoute-le dans .env (voir .env.example) ou dans les variables d’environnement du serveur.',
  );
}

export default defineConfig({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Courriel', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.toLowerCase()?.trim();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const [row] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        if (!row?.passwordHash) return null;

        const ok = await bcrypt.compare(password, row.passwordHash);
        if (!ok) return null;

        const role = row.role === 'admin' ? 'admin' : 'user';
        return {
          id: row.id,
          name: row.name ?? undefined,
          email: row.email,
          image: row.image ?? undefined,
          role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        const r = (user as { role?: string }).role;
        token.role = r === 'admin' ? 'admin' : 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role === 'admin' ? 'admin' : 'user';
      }
      return session;
    },
  },
  trustHost: true,
  secret: resolveAuthSecret(),
});
