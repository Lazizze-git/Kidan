// Point d'entrée JS — initialise la navigation, les animations et la page courante
import { initAccordions } from "./accordion.js";
import { initNav } from "./nav.js";
import { initScrollReveal } from "./scroll-reveal.js";
import { initFence } from "./fence.js";
import { initHome } from "./pages/home.js";
import { initShop } from "./pages/shop.js";
import { initAgenda } from "./pages/agenda.js";

// Signale que le JS est actif : les animations de reveal peuvent masquer
// le contenu sans risque (sans JS, tout reste visible)
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
  // Après le rendu des contenus dynamiques, pour que tout soit observé
  initScrollReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
