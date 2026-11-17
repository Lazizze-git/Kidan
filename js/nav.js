// @ts-check
// Navigation de la plaque : menu replié sur mobile, badge du panier
import { getCartCount, onCartChange } from "./cart.js";

const DESKTOP_QUERY = "(min-width: 60rem)";

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    if (badge instanceof HTMLElement) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
  });
}

// Pendant que le menu est ouvert, le reste de la page n'est ni atteignable
// au clavier ni lu par les lecteurs d'écran.
/** @param {boolean} inert */
function setBackgroundInert(inert) {
  document.querySelectorAll("main, .site-footer").forEach((node) => {
    node.toggleAttribute("inert", inert);
  });
}

/**
 * @param {HTMLElement} toggle
 * @param {HTMLElement} menu
 * @param {boolean} open
 */
function setMenuState(toggle, menu, open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Fermer" : "Menu";
  setBackgroundInert(open);
}

/**
 * @param {HTMLElement} toggle
 * @param {HTMLElement} menu
 */
function initMenu(toggle, menu) {
  const isOpen = () => menu.classList.contains("is-open");
  const close = () => setMenuState(toggle, menu, false);

  toggle.addEventListener("click", () => {
    setMenuState(toggle, menu, !isOpen());
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      close();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (isOpen() && target instanceof Node && !toggle.contains(target) && !menu.contains(target)) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
      toggle.focus();
    }
  });

  // Passage en grand écran avec le menu ouvert : on referme proprement
  window.matchMedia(DESKTOP_QUERY).addEventListener("change", (event) => {
    if (event.matches && isOpen()) {
      close();
    }
  });
}

export function initNav() {
  const toggle = document.querySelector(".plate__toggle");
  const menu = document.querySelector(".plate__menu");
  if (toggle instanceof HTMLElement && menu instanceof HTMLElement) {
    initMenu(toggle, menu);
  }
  updateCartBadges();
  onCartChange(updateCartBadges);
}
