// @ts-check
// Un événement de l'agenda, en carte : bande de titre avec la date,
// description, heure / lieu / accès, puis programme, inscription, affiche.
import { el } from "./dom.js";
import { formatEventDate } from "./dates.js";
import { createEventExtras } from "./event-extras.js";
import { createEventMeta } from "./meta-list.js";

/** @typedef {import("./data/events.js").AgendaEvent} AgendaEvent */

/** @param {AgendaEvent} event */
function createBar(event) {
  const bar = el("div", "card__bar");
  const time = el("time", "event__date", formatEventDate(event.date).long);
  time.setAttribute("datetime", event.date);
  bar.append(el("h3", "card__title", event.title), time);
  return bar;
}

/**
 * @param {AgendaEvent} event
 * @returns {HTMLElement}
 */
export function createEventCard(event) {
  const card = el("article", "card event");
  const body = el("div", "card__body event__body");
  const main = el("div", "event__main");
  const tags = el("p", "card__links");
  tags.append(el("span", "tag tag--filled", event.tag));
  main.append(tags, el("p", "event__desc", event.description), createEventMeta(event));

  const extras = createEventExtras(event);
  const poster = extras.find((node) => node.classList.contains("event__poster"));
  main.append(...extras.filter((node) => node !== poster));
  body.append(main);
  if (poster) {
    body.append(poster);
    card.classList.add("event--poster");
  }
  card.append(createBar(event), body);
  return card;
}
