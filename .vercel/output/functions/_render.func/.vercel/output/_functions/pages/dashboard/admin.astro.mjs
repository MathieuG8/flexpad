import { c as createComponent, g as renderComponent, r as renderTemplate, d as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_Cfy4trcV.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dz_HxGPl.mjs';
import { $ as $$DashboardChrome } from '../../chunks/DashboardChrome_B_dJmZh-.mjs';
import { g as getSession, d as db, o as orders, u as users } from '../../chunks/server_D6DUr65O.mjs';
import { f as formatCadFromCents } from '../../chunks/orders_DfkalkK-.mjs';
import { sum, count, desc } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getSession(Astro2.request);
  if (!session?.user || session.user.role !== "admin") {
    return Astro2.redirect("/dashboard");
  }
  const [orderAgg] = await db.select({
    n: count(),
    revenue: sum(orders.totalCents)
  }).from(orders);
  const [userAgg] = await db.select({ n: count() }).from(users);
  const latest = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8);
  const title = "Administration | FlexPad";
  const nOrders = Number(orderAgg?.n ?? 0);
  const revenueCents = Number(orderAgg?.revenue ?? 0);
  const nUsers = Number(userAgg?.n ?? 0);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "site": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-content dashboard-page dashboard-page--chrome"> ${renderComponent($$result2, "DashboardChrome", $$DashboardChrome, { "variant": "admin", "title": "Vue d\u2019ensemble", "subtitle": "Indicateurs issus de la base locale (commandes enregistr\xE9es + comptes).", "userName": session.user.name ?? session.user.email ?? "Admin", "userEmail": session.user.email ?? "", "isAdmin": true }, { "default": async ($$result3) => renderTemplate` <div class="admin-metrics"> <div class="admin-metric reveal visible"> <span class="admin-metric__label">Commandes</span> <strong class="admin-metric__value">${nOrders}</strong> </div> <div class="admin-metric reveal visible"> <span class="admin-metric__label">Chiffre (total enregistré)</span> <strong class="admin-metric__value">${formatCadFromCents(revenueCents)}</strong> </div> <div class="admin-metric reveal visible"> <span class="admin-metric__label">Comptes utilisateurs</span> <strong class="admin-metric__value">${nUsers}</strong> </div> </div> <div class="dashboard-card reveal visible dash-recent"> <h2 class="dashboard-card__title">Dernières commandes (tous clients)</h2> ${latest.length === 0 ? renderTemplate`<p class="dashboard-note">Aucune commande en base.</p>` : renderTemplate`<ul class="dash-recent-list admin-recent-orders"> ${latest.map((o) => renderTemplate`<li> <a href="/dashboard/admin/orders"> <strong>${o.reference}</strong> <span class="dash-recent-meta"> ${formatCadFromCents(o.totalCents)} · ${o.status} </span> </a> </li>`)} </ul>`} </div> ` })} </div> ` })}`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/index.astro", void 0);

const $$file = "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/index.astro";
const $$url = "/dashboard/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
