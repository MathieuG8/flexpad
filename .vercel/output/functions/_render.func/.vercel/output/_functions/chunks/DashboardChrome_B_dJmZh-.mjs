import { c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderTemplate, f as renderSlot, d as createAstro } from './astro/server_Cfy4trcV.mjs';

const $$Astro = createAstro();
const $$DashboardChrome = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardChrome;
  const { title, subtitle, variant, userName, userEmail, isAdmin } = Astro2.props;
  const pathNorm = Astro2.url.pathname.replace(/\/$/, "") || "/";
  function isActive(href) {
    const h = href.replace(/\/$/, "") || "/";
    return pathNorm === h;
  }
  const userLinks = [
    { href: "/dashboard", label: "Aper\xE7u" },
    { href: "/dashboard/orders", label: "Mes commandes" },
    { href: "/dashboard/wishlist", label: "Liste de souhaits" },
    { href: "/dashboard/settings", label: "Param\xE8tres" }
  ];
  const adminLinks = [
    { href: "/dashboard/admin", label: "Vue d\u2019ensemble" },
    { href: "/dashboard/admin/orders", label: "Commandes" },
    { href: "/dashboard/admin/products", label: "Produits" },
    { href: "/dashboard/admin/categories", label: "Cat\xE9gories" },
    { href: "/dashboard/admin/analytics", label: "Analytique" },
    { href: "/dashboard/admin/reports", label: "Rapports" },
    { href: "/dashboard/admin/reviews", label: "Avis" },
    { href: "/dashboard/admin/users", label: "Utilisateurs" },
    { href: "/dashboard/admin/coupons", label: "Coupons" },
    { href: "/dashboard/admin/email-templates", label: "Mod\xE8les courriel" },
    { href: "/dashboard/admin/notifications", label: "Notifications" },
    { href: "/dashboard/admin/logs", label: "Journaux" },
    { href: "/dashboard/admin/settings", label: "Param\xE8tres admin" }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="dash-chrome"> <aside class="dash-chrome__sidebar" aria-label="Navigation du tableau de bord"> <div class="dash-chrome__brand"> <a href="/">FlexPad</a> <span class="dash-chrome__badge">${variant === "admin" ? "Admin" : "Compte"}</span> </div> <p class="dash-chrome__user"> <strong>${userName}</strong> <span class="dash-chrome__email">${userEmail}</span> </p> ${variant === "user" ? renderTemplate`<nav class="dash-chrome__nav"> ${userLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["dash-chrome__link", { "dash-chrome__link--active": isActive(href) }], "class:list")}>${label}</a>`)} ${isAdmin && renderTemplate`<a href="/dashboard/admin" class="dash-chrome__link dash-chrome__link--admin">
Administration →
</a>`} </nav>` : renderTemplate`<nav class="dash-chrome__nav"> <a href="/dashboard" class="dash-chrome__link dash-chrome__link--muted">← Retour compte</a> ${adminLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["dash-chrome__link", { "dash-chrome__link--active": isActive(href) }], "class:list")}>${label}</a>`)} </nav>`} <div class="dash-chrome__footer"> <a href="/" class="dash-chrome__link dash-chrome__link--muted">Site vitrine</a> <button type="button" class="btn-secondary btn-sm dash-chrome__signout" id="dash-chrome-signout">
Déconnexion
</button> </div> </aside> <div class="dash-chrome__main"> <header class="dash-chrome__header"> <h1 class="dash-chrome__title">${title}</h1> ${subtitle && renderTemplate`<p class="dash-chrome__subtitle">${subtitle}</p>`} </header> <div class="dash-chrome__content"> ${renderSlot($$result, $$slots["default"])} </div> </div> </div> `;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/DashboardChrome.astro", void 0);

export { $$DashboardChrome as $ };
