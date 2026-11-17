// @ts-check
// Briques de rendu partagées : prix, pochettes, fiches vinyles, listes
import { el } from "./dom.js";

export { el };

/** @typedef {import("./data/products.js").Product} Product */

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Montant au format suisse : « CHF 1’250.00 »
 * @param {number} value
 */
export function formatPrice(value) {
  const [whole = "0", cents = "00"] = value.toFixed(2).split(".");
  return `CHF ${whole.replace(THOUSANDS, "’")}.${cents}`;
}

/**
 * Pochette du vinyle, ou un emplacement visible tant qu'elle manque
 * @param {Product} product
 */
export function createCover(product) {
  const frame = el("div", "cover");
  if (product.cover) {
    const image = el("img");
    image.src = product.cover.src;
    image.alt = product.cover.alt;
    image.width = 600;
    image.height = 600;
    image.loading = "lazy";
    frame.append(image);
    return frame;
  }
  frame.append(el("p", "placeholder-note", "[Pochette à fournir]"));
  return frame;
}

const ADDED_FEEDBACK_MS = 1500;

/**
 * Le bouton dit « Ajouté » un instant : le panier a bien reçu le vinyle
 * @param {HTMLElement} button
 * @param {string} title
 */
function confirmAdded(button, title) {
  button.textContent = "Ajouté";
  button.setAttribute("aria-label", `${title} ajouté au panier`);
  window.setTimeout(() => {
    button.textContent = "Ajouter";
    button.setAttribute("aria-label", `Ajouter ${title} au panier`);
  }, ADDED_FEEDBACK_MS);
}

/**
 * @param {Product} product
 * @param {() => void} onAdd
 */
function createProductFooter(product, onAdd) {
  const footer = el("div", "product__foot");
  footer.append(el("p", "product__price", formatPrice(product.price)));
  if (!product.available) {
    footer.append(el("p", "tag", "Épuisé"));
    return footer;
  }
  const button = el("button", "btn btn--small btn--solid", "Ajouter");
  button.type = "button";
  button.setAttribute("aria-label", `Ajouter ${product.title} au panier`);
  button.addEventListener("click", () => {
    onAdd();
    confirmAdded(button, product.title);
  });
  footer.append(button);
  return footer;
}

/**
 * Fiche d'un vinyle dans le catalogue. Le titre est un vrai bouton :
 * accessible au clavier, il ouvre la fiche détaillée.
 * @param {Product} product
 * @param {() => void} onAdd
 * @param {(product: Product) => void} onOpen
 */
export function createProductCard(product, onAdd, onOpen) {
  const card = el("article", "product");
  const title = el("h3", "product__title");
  const open = el("button", "product__open", product.title);
  open.type = "button";
  open.addEventListener("click", () => onOpen(product));
  title.append(open);

  card.append(
    createCover(product),
    el("p", "product__artist", product.artist),
    title,
    el("p", "product__desc", product.description),
    createProductFooter(product, onAdd)
  );
  return card;
}

/**
 * @param {Element} container
 * @param {Node[]} nodes
 * @param {string} emptyMessage
 */
export function renderInto(container, nodes, emptyMessage) {
  if (nodes.length === 0) {
    container.replaceChildren(el("p", "empty-note", emptyMessage));
    return;
  }
  container.replaceChildren(...nodes);
}
