// Sections dépliantes : ouvre/ferme un panneau et tient l'état ARIA à jour
export function initAccordions() {
  const toggles = document.querySelectorAll("[data-accordion-toggle]");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest("[data-accordion-item]");
      if (!item) {
        return;
      }
      const isOpen = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });
}
