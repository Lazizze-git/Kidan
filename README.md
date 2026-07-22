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
- **Photos** : les portraits des fondateur·ice·s (ronds noirs avec initiales) et les visuels vinyles (pochettes CSS) sont des placeholders à remplacer par de vraies photos.

## Réception des commandes

Par défaut, le formulaire de commande ouvre le logiciel d'email du visiteur avec la commande pré-remplie (adressée à l'email de `js/config.js`).

Pour recevoir les commandes sans cette étape : créer un formulaire gratuit sur [Formspree](https://formspree.io), puis coller son URL dans `orderEndpoint` (fichier `js/config.js`).

## Webradio (prévu pour plus tard)

L'emplacement du futur player est déjà réservé : le bandeau « Webradio 45 Syndicate — bientôt en ondes » en haut du footer, sur toutes les pages.
