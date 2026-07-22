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
import { initOrderForm } from "../order-form.js";
import { createProductCard, el, formatPrice, renderInto } from "../render.js";

function createOrderLine(item) {
  const line = el("li", "order-line");
  const { product, qty } = item;

  const name = el(
    "span",
    "order-line__name",
    `${product.artist} — ${product.title}`
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
  nodes.cartSummary.textContent = `${count} article${count > 1 ? "s" : ""} — ${formatPrice(total)}`;
  nodes.cartTotal.textContent = formatPrice(total);
  nodes.cartLines.replaceChildren(...getCartItems().map(createOrderLine));
}

function showConfirmation(nodes, total) {
  nodes.form.hidden = true;
  nodes.confirm.hidden = false;
  nodes.confirmBeneficiary.textContent = CONFIG.beneficiary;
  nodes.confirmIban.textContent = CONFIG.iban;
  nodes.confirmTotal.textContent = formatPrice(total);
  nodes.confirmEmail.textContent = CONFIG.contactEmail;
  nodes.confirmEmail.href = `mailto:${CONFIG.contactEmail}`;
  clearCart();
  nodes.cartBar.hidden = true;
  // La pop-up reste ouverte sur la confirmation
  if (!nodes.orderSection.open) {
    nodes.orderSection.showModal();
  }
  nodes.confirm.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Fiche produit : ouvre le détail d'un vinyle dans une fenêtre modale
function initProductDialog() {
  const dialog = document.querySelector("[data-product-dialog]");
  if (!dialog) {
    return () => {};
  }

  const nodes = {
    ref: dialog.querySelector("[data-dialog-ref]"),
    initial: dialog.querySelector("[data-dialog-initial]"),
    artist: dialog.querySelector("[data-dialog-artist]"),
    title: dialog.querySelector("[data-dialog-title]"),
    desc: dialog.querySelector("[data-dialog-desc]"),
    price: dialog.querySelector("[data-dialog-price]"),
    add: dialog.querySelector("[data-dialog-add]"),
    soldout: dialog.querySelector("[data-dialog-soldout]"),
  };

  let currentProduct = null;

  nodes.add.addEventListener("click", () => {
    if (currentProduct) {
      addToCart(currentProduct.id);
      dialog.close();
    }
  });

  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => {
    dialog.close();
  });

  // Clic sur le fond assombri : ferme la fiche
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return (product, refCode) => {
    currentProduct = product;
    nodes.ref.textContent = `${refCode.replace(" ", "_").toUpperCase()}.TXT`;
    nodes.initial.textContent = product.labelInitial;
    nodes.artist.textContent = product.artist;
    nodes.title.textContent = product.title;
    nodes.desc.textContent = product.description;
    nodes.price.textContent = formatPrice(product.price);
    nodes.add.hidden = !product.available;
    nodes.soldout.hidden = product.available;
    dialog.showModal();
  };
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
  renderInto(grid, cards, "La boutique arrive bientôt !");

  let orderDone = false;
  const refresh = () => {
    if (!orderDone) {
      refreshOrderUI(nodes);
    }
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
