// Apparition des affiches au défilement.
// Quand plusieurs affiches entrent en même temps dans l'écran, elles se
// posent en cascade (de haut en bas) plutôt que toutes d'un bloc.
const STAGGER_STEP_MS = 70;
const STAGGER_MAX_STEPS = 5;

let observer = null;

function revealBatch(entries) {
  const visible = entries.filter((entry) => entry.isIntersecting);
  if (visible.length === 0) {
    return;
  }

  // L'ordre des entrées n'est pas garanti : on remet la cascade dans
  // l'ordre visuel, de haut en bas.
  visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

  visible.forEach((entry, index) => {
    const step = Math.min(index, STAGGER_MAX_STEPS);
    entry.target.style.setProperty(
      "--reveal-delay",
      `${step * STAGGER_STEP_MS}ms`
    );
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}

function getObserver() {
  if (observer === null) {
    observer = new IntersectionObserver(revealBatch, {
      threshold: 0.08,
      rootMargin: "0px 0px -60px 0px",
    });
  }
  return observer;
}

export function initScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((node) => node.classList.add("is-visible"));
    return;
  }

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => {
    getObserver().observe(node);
  });
}
