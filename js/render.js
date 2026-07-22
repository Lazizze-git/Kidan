// Petites briques de rendu partagées entre les pages
const priceFormatter = new Intl.NumberFormat("fr-CH", {
  style: "currency",
  currency: "CHF",
});

export function formatPrice(value) {
  return priceFormatter.format(value);
}

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
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

export function createEventCard(event) {
  const card = el("article", "event-card reveal");
  const { day, month, full } = eventDateParts(event.date);

  const dateBlock = el("div", "event-card__date");
  const dayNode = el("span", "event-card__day", day);
  const monthNode = el("span", "event-card__month", month);
  dateBlock.append(dayNode, monthNode);
  dateBlock.setAttribute("aria-label", full);

  const body = el("div", "event-card__body");
  body.append(el("h3", "event-card__title", event.title));

  const meta = el("p", "event-card__meta");
  meta.append(
    el("span", "", `${event.timeStart} – ${event.timeEnd}`),
    el("span", "", event.place),
    el("span", "", event.price)
  );
  body.append(meta, el("p", "event-card__desc", event.description));

  card.append(dateBlock, body, el("span", "event-card__tag", event.tag));
  return card;
}

export function createVinylVisual(labelInitial) {
  const vinyl = el("div", "vinyl");
  vinyl.setAttribute("aria-hidden", "true");
  vinyl.append(el("div", "vinyl__disc"), el("div", "vinyl__label", labelInitial));
  return vinyl;
}

export function createProductCard(product, onAdd, index, onOpen) {
  const card = el("article", "product-card window reveal");
  const refCode = `Ref 45S-${String(index + 1).padStart(2, "0")}`;

  const footer = el("div", "product-card__footer");
  footer.append(el("p", "product-card__price", formatPrice(product.price)));

  if (!product.available) {
    footer.append(el("p", "product-card__soldout", "Épuisé"));
  } else {
    const button = el("button", "btn btn--primary product-card__add", "Ajouter");
    button.type = "button";
    button.addEventListener("click", () => onAdd(product));
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
