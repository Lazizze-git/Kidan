// Page boutique : grille produits, barre panier, récapitulatif et commande
import { CONFIG } from "../config.js";
import { PRODUCTS } from "../data/products.js";
import {
  addToCart,
  clearCart,
  getCartCount,
  getCartItems,
  getCartTotal,
  onCartChange,
  setCartQty,
} from "../cart.js";
import { resetCopyButtons } from "../copy.js";
import { initOrderForm } from "../order-form.js";
import { initProductDialog } from "./product-dialog.js";
import { createProductCard, el, formatPrice, renderInto } from "../render.js";

function createOrderLine(item) {
  const line = el("li", "order-line");
  const { product, qty } = item;

  const name = el(
    "span",
    "order-line__name",
    `${product.artist}, ${product.title}`
  );

  const qtyBlock = el("span", "order-line__qty");
  const minus = el("button", "", "−");
  minus.type = "button";
  minus.setAttribute("aria-label", `Retirer un exemplaire de ${product.title}`);
  minus.addEventListener("click", () => setCartQty(product.id, qty - 1));
  const plus = el("button", "", "+");
  plus.type = "button";
  plus.setAttribute("aria-label", `Ajouter un exemplaire de ${product.title}`);
  plus.addEventListener("click", () => setCartQty(product.id, qty + 1));
  qtyBlock.append(minus, el("span", "", String(qty)), plus);

  const price = el(
    "span",
    "order-line__price",
    formatPrice(product.price * qty)
  );

  line.append(name, qtyBlock, price);
  return line;
}

function refreshOrderUI(nodes) {
  const count = getCartCount();
  const total = getCartTotal();
  const hasItems = count > 0;

  nodes.cartBar.hidden = !hasItems;
  // Panier vidé pendant que la pop-up est ouverte : on la referme
  if (!hasItems && nodes.orderSection.open) {
    nodes.orderSection.close();
  }
  nodes.cartSummary.textContent = `${count} article${count > 1 ? "s" : ""} · ${formatPrice(total)}`;
  nodes.cartTotal.textContent = formatPrice(total);
  nodes.cartLines.replaceChildren(...getCartItems().map(createOrderLine));
}

// Nouvelle commande après une confirmation : on rouvre le formulaire
function showOrderForm(nodes) {
  nodes.confirm.hidden = true;
  nodes.form.hidden = false;
  resetCopyButtons(nodes.confirm);
}

function showConfirmation(nodes, total) {
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
    nodes.confirmTitle.textContent = "Dernière étape : envoyer l’email";
    nodes.confirmText.textContent =
      "Votre logiciel d’email s’est ouvert avec la commande. Envoyez le message, puis réglez le montant total par virement ou Twint. Vos vinyles partiront dès réception du paiement.";
  }
  clearCart();
  nodes.cartBar.hidden = true;
  // La pop-up reste ouverte sur la confirmation
  if (!nodes.orderSection.open) {
    nodes.orderSection.showModal();
  }
  nodes.confirmTitle.focus();
}

export function initShop() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) {
    return;
  }

  const openProductDialog = initProductDialog();

  const nodes = {
    cartBar: document.querySelector("[data-cart-bar]"),
    cartSummary: document.querySelector("[data-cart-summary]"),
    orderSection: document.querySelector("[data-order-section]"),
    cartLines: document.querySelector("[data-cart-lines]"),
    cartTotal: document.querySelector("[data-cart-total]"),
    form: document.querySelector("[data-order-form]"),
    formError: document.querySelector("[data-form-error]"),
    confirm: document.querySelector("[data-order-confirm]"),
    confirmBeneficiary: document.querySelector("[data-confirm-beneficiary]"),
    confirmIban: document.querySelector("[data-confirm-iban]"),
    confirmTotal: document.querySelector("[data-confirm-total]"),
    confirmEmail: document.querySelector("[data-confirm-email]"),
    confirmTitle: document.querySelector("[data-confirm-title]"),
    confirmText: document.querySelector("[data-confirm-text]"),
  };

  // La commande s'ouvre en pop-up et on reste dessus
  const orderDialog = nodes.orderSection;
  const openOrderButton = document.querySelector("[data-open-order]");
  if (openOrderButton && orderDialog) {
    openOrderButton.addEventListener("click", () => {
      orderDialog.showModal();
    });
  }
  if (orderDialog) {
    const closeButton = orderDialog.querySelector("[data-order-close]");
    if (closeButton) {
      closeButton.addEventListener("click", () => orderDialog.close());
    }
    // Clic sur le fond assombri : ferme la pop-up
    orderDialog.addEventListener("click", (event) => {
      if (event.target === orderDialog) {
        orderDialog.close();
      }
    });
  }

  const cards = PRODUCTS.map((product, index) =>
    createProductCard(
      product,
      () => addToCart(product.id),
      index,
      openProductDialog
    )
  );
  renderInto(grid, cards, "La boutique arrive bientôt !");

  let orderDone = false;
  const refresh = () => {
    if (orderDone) {
      // Le panier se vide à la commande : on attend un nouvel ajout
      if (getCartCount() === 0) {
        return;
      }
      orderDone = false;
      showOrderForm(nodes);
    }
    refreshOrderUI(nodes);
  };
  refresh();
  onCartChange(refresh);

  initOrderForm({
    form: nodes.form,
    errorNode: nodes.formError,
    getItems: getCartItems,
    getTotal: getCartTotal,
    onSuccess: (total) => {
      orderDone = true;
      showConfirmation(nodes, total);
    },
  });
}
