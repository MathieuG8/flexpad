/**
 * FlexPad — Panier, aperçu, overlay « ajouté au panier »
 * Réinit sur astro:page-load (View Transitions)
 */

const CART_KEY = 'flexpad_cart';
const PRODUCT = {
  id: 'flexpad',
  name: 'FlexPad',
  tagline: 'Pavé numérique programmable',
  price: 149.99,
};

let cartAbort = null;

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

function saveCart(cart) {
  cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

function addToCart(quantity = 1) {
  const cart = getCart();
  const existing = cart.items.find((i) => i.id === PRODUCT.id);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    cart.items.push({
      id: PRODUCT.id,
      name: PRODUCT.name,
      tagline: PRODUCT.tagline,
      price: PRODUCT.price,
      quantity,
    });
  }
  saveCart(cart);
  updateCartUI();
  return cart;
}

function removeFromCart() {
  const cart = getCart();
  cart.items = cart.items.filter((i) => i.id !== PRODUCT.id);
  saveCart(cart);
  updateCartUI();
  return cart;
}

function setQuantity(quantity) {
  const cart = getCart();
  const item = cart.items.find((i) => i.id === PRODUCT.id);
  if (item) {
    item.quantity = Math.max(1, Math.min(10, quantity));
    saveCart(cart);
    updateCartUI();
  }
  return cart;
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const cart = getCart();
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  if (badge) {
    badge.textContent = String(count);
    badge.classList.toggle('cart-badge--visible', count > 0);
  }
}

function renderCartPreview() {
  const emptyEl = document.getElementById('cart-empty');
  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-dropdown-footer');
  const totalEl = document.getElementById('cart-total-price');

  if (!emptyEl || !itemsEl || !footerEl) return;

  const cart = getCart();

  if (cart.items.length === 0) {
    emptyEl.hidden = false;
    itemsEl.hidden = true;
    footerEl.hidden = true;
    return;
  }

  emptyEl.hidden = true;
  itemsEl.hidden = false;
  footerEl.hidden = false;

  itemsEl.innerHTML = cart.items
    .map(
      (item) => `
    <div class="cart-preview-item" data-id="${item.id}">
      <div class="cart-preview-image">
        <div class="numpad-preview-mini">
          <div class="numpad-preview-screen">FlexPad</div>
          <div class="numpad-preview-keys"></div>
        </div>
      </div>
      <div class="cart-preview-details">
        <h4>${item.name}</h4>
        <p>${item.tagline}</p>
        <div class="cart-preview-qty">
          <span>Qté : ${item.quantity}</span>
          <span class="cart-preview-price">${(item.price * item.quantity).toFixed(2)} $</span>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  if (totalEl) {
    totalEl.textContent = `${cart.total.toFixed(2)} $`;
  }
}

function updateCartUI() {
  updateCartBadge();
  renderCartPreview();
}

function hideCartAddedOverlay() {
  const overlay = document.getElementById('cart-added-overlay');
  if (overlay) overlay.hidden = true;
  document.documentElement.classList.remove('cart-overlay-open');
}

function showCartAddedOverlay(qtyJustAdded) {
  const overlay = document.getElementById('cart-added-overlay');
  const summary = document.getElementById('cart-overlay-summary');
  if (!overlay || !summary) return;

  const cart = getCart();
  const item = cart.items.find((i) => i.id === PRODUCT.id);
  const q = item ? item.quantity : 0;
  const line = qtyJustAdded > 1
    ? `${qtyJustAdded} article(s) ajouté(s). Quantité totale : ${q}.`
    : `Article ajouté. Quantité dans le panier : ${q}.`;
  summary.textContent = `${line} Sous-total : ${cart.total.toFixed(2)} $ CAD.`;

  overlay.hidden = false;
  document.documentElement.classList.add('cart-overlay-open');

  const focusEl = overlay.querySelector('[data-cart-overlay-primary]');
  if (focusEl instanceof HTMLElement) focusEl.focus();
}

function openCartDropdown() {
  const trigger = document.getElementById('cart-trigger');
  const dropdown = document.getElementById('cart-dropdown');
  if (trigger && dropdown) {
    dropdown.classList.add('cart-dropdown--open');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

window.FlexPadCart = {
  addToCart,
  removeFromCart,
  setQuantity,
  getCart,
  updateCartBadge,
  updateCartUI,
};
window.updateCartBadge = updateCartBadge;

function bindCartDropdown(signal) {
  const trigger = document.getElementById('cart-trigger');
  const dropdown = document.getElementById('cart-dropdown');
  if (!trigger || !dropdown) return;

  const close = () => {
    dropdown.classList.remove('cart-dropdown--open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener(
    'click',
    (e) => {
      e.stopPropagation();
      const open = !dropdown.classList.contains('cart-dropdown--open');
      dropdown.classList.toggle('cart-dropdown--open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    },
    { signal }
  );

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (!dropdown.contains(t) && !trigger.contains(t)) close();
    },
    { signal }
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        const ov = document.getElementById('cart-added-overlay');
        if (ov && !ov.hidden) {
          hideCartAddedOverlay();
          return;
        }
        close();
      }
    },
    { signal }
  );
}

function bindCartOverlay(signal) {
  const overlay = document.getElementById('cart-added-overlay');
  if (!overlay) return;

  overlay.querySelectorAll('[data-cart-overlay-close]').forEach((el) => {
    el.addEventListener(
      'click',
      () => hideCartAddedOverlay(),
      { signal }
    );
  });

  const openPanier = document.getElementById('cart-overlay-open-panier');
  openPanier?.addEventListener(
    'click',
    () => {
      hideCartAddedOverlay();
      openCartDropdown();
    },
    { signal }
  );
}

function bindAddToCartButtons(signal) {
  document.querySelectorAll('#btn-add-to-cart, #btn-add-to-cart-home').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const qtyInput = document.getElementById('product-quantity');
        const qty = qtyInput
          ? Math.max(1, Math.min(10, parseInt(qtyInput.value || '1', 10)))
          : 1;
        addToCart(qty);
        showCartAddedOverlay(qty);
        const originalText = btn.textContent;
        btn.textContent = 'Ajouté !';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1200);
      },
      { signal }
    );
  });
}

function initCart() {
  if (!document.getElementById('flexpad-cart-widget')) return;
  if (cartAbort) cartAbort.abort();
  cartAbort = new AbortController();
  const { signal } = cartAbort;

  bindCartDropdown(signal);
  bindCartOverlay(signal);
  bindAddToCartButtons(signal);
  updateCartUI();
}

document.addEventListener('astro:page-load', initCart);
document.addEventListener('DOMContentLoaded', initCart);
