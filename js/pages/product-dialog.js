// Fiche produit : ouvre le détail d'un vinyle dans une fenêtre modale
import { addToCart } from "../cart.js";
import { formatPrice } from "../render.js";

export function initProductDialog() {
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
    nodes.ref.textContent = refCode.replace("Ref", "Réf.");
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
