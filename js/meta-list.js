// @ts-check
// Liste « étiquette : valeur » d'un événement (heure, lieu, accès)
import { el } from "./dom.js";
import { formatTimeRange } from "./dates.js";

/** @typedef {import("./data/events.js").AgendaEvent} AgendaEvent */

/**
 * @param {AgendaEvent} event
 * @returns {HTMLDListElement}
 */
export function createEventMeta(event) {
  const list = /** @type {HTMLDListElement} */ (el("dl", "meta-list"));
  const rows = [
    ["Heure", formatTimeRange(event.timeStart, event.timeEnd)],
    ["Lieu", event.place],
    ["Accès", event.price],
  ];
  rows.forEach(([label, value]) => {
    const row = el("div");
    row.append(el("dt", "", label), el("dd", "", value));
    list.append(row);
  });
  return list;
}
