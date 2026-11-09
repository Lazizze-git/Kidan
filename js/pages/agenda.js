// Page agenda : liste complète des événements à venir
import { getUpcomingEvents } from "../data/events.js";
import { createEventCard, renderInto } from "../render.js";

export function initAgenda() {
  const container = document.querySelector("[data-events-list]");
  if (!container) {
    return;
  }
  const cards = getUpcomingEvents().map((event) => createEventCard(event, { detailed: true }));
  renderInto(
    container,
    cards,
    "Aucun événement programmé pour le moment. Revenez bientôt, ou écrivez-nous pour proposer une date."
  );
}
