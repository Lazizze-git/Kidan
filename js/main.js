// Point d'entrée JS : initialise la navigation, les copies d'IBAN et la page courante
import { initAccordions } from "./accordion.js";
import { initNav } from "./nav.js";
import { initCopyButtons } from "./copy.js";
import { initFence } from "./fence.js";
import { initHome } from "./pages/home.js";
import { initShop } from "./pages/shop.js";
import { initAgenda } from "./pages/agenda.js";

// Signale que le JS est actif : le menu mobile peut se replier sans risque
// (sans JS, il reste ouvert et la navigation reste utilisable)
document.documentElement.classList.add("js");

const PAGE_INITS = {
  home: initHome,
  shop: initShop,
  agenda: initAgenda,
};

function start() {
  initNav();
  initAccordions();
  initFence();
  const initPage = PAGE_INITS[document.body.dataset.page];
  if (initPage) {
    initPage();
  }
  initCopyButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
