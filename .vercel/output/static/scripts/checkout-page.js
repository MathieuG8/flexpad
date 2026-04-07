/**
 * Page Commander — compatible View Transitions (astro:page-load)
 */

const CART_KEY = 'flexpad_cart';
const unitPrice = 149.99;

let checkoutAbort = null;

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

function saveCartQty(qty) {
  const cart = getCart();
  const item = cart.items.find((i) => i.id === 'flexpad');
  if (item) {
    item.quantity = Math.max(1, Math.min(10, qty));
  } else {
    cart.items.push({
      id: 'flexpad',
      name: 'FlexPad',
      tagline: 'Pavé numérique programmable',
      price: unitPrice,
      quantity: qty,
    });
  }
  cart.total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
  if (window.FlexPadCart?.updateCartUI) window.FlexPadCart.updateCartUI();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
  if (window.FlexPadCart?.updateCartUI) window.FlexPadCart.updateCartUI();
}

function formatCad(value) {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function initCheckoutPage() {
  if (checkoutAbort) {
    checkoutAbort.abort();
    checkoutAbort = null;
  }

  const form = document.getElementById('checkout-form');
  if (!form) return;

  checkoutAbort = new AbortController();
  const { signal } = checkoutAbort;

  const steps = document.querySelectorAll('.checkout-step');
  const stepIndicators = document.querySelectorAll('.step');
  const quantityInput = document.getElementById('quantity');
  const lineTotalPrice = document.getElementById('line-total');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const tpsEl = document.getElementById('checkout-tps');
  const tvqEl = document.getElementById('checkout-tvq');
  const grandEl = document.getElementById('checkout-grand-total');
  const cartEmptyMsg = document.getElementById('cart-empty-msg');
  const cartContent = document.getElementById('checkout-cart-content');

  const cart = getCart();
  const flexpadItem = cart.items.find((i) => i.id === 'flexpad');
  const initialQty = flexpadItem ? flexpadItem.quantity : 1;

  if (cart.items.length === 0 && cartEmptyMsg && cartContent) {
    cartContent.hidden = true;
    cartEmptyMsg.hidden = false;
  } else if (quantityInput) {
    quantityInput.value = String(initialQty);
  }

  function updateTotal() {
    const qty = Math.max(1, Math.min(10, parseInt(quantityInput?.value || '1', 10)));
    if (quantityInput && String(qty) !== quantityInput.value) quantityInput.value = String(qty);
    const subtotal = unitPrice * qty;
    const tps = subtotal * 0.05;
    const tvq = subtotal * 0.09975;
    const grand = subtotal + tps + tvq;
    if (lineTotalPrice) lineTotalPrice.textContent = formatCad(subtotal);
    if (subtotalEl) subtotalEl.textContent = formatCad(subtotal);
    if (tpsEl) tpsEl.textContent = formatCad(tps);
    if (tvqEl) tvqEl.textContent = formatCad(tvq);
    if (grandEl) grandEl.textContent = formatCad(grand);
    if (getCart().items.length > 0) saveCartQty(qty);
  }

  function showStep(stepNum) {
    steps.forEach((s, i) => {
      s.classList.toggle('hidden', i + 1 !== stepNum);
    });
    stepIndicators.forEach((s, i) => {
      s.classList.toggle('active', i + 1 === stepNum);
    });
  }

  quantityInput?.addEventListener('input', updateTotal, { signal });
  quantityInput?.addEventListener('change', updateTotal, { signal });

  document.getElementById('btn-to-step2')?.addEventListener(
    'click',
    () => {
      if (getCart().items.length === 0) return;
      showStep(2);
    },
    { signal }
  );

  document.getElementById('btn-back-step2')?.addEventListener('click', () => showStep(1), { signal });

  form.addEventListener(
    'submit',
    async (e) => {
      e.preventDefault();
      const ref = 'FXP-' + Math.floor(1000 + Math.random() * 9000);
      const orderRefEl = document.getElementById('order-ref');
      const qty = Math.max(1, Math.min(10, parseInt(quantityInput?.value || '1', 10)));
      const cart = getCart();
      const fd = new FormData(form);
      const shipping = {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        phone: String(fd.get('phone') || ''),
        address: String(fd.get('address') || ''),
        city: String(fd.get('city') || ''),
        postal: String(fd.get('postal') || ''),
      };
      let displayRef = ref;
      try {
        const sessRes = await fetch('/api/auth/session', { credentials: 'same-origin' });
        const sess = await sessRes.json();
        if (sess && sess.user) {
          const subtotal = unitPrice * qty;
          const tps = subtotal * 0.05;
          const tvq = subtotal * 0.09975;
          const cartPayload = {
            items: cart.items.length
              ? cart.items
              : [
                  {
                    id: 'flexpad',
                    name: 'FlexPad',
                    tagline: 'Pavé numérique programmable',
                    price: unitPrice,
                    quantity: qty,
                  },
                ],
            total: subtotal,
          };
          const saveRes = await fetch('/api/orders', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: ref,
              cart: cartPayload,
              shipping,
            }),
          });
          if (saveRes.ok) {
            const j = await saveRes.json();
            if (j.reference) displayRef = j.reference;
          }
        }
      } catch (err) {
        console.warn('[checkout] enregistrement commande', err);
      }
      if (orderRefEl) orderRefEl.textContent = displayRef;
      clearCart();
      showStep(3);
    },
    { signal }
  );

  if (cart.items.length > 0) updateTotal();
}

document.addEventListener('astro:page-load', initCheckoutPage);
document.addEventListener('DOMContentLoaded', initCheckoutPage);
