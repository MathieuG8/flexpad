import { c as createComponent, g as renderComponent, r as renderTemplate, d as createAstro, m as maybeRenderHead, e as addAttribute } from '../../../chunks/astro/server_Cfy4trcV.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_Dz_HxGPl.mjs';
import { $ as $$DashboardChrome } from '../../../chunks/DashboardChrome_B_dJmZh-.mjs';
import { g as getSession, d as db, u as users, o as orders } from '../../../chunks/server_D6DUr65O.mjs';
import { eq, desc } from 'drizzle-orm';
import { f as formatCadFromCents } from '../../../chunks/orders_DfkalkK-.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getSession(Astro2.request);
  if (!session?.user || session.user.role !== "admin") {
    return Astro2.redirect("/dashboard");
  }
  const rows = await db.select({
    order: orders,
    customerEmail: users.email,
    customerName: users.name
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).orderBy(desc(orders.createdAt));
  function parseItems(json) {
    try {
      const o = JSON.parse(json);
      return Array.isArray(o.items) ? o.items : [];
    } catch {
      return [];
    }
  }
  const title = "Admin \u2014 Commandes | FlexPad";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "site": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-content dashboard-page dashboard-page--chrome"> ${renderComponent($$result2, "DashboardChrome", $$DashboardChrome, { "variant": "admin", "title": "Gestion des commandes", "subtitle": "Modifier le statut met \xE0 jour la base locale.", "userName": session.user.name ?? session.user.email ?? "Admin", "userEmail": session.user.email ?? "", "isAdmin": true }, { "default": async ($$result3) => renderTemplate`${rows.length === 0 ? renderTemplate`<p class="dashboard-note">Aucune commande.</p>` : renderTemplate`<div class="admin-orders-wrap" id="admin-orders-root"> <table class="admin-orders-table"> <thead> <tr> <th>Référence</th> <th>Client</th> <th>Total</th> <th>Statut</th> </tr> </thead> <tbody> ${rows.map(({ order: o, customerEmail, customerName }) => {
    const items = parseItems(o.cartJson);
    const qty = items.reduce((n, i) => n + (i.quantity ?? 0), 0);
    return renderTemplate`<tr${addAttribute(o.id, "data-order-id")}> <td> <strong>${o.reference}</strong> <div class="admin-orders-sub"> ${qty} art. ·${" "} ${o.createdAt ? new Date(o.createdAt).toLocaleString("fr-CA") : ""} </div> </td> <td> ${customerName ?? "\u2014"} <div class="admin-orders-sub">${customerEmail ?? o.userId}</div> </td> <td>${formatCadFromCents(o.totalCents)}</td> <td> <select class="admin-order-status form-control-like"${addAttribute(o.id, "data-order-id")}${addAttribute(`Statut ${o.reference}`, "aria-label")}> <option value="confirmed"${addAttribute(o.status === "confirmed", "selected")}>Confirmée</option> <option value="processing"${addAttribute(o.status === "processing", "selected")}>En traitement</option> <option value="shipped"${addAttribute(o.status === "shipped", "selected")}>Expédiée</option> <option value="cancelled"${addAttribute(o.status === "cancelled", "selected")}>Annulée</option> </select> </td> </tr>`;
  })} </tbody> </table> </div>`}` })} </div> ` })} `;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/orders/index.astro", void 0);

const $$file = "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/orders/index.astro";
const $$url = "/dashboard/admin/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
