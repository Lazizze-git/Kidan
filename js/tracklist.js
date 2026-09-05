// Platine de l'accueil : la ligne survolée devient la piste "en lecture".
// Le disque tourne en continu avec le logo au centre ; ce qui change au
// survol, c'est la couleur de l'étiquette et la légende sous le disque.
export function initTracklist() {
  const list = document.querySelector("[data-tracklist]");
  const discCaption = document.querySelector("[data-disc-caption]");
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
    row.addEventListener("mouseenter", activate);
    row.addEventListener("focus", activate);
  });
}
