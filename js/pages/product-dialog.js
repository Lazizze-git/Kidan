// @ts-check
// Fiche produit : le détail d'un vinyle dans une fenêtre modale
import { addToCart } from "../cart.js";
import { requireElement } from "../dom.js";
import { createCover, formatPrice } from "../render.js";

/** @typedef {import("../data/products.js").Product} Product */

/**
 * @param {HTMLDialogElement} dialog
 * @param {string} selector
 */
function part(dialog, selector) {
  return requireElement(dialog, selector, HTMLElement);
}

/** @returns {(product: Product) => void} */
export function initProductDialog() {
  const dialog = document.querySelector("[data-product-dialog]");
  if (!(dialog instanceof HTMLDialogElement)) {
    return () => {};
  }

  const nodes = {
    cover: part(dialog, "[data-dialog-cover]"),
    artist: part(dialog, "[data-dialog-artist]"),
    title: part(dialog, "[data-dialog-title]"),
    desc: part(dialog, "[data-dialog-desc]"),
    price: part(dialog, "[data-dialog-price]"),
    add: part(dialog, "[data-dialog-add]"),
    soldout: part(dialog, "[data-dialog-soldout]"),
  };

  /** @type {Product | null} */
  let currentProduct = null;

  nodes.add.addEventListener("click", () => {
    if (currentProduct) {
      addToCart(currentProduct.id);
      dialog.close();
    }
  });

  part(dialog, "[data-dialog-close]").addEventListener("click", () => dialog.close());

  // Clic sur le fond assombri : ferme la fiche
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return (product) => {
    currentProduct = product;
    nodes.cover.replaceChildren(createCover(product));
    nodes.artist.textContent = product.artist;
    nodes.title.textContent = product.title;
    nodes.desc.textContent = product.description;
    nodes.price.textContent = formatPrice(product.price);
    nodes.add.hidden = !product.available;
    nodes.soldout.hidden = product.available;
    dialog.showModal();
  };
}
