// Agenda de l'association.
// Pour ajouter un événement : copier un bloc, changer les valeurs, sauvegarder.
// Les événements passés disparaissent automatiquement du site.
// Champs facultatifs, affichés sur la page Agenda :
//   program : liste de { title, points } (déroulé de l'atelier)
//   link    : { href, label } (inscription, billetterie…)
//   poster  : { src, alt } (affiche, ouverte en grand au clic)
export const EVENTS = [
  {
    id: "atelier-dj-mao-11",
    title: "Atelier DJ et production musicale",
    tag: "Atelier",
    date: "2026-11-14",
    timeStart: "15:00",
    timeEnd: "17:00",
    place: "Maison de quartier sous-gare, Lausanne",
    description:
      "Deux heures pour découvrir le mix et la production musicale avec les associations AKWI et 45 Syndicate. Ouvert aux débutantes et aux débutants, de 8 à 99 ans : viens expérimenter, créer et peut-être faire naître une passion.",
    price: "Inscription via QR code",
    program: [
      {
        title: "DJ — cours sur la DDJ-RX3",
        points: [
          "Choisir un son dans une playlist et le charger sur une piste",
          "Régler le BPM",
          "Connaître et appliquer le phrasing",
          "Passer de la piste A à la piste B",
        ],
      },
      {
        title: "MAO — cours sur la MPC Live 2",
        points: [
          "Importer un sample sur une piste",
          "Adapter et créer une loop",
          "Créer une rythmique adaptée",
        ],
      },
    ],
    link: {
      href: "https://maisondequartiersousgare.ch/",
      label: "S’inscrire en ligne",
    },
    poster: {
      src: "./assets/affiche-atelier-dj-production.jpg",
      alt: "Affiche de l’atelier DJ et production musicale, samedi 14 novembre 2026, de 15 h à 17 h, à la Maison de quartier sous-gare. Inscription via le QR code.",
    },
  },
  {
    id: "atelier-production-09",
    title: "Cours de production musicale",
    tag: "Atelier",
    date: "2026-09-12",
    timeStart: "14:00",
    timeEnd: "17:00",
    place: "Local 45 Syndicate, Lausanne",
    description:
      "Initiation à la production musicale : composition, enregistrement et mixage. Ouvert à toutes et tous, aucun prérequis. Matériel fourni.",
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
      "Une soirée pour découvrir les artistes de la région : chacun·e peut monter sur scène. Bar associatif sur place.",
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
      "Sortie officielle d’un nouveau vinyle de la boutique solidaire, avec concert de l’artiste et rencontre autour d’un verre.",
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
