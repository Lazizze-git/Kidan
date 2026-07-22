// Page d'accueil : platine de la tracklist et teaser agenda
import { getUpcomingEvents } from "../data/events.js";
import { createEventCard, renderInto } from "../render.js";
import { initTracklist } from "../tracklist.js";

export function initHome() {
  initTracklist();

  const eventsContainer = document.querySelector("[data-events-teaser]");
  if (!eventsContainer) {
    return;
  }
  const cards = getUpcomingEvents(2).map(createEventCard);
  renderInto(
    eventsContainer,
    cards,
    "Aucun événement programmé pour le moment — revenez bientôt !"
  );
}
