// Catalogue de la boutique solidaire.
// Pour ajouter un vinyle : copier un bloc, changer les valeurs, sauvegarder.
// `available: false` affiche le produit comme épuisé.
export const PRODUCTS = [
  {
    id: "vinyle-01",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 30,
    labelInitial: "A",
    available: true,
  },
  {
    id: "vinyle-02",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 28,
    labelInitial: "B",
    available: true,
  },
  {
    id: "vinyle-03",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 32,
    labelInitial: "C",
    available: true,
  },
  {
    id: "vinyle-04",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 25,
    labelInitial: "D",
    available: true,
  },
  {
    id: "vinyle-05",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 35,
    labelInitial: "E",
    available: true,
  },
  {
    id: "vinyle-06",
    artist: "Artiste à définir",
    title: "Titre de l'album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 30,
    labelInitial: "F",
    available: false,
  },
];

export function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id) ?? null;
}
