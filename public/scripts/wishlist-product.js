/**
 * Bouton « Liste de souhaits » sur la fiche FlexPad
 */
const WISHLIST_KEY = 'flexpad_wishlist';

function readList() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeList(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

function initWishlistBtn() {
  const btn = document.getElementById('btn-add-wishlist');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const entry = {
      id: 'flexpad',
      name: 'FlexPad',
      addedAt: new Date().toISOString(),
    };
    const list = readList().filter((x) => x.id !== 'flexpad');
    list.push(entry);
    writeList(list);
    btn.textContent = '✓ Dans la liste';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '♡ Liste de souhaits';
      btn.disabled = false;
    }, 2000);
  });
}

document.addEventListener('DOMContentLoaded', initWishlistBtn);
document.addEventListener('astro:page-load', initWishlistBtn);
