// @ts-check
// Accueil : la carte « Prochaine date » à côté des rubriques
import { getUpcomingEvents } from "../data/events.js";
import { renderNextEvent } from "../next-event.js";

export function initHome() {
  const container = document.querySelector("[data-next-event]");
  if (!container) {
    return;
  }
  const [next] = getUpcomingEvents(1);
  renderNextEvent(container, next);
}
