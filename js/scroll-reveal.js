// Apparition en douceur des sections au défilement
let observer = null;

function getObserver() {
  if (observer === null) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
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
