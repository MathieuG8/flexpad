import { c as createComponent, g as renderComponent, r as renderTemplate, d as createAstro, m as maybeRenderHead } from '../../../chunks/astro/server_Cfy4trcV.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_Dz_HxGPl.mjs';
import { $ as $$DashboardChrome } from '../../../chunks/DashboardChrome_B_dJmZh-.mjs';
import { g as getSession, d as db, u as users } from '../../../chunks/server_DSDCZ1go.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getSession(Astro2.request);
  if (!session?.user || session.user.role !== "admin") return Astro2.redirect("/dashboard");
  const allUsers = await db.select().from(users);
  const title = "Admin \u2014 Utilisateurs | FlexPad";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "site": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-content dashboard-page dashboard-page--chrome"> ${renderComponent($$result2, "DashboardChrome", $$DashboardChrome, { "variant": "admin", "title": "Utilisateurs", "subtitle": "Comptes enregistr\xE9s (Auth + base locale).", "userName": session.user.name ?? session.user.email ?? "Admin", "userEmail": session.user.email ?? "", "isAdmin": true }, { "default": async ($$result3) => renderTemplate` <div class="dashboard-card reveal visible"> <h2 class="dashboard-card__title">Liste (${allUsers.length})</h2> <div class="admin-users-table-wrap"> <table class="admin-orders-table"> <thead> <tr> <th>Courriel</th> <th>Nom</th> <th>Rôle</th> <th>Créé le</th> </tr> </thead> <tbody> ${allUsers.map((u) => renderTemplate`<tr> <td>${u.email}</td> <td>${u.name ?? "\u2014"}</td> <td>${u.role === "admin" ? "Admin" : "Client"}</td> <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-CA") : "\u2014"}</td> </tr>`)} </tbody> </table> </div> <p class="dashboard-note">Promouvoir un compte en admin : mettre à jour la colonne <code>role</code> à <code>admin</code> en base (puis reconnecter).</p> </div> ` })} </div> ` })}`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/users/index.astro", void 0);

const $$file = "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/pages/dashboard/admin/users/index.astro";
const $$url = "/dashboard/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
