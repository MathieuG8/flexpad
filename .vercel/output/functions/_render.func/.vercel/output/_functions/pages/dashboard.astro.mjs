import { c as createComponent, g as renderComponent, r as renderTemplate, d as createAstro, m as maybeRenderHead } from '../chunks/astro/server_Cfy4trcV.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dz_HxGPl.mjs';
import { $ as $$DashboardChrome } from '../chunks/DashboardChrome_B_dJmZh-.mjs';
import { g as getSession, d as db, o as orders } from '../chunks/server_DSDCZ1go.mjs';
import { eq, desc } from 'drizzle-orm';
import { f as formatCadFromCents } from '../chunks/orders_DfkalkK-.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getSession(Astro2.request);
  if (!session?.user) {
    return Astro2.redirect("/login?callbackUrl=/dashboard");
  }
  const recent = await db.select().from(orders).where(eq(orders.userId, session.user.id)).orderBy(desc(orders.createdAt)).limit(3);
  const title = "Tableau de bord | FlexPad";
  const isAdmin = session.user.role === "admin";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "site": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-content dashboard-page dashboard-page--chrome"> ${renderComponent($$result2, "DashboardChrome", $$DashboardChrome, { "variant": "user", "title": "Aper\xE7u du compte", "subtitle": "Acc\xE8s rapide \xE0 vos commandes et pr\xE9f\xE9rences.", "userName": session.user.name ?? session.user.email ?? "Utilisateur", "userEmail": session.user.email ?? "", "isAdmin": isAdmin }, { "default": async ($$result3) => renderTemplate` <div class="dash-cards"> <a href="/dashboard/orders" class="dash-card reveal visible"> <span class="dash-card__icon" aria-hidden="true">🛒</span> <h2 class="dash-card__title">Mes commandes</h2> <p class="dash-card__desc">
Historique et détails des commandes passées lorsque vous êtes connecté au moment du paiement démo.
</p> <span class="dash-card__cta">Voir les commandes →</span> </a> <a href="/dashboard/wishlist" class="dash-card reveal visible"> <span class="dash-card__icon" aria-hidden="true">♡</span> <h2 class="dash-card__title">Liste de souhaits</h2> <p class="dash-card__desc">
Produits enregistrés dans ce navigateur pour plus tard.
</p> <span class="dash-card__cta">Ouvrir la liste →</span> </a> <a href="/dashboard/settings" class="dash-card reveal visible"> <span class="dash-card__icon" aria-hidden="true">⚙</span> <h2 class="dash-card__title">Paramètres</h2> <p class="dash-card__desc">
Informations du compte et liens utiles.
</p> <span class="dash-card__cta">Paramètres →</span> </a> ${isAdmin && renderTemplate`<a href="/dashboard/admin" class="dash-card dash-card--admin reveal visible"> <span class="dash-card__icon" aria-hidden="true">⬡</span> <h2 class="dash-card__title">Administration</h2> <p class="dash-card__desc">
Vue d’ensemble boutique, commandes globales et sections de gestion.
</p> <span class="dash-card__cta">Ouvrir l’admin →</span> </a>`} </div> ${recent.length > 0 && renderTemplate`<div class="dashboard-card reveal visible dash-recent"> <h2 class="dashboard-card__title">Dernières commandes</h2> <ul class="dash-recent-list"> ${recent.map((o) => renderTemplate`<li> <a href="/dashboard/orders"> <strong>${o.reference}</strong> <span class="dash-recent-meta"> ${formatCadFromCents(o.totalCents)} · ${o.status} </span> </a> </li>`)} </ul> </div>`}<div class="dashboard-card reveal visible dash-help"> <h2 class="dashboard-card__title">Besoin d’aide ?</h2> <p class="dashboard-note">
Pour toute question sur FlexPad ou une commande, écrivez-nous depuis la page contact.
</p> <div class="dash-help-actions"> <a href="/contact/" class="btn-secondary">Contact</a> <a href="/product/" class="btn-secondary">Fiche produit</a> </div> </div> ` })} </div> ` })}`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
