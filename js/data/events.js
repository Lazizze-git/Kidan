// Agenda de l'association.
// Pour ajouter un événement : copier un bloc, changer les valeurs, sauvegarder.
// Les événements passés disparaissent automatiquement du site.
export const EVENTS = [
  {
    id: "atelier-production-09",
    title: "Cours de production musicale",
    tag: "Atelier",
    date: "2026-09-12",
    timeStart: "14:00",
    timeEnd: "17:00",
    place: "Local 45 Syndicate, Lausanne",
    description:
      "Initiation à la production musicale : composition, enregistrement et mixage. Ouvert à toutes et tous, aucun prérequis. Matériel fourni.",
    price: "Prix libre",
  },
  {
    id: "scene-ouverte-10",
    title: "Scène ouverte 45 Syndicate",
    tag: "Concert",
    date: "2026-10-03",
    timeStart: "19:00",
    timeEnd: "23:00",
    place: "Lieu à confirmer, Lausanne",
    description:
      "Une soirée pour découvrir les artistes de la région : chacun·e peut monter sur scène. Bar associatif sur place.",
    price: "Entrée libre",
  },
  {
    id: "vernissage-vinyle-11",
    title: "Vernissage vinyle et concert",
    tag: "Sortie",
    date: "2026-11-21",
    timeStart: "18:30",
    timeEnd: "22:00",
    place: "Local 45 Syndicate, Lausanne",
    description:
      "Sortie officielle d'un nouveau vinyle de la boutique solidaire, avec concert de l'artiste et rencontre autour d'un verre.",
    price: "Entrée libre",
  },
];

export function getUpcomingEvents(limit = Infinity) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return EVENTS.filter((event) => new Date(`${event.date}T23:59:59`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}
