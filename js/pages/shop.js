// @ts-check
// Page boutique : catalogue, fiche vinyle, panier et commande
import { PRODUCTS } from "../data/products.js";
import { addToCart, getCartCount, getCartItems, getCartTotal, onCartChange } from "../cart.js";
import { initOrderForm } from "../order-form.js";
import {
  readOrderNodes,
  refreshOrderUI,
  showConfirmation,
  showOrderForm,
  wireOrderDialog,
} from "../order-panel.js";
import { createProductCard, renderInto } from "../render.js";
import { initProductDialog } from "./product-dialog.js";

const EMPTY_MESSAGE =
  "Les premiers vinyles arrivent bientôt. Écrivez-nous pour être prévenu·e de leur sortie.";

export function initShop() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) {
    return;
  }

  const openProductDialog = initProductDialog();
  const cards = PRODUCTS.map((product) =>
    createProductCard(product, () => addToCart(product.id), openProductDialog)
  );
  renderInto(grid, cards, EMPTY_MESSAGE);

  const nodes = readOrderNodes();
  wireOrderDialog(nodes);

  // Après une commande, le panier est vide : la confirmation reste affichée
  // jusqu'au prochain ajout, qui rouvre le formulaire.
  let orderDone = false;
  const refresh = () => {
    if (orderDone) {
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
