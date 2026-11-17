// @ts-check
// Carte « Prochaine date » de l'accueil : le premier événement à venir
import { el } from "./dom.js";
import { formatEventDate } from "./dates.js";
import { createEventMeta } from "./meta-list.js";

/** @typedef {import("./data/events.js").AgendaEvent} AgendaEvent */

const EMPTY_MESSAGE =
  "Aucune date annoncée pour l’instant. Écrivez-nous pour proposer un atelier ou un concert.";

/** @param {AgendaEvent} event */
function createEventBox(event) {
  const { long } = formatEventDate(event.date);
  const box = el("div", "float-card__box");

  const head = el("p", "float-card__head");
  const time = el("time", "", long);
  time.setAttribute("datetime", event.date);
  head.append(el("span", "tag", event.tag), time);

  box.append(
    head,
    el("h3", "float-card__event", event.title),
    el("p", "float-card__desc", event.description)
  );
  return box;
}

function createAgendaLink() {
  const link = el("a", "btn btn--small", "Tout l’agenda");
  if (link instanceof HTMLAnchorElement) {
    link.href = "./agenda.html";
  }
  return link;
}

/**
 * @param {Element} container
 * @param {AgendaEvent | undefined} event
 */
export function renderNextEvent(container, event) {
  if (!event) {
    const empty = el("p", "empty-note", EMPTY_MESSAGE);
    const mail = el("a", "btn btn--small", "hello@45syndicate.ch");
    if (mail instanceof HTMLAnchorElement) {
      mail.href = "mailto:hello@45syndicate.ch";
    }
    container.replaceChildren(empty, mail);
    return;
  }
  container.replaceChildren(createEventBox(event), createEventMeta(event), createAgendaLink());
}
