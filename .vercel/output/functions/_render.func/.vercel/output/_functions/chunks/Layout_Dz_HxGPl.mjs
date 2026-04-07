import { c as createComponent, e as addAttribute, r as renderTemplate, d as createAstro, m as maybeRenderHead, f as renderSlot, g as renderComponent, j as renderHead } from './astro/server_Cfy4trcV.mjs';
/* empty css                         */

const $$Astro$2 = createAstro();
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/node_modules/.pnpm/astro@4.16.19_@types+node@2_c1441c87a5410574ede951559bdd7524/node_modules/astro/components/ViewTransitions.astro", void 0);

const $$Astro$1 = createAstro();
const $$GlassNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GlassNav;
  const rawPath = Astro2.url.pathname.replace(/\/$/, "") || "/";
  function isActive(href) {
    const h = href.replace(/\/$/, "") || "/";
    if (h === "/") return rawPath === "/";
    return rawPath === h || rawPath.startsWith(h + "/");
  }
  const links = [
    { href: "/", label: "Accueil" },
    { href: "/product/", label: "Produit" },
    { href: "/features/", label: "Fonctionnalit\xE9s" },
    { href: "/about/", label: "\xC0 propos" },
    { href: "/contact/", label: "Contact" },
    { href: "/checkout/", label: "Panier" },
    { href: "/config/", label: "Configuration" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="glass-nav-dock" aria-label="Navigation principale"> <div class="glass-nav"> <div class="glass-nav__inner"> ${links.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["glass-nav__link", { "glass-nav__link--active": isActive(href) }], "class:list")}${addAttribute(isActive(href) ? "page" : void 0, "aria-current")}> ${label} </a>`)} </div> </div> </nav>`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/GlassNav.astro", void 0);

const $$AuthDock = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="auth-dock"> <a href="/login" class="auth-dock__link" id="auth-dock-link" data-default-label="Connexion" data-logged-label="Compte"> <span class="auth-dock__icon" aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path> <circle cx="12" cy="7" r="4"></circle> </svg> </span> <span class="auth-dock__label" id="auth-dock-label">Connexion</span> </a> </div> `;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/AuthDock.astro", void 0);

const $$CartWidget = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="site-cart-dock"> <div class="cart-widget" id="flexpad-cart-widget"> <button type="button" class="cart-trigger" id="cart-trigger" aria-expanded="false" aria-controls="cart-dropdown" aria-label="Ouvrir le panier"> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <circle cx="9" cy="21" r="1"></circle> <circle cx="20" cy="21" r="1"></circle> <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path> </svg> <span class="cart-badge" id="cart-badge" aria-live="polite">0</span> </button> <div class="cart-dropdown" id="cart-dropdown" role="region" aria-label="Aperçu du panier"> <div class="cart-dropdown-header"> <h3>Panier</h3> </div> <div class="cart-dropdown-content"> <div class="cart-empty" id="cart-empty"> <p>Votre panier est vide.</p> <a href="/product/" class="btn-primary btn-sm btn-block">Voir le produit</a> </div> <div class="cart-items" id="cart-items" hidden></div> </div> <div class="cart-dropdown-footer" id="cart-dropdown-footer" hidden> <div class="cart-total"> <span>Total</span> <strong id="cart-total-price">0,00 $</strong> </div> <a href="/checkout/" class="btn-primary btn-block">Commander</a> </div> </div> </div> </div> <div id="cart-added-overlay" class="cart-added-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="cart-overlay-title"> <button type="button" class="cart-added-overlay__backdrop" data-cart-overlay-close aria-label="Fermer"></button> <div class="cart-added-overlay__panel" role="document"> <h2 id="cart-overlay-title" class="cart-added-overlay__title">Ajouté au panier</h2> <p id="cart-overlay-summary" class="cart-added-overlay__summary"></p> <div class="cart-added-overlay__actions"> <button type="button" class="btn-secondary" data-cart-overlay-close>
Continuer
</button> <button type="button" class="btn-secondary" id="cart-overlay-open-panier" data-cart-overlay-primary>
Voir le panier
</button> <a href="/checkout/" class="btn-primary cart-added-overlay__cta-checkout">Commander</a> </div> </div> </div>`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/CartWidget.astro", void 0);

const $$SiteFooter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="main-footer"> <div class="main-footer__inner"> <p class="main-footer__text"> <span class="main-footer__copy">©</span> <span class="main-footer__brand">FlexPad</span> <span class="main-footer__sep" aria-hidden="true">·</span> <span class="main-footer__credit">Mathieu Goulet, Créateur</span> <span class="main-footer__sep" aria-hidden="true">·</span> <span class="main-footer__tagline">BE PRODUCTIVE</span> </p> </div> </footer>`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/SiteFooter.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Configuration Macropad", site = false } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="fr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', `</title><link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'><rect x='2' y='6' width='20' height='12' rx='1' fill='none' stroke='currentColor' stroke-width='2'/><rect x='5' y='9' width='2' height='2'/><rect x='9' y='9' width='2' height='2'/><rect x='13' y='9' width='2' height='2'/><rect x='17' y='9' width='2' height='2'/></svg>"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`, '<link rel="stylesheet" href="/styles/glass-nav.css">', '<script src="https://cdn.jsdelivr.net/npm/lucide@0.563.0/dist/umd/lucide.min.js" crossorigin="anonymous"><\/script>', "</head> <body> ", " ", " ", ' <script src="/scripts/main.js" type="module"><\/script> <script src="/scripts/cart.js" type="module"><\/script> <script src="/scripts/checkout-page.js" type="module"><\/script> <script src="/scripts/contact-page.js" type="module"><\/script> <script src="/scripts/config-page.js" type="module"><\/script> </body> </html>'])), title, site ? renderTemplate`<link rel="stylesheet" href="/styles/main.css">` : renderTemplate`<link rel="stylesheet" href="/styles/global.css">`, renderComponent($$result, "ViewTransitions", $$ViewTransitions, {}), renderHead(), renderComponent($$result, "GlassNav", $$GlassNav, {}), site && renderTemplate`<div class="site-header-actions"> ${renderComponent($$result, "AuthDock", $$AuthDock, {})} ${renderComponent($$result, "CartWidget", $$CartWidget, {})} </div>`, site ? renderTemplate`<div class="main-page"> <div class="main-page-backdrop" aria-hidden="true"> <div class="main-page-backdrop__stage"> <div class="parallax-layer parallax-layer--deep" data-speed="0.3"></div> <div class="parallax-layer parallax-layer--grid" data-speed="0.5"></div> <div class="hero-circuit hero-circuit--1"></div> <div class="hero-circuit hero-circuit--2"></div> <div class="hero-circuit hero-circuit--3"></div> <div class="hero-circuit hero-circuit--4"></div> <div class="hero-circuit hero-circuit--5"></div> <div class="hero-circuit hero-circuit--6"></div> <div class="hero-circuit hero-circuit--7"></div> </div> </div> <div class="main-page-content"> <div class="main-page-main"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "SiteFooter", $$SiteFooter, {})} </div> </div>` : renderTemplate`${renderSlot($$result, $$slots["default"])}`);
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
