// Platine de l'accueil : la ligne survolée devient la piste "en lecture",
// et l'étiquette du disque prend la couleur de la piste
export function initTracklist() {
  const list = document.querySelector("[data-tracklist]");
  const discNum = document.querySelector("[data-disc-num]");
  const discCaption = document.querySelector("[data-disc-caption]");
  const discLabel = document.querySelector(".player-disc__label");
  if (!list || !discNum || !discCaption) {
    return;
  }

  const rows = Array.from(list.querySelectorAll("[data-track]"));
  rows.forEach((row) => {
    const activate = () => {
      discNum.textContent = row.dataset.track ?? "";
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
