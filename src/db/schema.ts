import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/** Utilisateurs — Auth.js (JWT) + mot de passe hashé (bcrypt) pour le provider Credentials */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  /** Hash bcrypt ; null si compte réservé à de futurs fournisseurs OAuth */
  passwordHash: text('password_hash'),
  image: text('image'),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  /** `user` | `admin` */
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

/** Commandes enregistrées (checkout connecté) */
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  reference: text('reference').notNull(),
  /** confirmed | processing | shipped | cancelled */
  status: text('status').notNull().default('confirmed'),
  cartJson: text('cart_json').notNull(),
  shippingJson: text('shipping_json'),
  subtotalCents: integer('subtotal_cents').notNull(),
  tpsCents: integer('tps_cents').notNull(),
  tvqCents: integer('tvq_cents').notNull(),
  totalCents: integer('total_cents').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
