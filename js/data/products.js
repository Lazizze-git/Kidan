// @ts-check
// Catalogue de la boutique solidaire.
// Pour ajouter un vinyle : copier un bloc, changer les valeurs, sauvegarder.
// `available: false` affiche le produit comme épuisé.
// `cover` (facultatif) : { src: "./assets/pochettes/xxx.jpg", alt: "Pochette de …" },
// image carrée de 600 × 600 px au moins. Sans pochette, le site affiche
// « [Pochette à fournir] ».

/**
 * @typedef {object} Product
 * @property {string} id
 * @property {string} artist
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {boolean} available
 * @property {{ src: string, alt: string }} [cover]
 */

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: "vinyle-01",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 30,
    available: true,
  },
  {
    id: "vinyle-02",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 28,
    available: true,
  },
  {
    id: "vinyle-03",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 32,
    available: true,
  },
  {
    id: "vinyle-04",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 25,
    available: true,
  },
  {
    id: "vinyle-05",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 35,
    available: true,
  },
  {
    id: "vinyle-06",
    artist: "Artiste à définir",
    title: "Titre de l’album",
    description:
      "Courte description du vinyle : style musical, année, anecdote. Deux phrases suffisent.",
    price: 30,
    available: false,
  },
];

/**
 * @param {string} id
 * @returns {Product | null}
 */
export function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id) ?? null;
}
