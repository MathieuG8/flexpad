/**
 * Page /config/ — même rôle que l’ancien script inline : initApp (macropad-app.js).
 * Chargement dynamique pour ne pas télécharger ~140 ko sur les pages vitrine.
 * View Transitions : réinit à chaque astro:page-load sur l’onglet principal.
 */

let lucideThemeObserver = null;

function setupLucideThemeObserver() {
  if (lucideThemeObserver) {
    lucideThemeObserver.disconnect();
    lucideThemeObserver = null;
  }
  lucideThemeObserver = new MutationObserver(() => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  });
  lucideThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

async function bootMacropad() {
  if (!document.getElementById('tab-main')) {
    if (lucideThemeObserver) {
      lucideThemeObserver.disconnect();
      lucideThemeObserver = null;
    }
    return;
  }
  const { initApp } = await import('./macropad-app.js');
  initApp();
  setupLucideThemeObserver();
}

document.addEventListener('astro:page-load', bootMacropad);
