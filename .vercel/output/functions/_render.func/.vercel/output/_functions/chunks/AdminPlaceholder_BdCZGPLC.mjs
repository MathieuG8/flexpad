import { c as createComponent, m as maybeRenderHead, r as renderTemplate, d as createAstro } from './astro/server_Cfy4trcV.mjs';

const $$Astro = createAstro();
const $$AdminPlaceholder = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminPlaceholder;
  const { title, body = "Section r\xE9serv\xE9e \xE0 une future int\xE9gration (donn\xE9es r\xE9elles, API, exports)." } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="admin-placeholder reveal visible"> <h2 class="dashboard-card__title">${title}</h2> <p class="dashboard-note">${body}</p> </div>`;
}, "C:/Users/Mathieu/OneDrive - Cegep Gerald-Godin/Cegep Gerald-Godin/Session_6/Projet_Finale/Numpad/Projet_Final/src/components/AdminPlaceholder.astro", void 0);

export { $$AdminPlaceholder as $ };
