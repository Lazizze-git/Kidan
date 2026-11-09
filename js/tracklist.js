// Platine de l'accueil : le flyer survolé ou focalisé passe sur la platine.
// Le disque ne tourne que pendant ce temps ; la couleur de l'étiquette et
// la légende suivent le dernier flyer touché.
export function initTracklist() {
  const list = document.querySelector("[data-tracklist]");
  const discCaption = document.querySelector("[data-disc-caption]");
  const disc = document.querySelector(".player-disc");
  const discLabel = document.querySelector(".player-disc__label");
  if (!list || !discCaption) {
    return;
  }

  const rows = Array.from(list.querySelectorAll("[data-track]"));
  rows.forEach((row) => {
    const activate = () => {
      discCaption.textContent = row.dataset.trackLabel ?? "";
      if (discLabel) {
        const color = getComputedStyle(row).getPropertyValue("--disc-color");
        discLabel.style.backgroundColor = color.trim();
      }
      rows.forEach((other) => {
        other.classList.toggle("is-active", other === row);
      });
    };
    const stop = () => disc?.classList.remove("is-playing");
    row.addEventListener("mouseenter", () => {
      activate();
      disc?.classList.add("is-playing");
    });
    row.addEventListener("focus", () => {
      activate();
      disc?.classList.add("is-playing");
    });
    row.addEventListener("mouseleave", stop);
    row.addEventListener("blur", stop);
  });
}
