// Détails d'un événement (programme, inscription, affiche) : page Agenda seulement
import { el } from "./dom.js";

function createProgram(program) {
  const wrapper = el("div", "event-card__program");
  program.forEach((part) => {
    const block = el("div", "event-card__program-part");
    const list = el("ul", "event-card__program-list");
    list.append(...part.points.map((point) => el("li", "", point)));
    block.append(el("h4", "event-card__program-title", part.title), list);
    wrapper.append(block);
  });
  return wrapper;
}

function createLink({ href, label }) {
  const link = el("a", "btn btn--primary event-card__link", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function createPoster({ src, alt }) {
  const link = el("a", "event-card__poster");
  link.href = src;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "Voir l’affiche en grand (nouvel onglet)");
  const image = el("img");
  image.src = src;
  image.alt = alt;
  image.width = 735;
  image.height = 1040;
  image.loading = "lazy";
  link.append(image);
  return link;
}

export function createEventExtras(event) {
  const extras = [];
  if (event.program) {
    extras.push(createProgram(event.program));
  }
  if (event.link) {
    extras.push(createLink(event.link));
  }
  if (event.poster) {
    extras.push(createPoster(event.poster));
  }
  return extras;
}
