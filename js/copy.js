// Boutons « Copier » : copient le texte d'un élément (l'IBAN) dans le presse-papiers
const FEEDBACK_MS = 2000;

async function writeToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Repli (page ouverte en http local) : sélection + commande de copie
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) {
    throw new Error("Copie impossible");
  }
}

const resetters = new WeakMap();

function announce(button, message) {
  const status = button.nextElementSibling;
  if (status?.getAttribute("role") === "status") {
    status.textContent = message;
  }
}

// Remet le bouton à son état d'origine (libellé, couleur, annonce)
function resetButton(button) {
  const reset = resetters.get(button);
  if (reset) {
    reset();
  }
}

function flashLabel(button, label, message) {
  resetButton(button);
  const idle = button.textContent;
  let timer = 0;
  const reset = () => {
    window.clearTimeout(timer);
    button.textContent = idle;
    button.classList.remove("is-copied");
    announce(button, "");
    resetters.delete(button);
  };
  resetters.set(button, reset);
  button.textContent = label;
  announce(button, message);
  timer = window.setTimeout(reset, FEEDBACK_MS);
}

async function copyFrom(button) {
  const source = document.querySelector(button.dataset.copyTarget ?? "");
  const text = source?.textContent?.trim() ?? "";
  if (text === "") {
    return;
  }
  try {
    await writeToClipboard(text);
    flashLabel(button, "IBAN copié", "IBAN copié dans le presse-papiers.");
    button.classList.add("is-copied");
  } catch {
    // La copie a échoué : l'IBAN reste affiché, on invite à le sélectionner
    flashLabel(
      button,
      "Copie impossible",
      "La copie a échoué. Sélectionnez l’IBAN à la main."
    );
  }
}

// À rappeler quand une zone contenant un bouton est réaffichée
export function resetCopyButtons(root) {
  root.querySelectorAll("[data-copy-target]").forEach(resetButton);
}

export function initCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    // Zone d'annonce voisine, invisible : le libellé du bouton reste court
    const status = document.createElement("span");
    status.className = "visually-hidden";
    status.setAttribute("role", "status");
    button.insertAdjacentElement("afterend", status);
    button.addEventListener("click", () => copyFrom(button));
  });
}
