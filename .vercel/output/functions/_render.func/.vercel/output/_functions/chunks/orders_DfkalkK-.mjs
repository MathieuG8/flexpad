const FLEXPAD_UNIT_CENTS = 14999;
function normalizeCartPayload(cart) {
  if (!cart || typeof cart !== "object") return null;
  const itemsRaw = cart.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) return null;
  const items = [];
  let subtotalCents = 0;
  for (const row of itemsRaw) {
    if (!row || typeof row !== "object") continue;
    const id = row.id;
    if (id !== "flexpad") continue;
    const q = Math.min(10, Math.max(1, Math.floor(Number(row.quantity) || 0)));
    if (q < 1) continue;
    const name = String(row.name || "FlexPad");
    const tagline = row.tagline;
    const lineCents = FLEXPAD_UNIT_CENTS * q;
    subtotalCents += lineCents;
    items.push({
      id: "flexpad",
      name,
      tagline: typeof tagline === "string" ? tagline : "Pavé numérique programmable",
      price: FLEXPAD_UNIT_CENTS / 100,
      quantity: q
    });
  }
  if (items.length === 0) return null;
  return { items, subtotalCents };
}
function taxesFromSubtotalCents(subtotalCents) {
  const sub = subtotalCents / 100;
  const tpsCents = Math.round(sub * 0.05 * 100);
  const tvqCents = Math.round(sub * 0.09975 * 100);
  return {
    tpsCents,
    tvqCents,
    totalCents: subtotalCents + tpsCents + tvqCents
  };
}
function formatCadFromCents(cents) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents / 100);
}
const STATUS = ["confirmed", "processing", "shipped", "cancelled"];
function parseOrderStatus(raw) {
  if (!raw) return null;
  return STATUS.includes(raw) ? raw : null;
}

export { formatCadFromCents as f, normalizeCartPayload as n, parseOrderStatus as p, taxesFromSubtotalCents as t };
