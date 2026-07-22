// Panier de la boutique — persistant via localStorage, avec repli en mémoire
import { findProduct } from "./data/products.js";

const STORAGE_KEY = "45-syndicate-cart";
const listeners = new Set();
let memoryFallback = {};

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return memoryFallback;
  }
}

function writeStore(store) {
  memoryFallback = store;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Stockage indisponible (navigation privée) : le panier reste en mémoire
  }
  listeners.forEach((listener) => listener());
}

export function onCartChange(listener) {
  listeners.add(listener);
}

export function getCartItems() {
  const store = readStore();
  return Object.entries(store)
    .map(([id, qty]) => ({ product: findProduct(id), qty }))
    .filter((item) => item.product !== null && item.qty > 0);
}

export function addToCart(productId) {
  const store = readStore();
  store[productId] = (store[productId] ?? 0) + 1;
  writeStore(store);
}

export function setCartQty(productId, qty) {
  const store = readStore();
  if (qty <= 0) {
    delete store[productId];
  } else {
    store[productId] = qty;
  }
  writeStore(store);
}

export function clearCart() {
  writeStore({});
}

export function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal() {
  return getCartItems().reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
}
