// Menu mobile plein écran, header réactif au scroll, badge panier
import { getCartCount, onCartChange } from "./cart.js";

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

const DESKTOP_QUERY = "(min-width: 900px)";

// Pendant que le menu plein écran est ouvert, le reste de la page n'est
// ni atteignable au clavier ni lu par les lecteurs d'écran.
function setBackgroundInert(inert) {
  document.querySelectorAll("main, .site-footer").forEach((node) => {
    node.toggleAttribute("inert", inert);
  });
}

function setMenuState(toggle, menu, open) {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  const label = toggle.querySelector(".nav__toggle-label");
  if (label) {
    label.textContent = open ? "Fermer" : "Menu";
  }
  document.body.classList.toggle("nav-open", open);
  setBackgroundInert(open);
}

function initMenu(toggle, menu) {
  toggle.addEventListener("click", () => {
    setMenuState(toggle, menu, !menu.classList.contains("is-open"));
  });

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a") !== null) {
      setMenuState(toggle, menu, false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenuState(toggle, menu, false);
      toggle.focus();
    }
  });

  // Passage en grand écran avec le menu ouvert : on referme proprement
  window.matchMedia(DESKTOP_QUERY).addEventListener("change", (event) => {
    if (event.matches && menu.classList.contains("is-open")) {
      setMenuState(toggle, menu, false);
    }
  });
}

function initHeaderShadow(header) {
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

export function initNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    initMenu(toggle, menu);
  }
  if (header) {
    initHeaderShadow(header);
  }

  updateCartBadges();
  onCartChange(updateCartBadges);
}
