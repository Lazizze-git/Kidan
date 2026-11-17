// @ts-check
// Page agenda : tous les événements à venir, en cartes
import { getUpcomingEvents } from "../data/events.js";
import { createEventCard } from "../event-card.js";
import { renderInto } from "../render.js";

const EMPTY_MESSAGE =
  "Aucun événement programmé pour le moment. Revenez bientôt, ou écrivez-nous pour proposer une date.";

export function initAgenda() {
  const container = document.querySelector("[data-events-list]");
  if (!container) {
    return;
  }
  renderInto(container, getUpcomingEvents().map(createEventCard), EMPTY_MESSAGE);
}
