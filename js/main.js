// @ts-check
// Point d'entrée : la piste du fond, la navigation, la page courante
import { initCopyButtons } from "./copy.js";
import { initField } from "./field.js";
import { initNav } from "./nav.js";
import { initAgenda } from "./pages/agenda.js";
import { initHome } from "./pages/home.js";
import { initShop } from "./pages/shop.js";

/** @type {Record<string, () => void>} */
const PAGE_INITS = {
  home: initHome,
  shop: initShop,
  agenda: initAgenda,
};

/**
 * Chaque module démarre seul : une erreur dans l'un est signalée au
 * navigateur sans empêcher les autres de fonctionner.
 * @param {() => void} init
 */
function run(init) {
  try {
    init();
  } catch (error) {
    window.reportError(error);
  }
}

function start() {
  const initPage = PAGE_INITS[document.body.dataset.page ?? ""];
  [initField, initNav, initPage, initCopyButtons].forEach((init) => {
    if (init) {
      run(init);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
