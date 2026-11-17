// @ts-check
// Détails d'un événement (programme, inscription, affiche) : page Agenda
import { el } from "./dom.js";

/** @typedef {import("./data/events.js").AgendaEvent} AgendaEvent */

/** @param {NonNullable<AgendaEvent["program"]>} program */
function createProgram(program) {
  const wrapper = el("div", "event__program");
  program.forEach((part) => {
    const block = el("div", "event__program-part");
    const list = el("ul", "event__program-list");
    list.append(...part.points.map((point) => el("li", "", point)));
    block.append(el("h4", "event__program-title", part.title), list);
    wrapper.append(block);
  });
  return wrapper;
}

/** @param {NonNullable<AgendaEvent["link"]>} link */
function createLink({ href, label }) {
  const wrapper = el("p", "event__action");
  const link = el("a", "btn btn--solid", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  wrapper.append(link);
  return wrapper;
}

/** @param {NonNullable<AgendaEvent["poster"]>} poster */
function createPoster({ src, alt }) {
  const link = el("a", "event__poster");
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

/**
 * @param {AgendaEvent} event
 * @returns {HTMLElement[]}
 */
export function createEventExtras(event) {
  /** @type {HTMLElement[]} */
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
