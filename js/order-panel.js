// @ts-check
// Fenêtre de commande : lignes du panier, barre du panier, confirmation
import { CONFIG } from "./config.js";
import { clearCart, getCartCount, getCartItems, getCartTotal, setCartQty } from "./cart.js";
import { resetCopyButtons } from "./copy.js";
import { el, requireElement } from "./dom.js";
import { formatPrice } from "./render.js";

/** @typedef {import("./cart.js").CartItem} CartItem */
/**
 * @typedef {object} OrderNodes
 * @property {HTMLElement} cartBar
 * @property {HTMLElement} cartSummary
 * @property {HTMLDialogElement} dialog
 * @property {HTMLElement} cartLines
 * @property {HTMLElement} cartTotal
 * @property {HTMLFormElement} form
 * @property {HTMLElement} formError
 * @property {HTMLElement} confirm
 * @property {HTMLElement} confirmBeneficiary
 * @property {HTMLElement} confirmIban
 * @property {HTMLElement} confirmTotal
 * @property {HTMLAnchorElement} confirmEmail
 * @property {HTMLElement} confirmTitle
 * @property {HTMLElement} confirmText
 */

/** @returns {OrderNodes} */
export function readOrderNodes() {
  const find = (/** @type {string} */ selector) => requireElement(document, selector, HTMLElement);
  return {
    cartBar: find("[data-cart-bar]"),
    cartSummary: find("[data-cart-summary]"),
    dialog: requireElement(document, "[data-order-section]", HTMLDialogElement),
    cartLines: find("[data-cart-lines]"),
    cartTotal: find("[data-cart-total]"),
    form: requireElement(document, "[data-order-form]", HTMLFormElement),
    formError: find("[data-form-error]"),
    confirm: find("[data-order-confirm]"),
    confirmBeneficiary: find("[data-confirm-beneficiary]"),
    confirmIban: find("[data-confirm-iban]"),
    confirmTotal: find("[data-confirm-total]"),
    confirmEmail: requireElement(document, "[data-confirm-email]", HTMLAnchorElement),
    confirmTitle: find("[data-confirm-title]"),
    confirmText: find("[data-confirm-text]"),
  };
}

/**
 * @param {string} label
 * @param {string} accessibleName
 * @param {() => void} onClick
 */
function createQtyButton(label, accessibleName, onClick) {
  const button = el("button", "", label);
  button.type = "button";
  button.setAttribute("aria-label", accessibleName);
  button.addEventListener("click", onClick);
  return button;
}

/** @param {CartItem} item */
function createOrderLine({ product, qty }) {
  const line = el("li", "order-line");
  const qtyBlock = el("span", "order-line__qty");
  qtyBlock.append(
    createQtyButton("−", `Retirer un exemplaire de ${product.title}`, () =>
      setCartQty(product.id, qty - 1)
    ),
    el("span", "", String(qty)),
    createQtyButton("+", `Ajouter un exemplaire de ${product.title}`, () =>
      setCartQty(product.id, qty + 1)
    )
  );
  line.append(
    el("span", "order-line__name", `${product.artist}, ${product.title}`),
    qtyBlock,
    el("span", "order-line__price", formatPrice(product.price * qty))
  );
  return line;
}

/** @param {OrderNodes} nodes */
export function refreshOrderUI(nodes) {
  const count = getCartCount();
  const total = getCartTotal();
  nodes.cartBar.hidden = count === 0;
  // Panier vidé pendant que la fenêtre est ouverte : on la referme
  if (count === 0 && nodes.dialog.open) {
    nodes.dialog.close();
  }
  nodes.cartSummary.textContent = `${count} article${count > 1 ? "s" : ""}, ${formatPrice(total)}`;
  nodes.cartTotal.textContent = formatPrice(total);
  nodes.cartLines.replaceChildren(...getCartItems().map(createOrderLine));
}

/**
 * Nouvelle commande après une confirmation : on rouvre le formulaire
 * @param {OrderNodes} nodes
 */
export function showOrderForm(nodes) {
  nodes.confirm.hidden = true;
  nodes.form.hidden = false;
  resetCopyButtons(nodes.confirm);
}

/**
 * @param {OrderNodes} nodes
 * @param {number} total
 */
export function showConfirmation(nodes, total) {
  resetCopyButtons(nodes.confirm);
  nodes.form.hidden = true;
  nodes.confirm.hidden = false;
  nodes.confirmBeneficiary.textContent = CONFIG.beneficiary;
  nodes.confirmIban.textContent = CONFIG.iban;
  nodes.confirmTotal.textContent = formatPrice(total);
  nodes.confirmEmail.textContent = CONFIG.contactEmail;
  nodes.confirmEmail.href = `mailto:${CONFIG.contactEmail}`;
  // Sans service de formulaire, la commande part par le logiciel d'email du
  // visiteur : on ne peut pas savoir s'il a envoyé le message, donc on le lui dit.
  if (CONFIG.orderEndpoint === "") {
    nodes.confirmTitle.textContent = "Dernière étape : envoyer l’email";
    nodes.confirmText.textContent =
      "Votre logiciel d’email s’est ouvert avec la commande. Envoyez le message, puis réglez le montant total par virement ou Twint. Vos vinyles partiront dès réception du paiement.";
  }
  clearCart();
  nodes.cartBar.hidden = true;
  // La fenêtre reste ouverte sur la confirmation
  if (!nodes.dialog.open) {
    nodes.dialog.showModal();
  }
  nodes.confirmTitle.focus();
}

/**
 * Ouverture par la barre du panier ; fermeture par le bouton, Échap ou le fond
 * @param {OrderNodes} nodes
 */
export function wireOrderDialog(nodes) {
  const { dialog } = nodes;
  requireElement(nodes.cartBar, "[data-open-order]", HTMLButtonElement).addEventListener(
    "click",
    () => dialog.showModal()
  );
  requireElement(dialog, "[data-order-close]", HTMLButtonElement).addEventListener("click", () =>
    dialog.close()
  );
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}
