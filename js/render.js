// Petites briques de rendu partagées entre les pages
import { el } from "./dom.js";
import { createEventExtras } from "./event-extras.js";

export { el };

const priceFormatter = new Intl.NumberFormat("fr-CH", {
  style: "currency",
  currency: "CHF",
});

export function formatPrice(value) {
  return priceFormatter.format(value);
}

function eventDateParts(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  const day = new Intl.DateTimeFormat("fr-CH", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("fr-CH", { month: "short" }).format(date);
  const full = new Intl.DateTimeFormat("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return { day, month, full };
}

export function createEventCard(event, options = {}) {
  const card = el("article", "event-card");
  const { day, month, full } = eventDateParts(event.date);

  const dateBlock = el("time", "event-card__date");
  dateBlock.dateTime = event.date;
  dateBlock.setAttribute("aria-label", full);
  dateBlock.append(
    el("span", "event-card__day", day),
    el("span", "event-card__month", month)
  );

  const body = el("div", "event-card__body");
  body.append(el("h3", "event-card__title", event.title));

  const meta = el("p", "event-card__meta");
  meta.append(
    el("span", "", `${event.timeStart} – ${event.timeEnd}`),
    el("span", "", event.place),
    el("span", "", event.price)
  );
  body.append(meta, el("p", "event-card__desc", event.description));
  if (options.detailed) {
    body.append(...createEventExtras(event));
  }

  card.append(dateBlock, body, el("span", "event-card__tag", event.tag));
  return card;
}

export function createVinylVisual(labelInitial) {
  const vinyl = el("div", "vinyl");
  vinyl.setAttribute("aria-hidden", "true");
  vinyl.append(el("div", "vinyl__disc"), el("div", "vinyl__label", labelInitial));
  return vinyl;
}

const ADDED_FEEDBACK_MS = 1500;

// Le bouton dit « Ajouté » un instant : le panier a bien reçu le vinyle
function confirmAdded(button, title) {
  const idleLabel = `Ajouter ${title} au panier`;
  button.textContent = "Ajouté";
  button.setAttribute("aria-label", `${title} ajouté au panier`);
  window.setTimeout(() => {
    button.textContent = "Ajouter";
    button.setAttribute("aria-label", idleLabel);
  }, ADDED_FEEDBACK_MS);
}

export function createProductCard(product, onAdd, index, onOpen) {
  const card = el("article", "product-card window");
  const refCode = `Ref 45S-${String(index + 1).padStart(2, "0")}`;

  const footer = el("div", "product-card__footer");
  footer.append(el("p", "product-card__price", formatPrice(product.price)));

  if (!product.available) {
    footer.append(el("p", "product-card__soldout", "Épuisé"));
  } else {
    const button = el("button", "btn btn--primary product-card__add", "Ajouter");
    button.type = "button";
    button.setAttribute("aria-label", `Ajouter ${product.title} au panier`);
    button.addEventListener("click", () => {
      onAdd(product);
      confirmAdded(button, product.title);
    });
    footer.append(button);
  }

  // Le titre est un vrai bouton : accessible au clavier, il ouvre la fiche
  const title = el("h3", "product-card__title");
  const titleButton = el("button", "product-card__more", product.title);
  titleButton.type = "button";
  titleButton.addEventListener("click", () => onOpen(product, refCode));
  title.append(titleButton);

  card.append(
    createVinylVisual(product.labelInitial),
    el("p", "product-card__ref", refCode),
    el("p", "product-card__artist", product.artist),
    title,
    el("p", "product-card__desc", product.description),
    footer
  );

  // Toute la carte est cliquable, sauf le bouton d'ajout au panier
  card.addEventListener("click", (event) => {
    if (event.target.closest(".product-card__add, .product-card__more")) {
      return;
    }
    onOpen(product, refCode);
  });

  return card;
}

export function renderInto(container, nodes, emptyMessage) {
  container.replaceChildren();
  if (nodes.length === 0) {
    container.append(el("p", "empty-note", emptyMessage));
    return;
  }
  container.append(...nodes);
}
