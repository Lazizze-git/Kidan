# Site de l'association 45 Syndicate

Site vitrine + boutique solidaire. 100% statique : aucun serveur, aucun abonnement, hébergement gratuit possible (Netlify, Vercel, GitHub Pages).

## Voir le site en local

Dans le Terminal, depuis ce dossier :

```
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000 dans le navigateur.
(Ouvrir `index.html` en double-cliquant fonctionne dans Safari, mais pas toujours dans Chrome.)

## Mettre à jour le contenu

Tout le contenu modifiable est regroupé dans 3 fichiers :

| Quoi | Fichier |
|---|---|
| Vinyles de la boutique | `js/data/products.js` |
| Événements de l'agenda | `js/data/events.js` |
| Email, IBAN, bénéficiaire | `js/config.js` |

Chaque fichier contient des instructions en commentaire. Les événements passés disparaissent automatiquement du site.

## À remplacer avant la mise en ligne (placeholders)

- **`js/config.js`** : email de contact réel + IBAN réel de l'association.
- **`js/data/products.js`** : vrais artistes, titres, descriptions et prix.
- **`js/data/events.js`** : vrais événements.
- **`association.html`** : noms, rôles et bios des fondateur·ice·s ; l'email `hello@45syndicate.ch` apparaît aussi dans le footer des 4 pages HTML.
- **`assets/documents/statuts-45-syndicate.pdf`** : remplacer le PDF provisoire par les vrais statuts.
- **QR de paiement** (page association) : à générer avec l'IBAN réel (QR-facture suisse), puis remplacer le cadre en pointillés.
- **Pochettes des vinyles** : chaque vinyle affiche « [Pochette à fournir] ». Déposer l'image carrée (600 × 600 px au moins) dans `assets/pochettes/`, puis l'indiquer dans le champ `cover` du vinyle (exemple en tête de `js/data/products.js`).
- **Polices** : Archivo et Space Mono viennent encore de Google Fonts. Avant la mise en ligne, les héberger dans le site (fichiers WOFF2) pour la vitesse et la confidentialité des visiteurs.

## Mise en ligne (Vercel)

Le site est publié sur le projet Vercel `kidan-45-syndicate-preview` (équipe WAB). Pour publier une nouvelle version : `vercel deploy --prod` depuis ce dossier.

- `vercel.json` pose les en-têtes de sécurité : le navigateur n'accepte que les fichiers du site et les polices Google, et le site ne peut pas être affiché dans un cadre sur une autre page.
- `.vercelignore` garde hors ligne les fichiers de travail (direction artistique, exceptions, réglages).

## Réception des commandes

Par défaut, le formulaire de commande ouvre le logiciel d'email du visiteur avec la commande pré-remplie (adressée à l'email de `js/config.js`).

Pour recevoir les commandes sans cette étape : créer un formulaire gratuit sur [Formspree](https://formspree.io), puis coller son URL dans `orderEndpoint` (fichier `js/config.js`).
Ajouter aussi son adresse (par exemple `https://formspree.io`) à `connect-src` dans `vercel.json`, sinon le navigateur bloque l'envoi.

## Webradio (prévu pour plus tard)

L'emplacement du futur player est déjà réservé : l'encadré « Webradio 45 Syndicate, bientôt en ondes » dans le pied de page de toutes les pages.

## La piste du fond

Derrière le panneau, une forme d'onde de platine défile en continu (`js/field.js`). Le bouton pause de la plaque d'en-tête l'arrête, et ce choix est gardé d'une page à l'autre. Elle reste immobile pour les personnes qui ont demandé à réduire les animations, et s'arrête quand l'onglet n'est pas affiché.

## Pour la personne qui reprend le code

Site statique sans outil de construction. Le JavaScript est typé avec des commentaires JSDoc et vérifié en mode strict par TypeScript (`jsconfig.json`) :

```
npx -p typescript tsc -p jsconfig.json
```

La direction artistique et ses raisons sont dans `DIRECTION-ARTISTIQUE.md`, les paires de couleurs vérifiées dans `paires.txt`.
