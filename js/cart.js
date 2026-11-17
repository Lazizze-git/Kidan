// @ts-check
// Panier de la boutique : gardé dans le navigateur, avec repli en mémoire
import { findProduct } from "./data/products.js";

/** @typedef {import("./data/products.js").Product} Product */
/** @typedef {{ product: Product, qty: number }} CartItem */
/** @typedef {Record<string, number>} CartStore */

const STORAGE_KEY = "45-syndicate-cart";
/** @type {Set<() => void>} */
const listeners = new Set();
/** @type {CartStore} */
let memoryFallback = {};

/**
 * Relit le panier enregistré en ne gardant que des quantités valides
 * @param {string} raw
 * @returns {CartStore}
 */
function parseStore(raw) {
  /** @type {unknown} */
  const data = JSON.parse(raw);
  /** @type {CartStore} */
  const store = {};
  if (typeof data !== "object" || data === null) {
    return store;
  }
  Object.entries(data).forEach(([id, qty]) => {
    if (typeof qty === "number" && Number.isInteger(qty) && qty > 0) {
      store[id] = qty;
    }
  });
  return store;
}

/** @returns {CartStore} */
function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseStore(raw) : {};
  } catch {
    return memoryFallback;
  }
}

/** @param {CartStore} store */
function writeStore(store) {
  memoryFallback = store;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Stockage indisponible (navigation privée) : le panier reste en mémoire
  }
  listeners.forEach((listener) => listener());
}

/** @param {() => void} listener */
export function onCartChange(listener) {
  listeners.add(listener);
}

/** @returns {CartItem[]} */
export function getCartItems() {
  /** @type {CartItem[]} */
  const items = [];
  Object.entries(readStore()).forEach(([id, qty]) => {
    const product = findProduct(id);
    if (product && qty > 0) {
      items.push({ product, qty });
    }
  });
  return items;
}

/** @param {string} productId */
export function addToCart(productId) {
  const store = readStore();
  store[productId] = (store[productId] ?? 0) + 1;
  writeStore(store);
}

/**
 * @param {string} productId
 * @param {number} qty
 */
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
  return getCartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}
