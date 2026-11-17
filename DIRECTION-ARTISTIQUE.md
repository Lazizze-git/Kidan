# 45 Syndicate : direction artistique « le panneau sur la piste »

Refonte du 17.11.2026. Remplace la direction « sérigraphie deux couleurs, affiches sur
grillage » (commits d400233 et 1d84cf5).

## 1. Brief réécrit (P-01)

Demande d'Eliott : refaire le site pour qu'il ressemble le plus possible à operate.so, avec
des ondes musicales à l'arrière, et avec le contenu de 45 Syndicate.

- **Pour qui** : les Lausannois·es qui croisent l'association (atelier DJ, scène ouverte,
  vernissage), les artistes indépendants, les personnes qui veulent donner.
- **Pour faire quoi** : comprendre en trois secondes que c'est une association musicale de
  Lausanne, puis aller vers une des quatre portes : boutique, agenda, association, don.
- **Action principale** : soutenir (don) ; secondaire : venir à la prochaine date.
- **Si le visiteur ne regarde qu'une chose** : le titre « La musique qui rassemble » posé sur
  la piste qui joue.
- **Fait absent de la demande** : les événements passés disparaissent du site ; au
  17.11.2026, une seule date reste à venir (vernissage du 21.11). Tout bloc d'agenda doit donc
  tenir avec une seule date, ou aucune.

## 2. Dossier de matière (P-02)

| Pièce | Contenu | Source |
|---|---|---|
| D1 | Logo « 45 » dans un disque, et logotype FORTY-FIVE SYNDICATE | `assets/logo-*.png` |
| D2 | Palette de sérigraphie à douze encres, dont le Velvet Cherry `#6e1221` (encre principale) et le Flossy `#ff7fab` (étiquette de disque) | DA précédente, `css/jetons.css` d'origine |
| D3 | Atelier DJ et MAO : contrôleur DDJ-RX3, MPC Live 2, BPM, phrasing, passer de la piste A à la piste B | `js/data/events.js` |
| D4 | Textes de mission, raison d'être, statuts, lieux, fondateur·ice·s (Kidan Odbang, Yann Fabroni, Sarah Schera) | pages d'origine |
| D5 | Affiche de l'atelier DJ et production musicale | `assets/affiche-atelier-dj-production.jpg` |
| D6 | Coordonnées : Escaliers du Marché 11, 1003 Lausanne ; hello@45syndicate.ch ; IBAN | `js/config.js` |
| D7 | Webradio annoncée « bientôt en ondes » | pied de page d'origine |

À FOURNIR : pochettes des vinyles, vrais titres et artistes, photos des fondateur·ice·s, QR de
paiement, fichiers des polices (voir § 5).

## 3. Idée en une phrase (P-03)

**Le site de 45 Syndicate est un panneau accroché sur une piste qui joue : la forme d'onde
d'un morceau défile derrière, réglée sur la grille de beats de l'atelier DJ.**

Test d'interchangeabilité : remplacer « 45 Syndicate » par un autre client. Le système du
panneau tient (il vient de la référence), mais la piste, la grille de beats et le bouton
pause de platine ne tiennent que pour une association qui enseigne le mix. Passe.

## Inspirations

### Esprit général
Un panneau de travail vissé sur un fond qui vit : tout ce qu'on lit est posé, encadré de
filets fins, dans une seule encre ; seul le fond bouge, lentement, comme une piste qui joue.

### Références
| Réf | Source et contexte | Ce qu'Eliott en retient | Ce qu'on laisse |
|---|---|---|---|
| R1 | operate.so, site d'un logiciel de vente (États-Unis), relevé du 17.11.2026 ; capture mobile d'Eliott | « Que ça y ressemble le plus possible » : panneau gris accroché par charnières sur un fond plein, plaque d'en-tête, une seule encre, filets à terminaisons carrées, arcs, rangées à bandeau, bloc manifeste pâle avec tampon | Leurs polices (Denim, Muoto : commerciales), leur logo, leurs textes, la maquette d'application (fausse interface, IM-11), les petits cercles qui flottent (remplacés par la piste), la numérotation 1 à 4 (CT-29), les chaînes « A · B · C » (CT-27), le carrousel |

Questions posées le 17.11.2026 et réponses d'Eliott :
- Couleur : **le bordeaux actuel** (Velvet Cherry) à la place du vert.
- Forme des ondes : **forme d'onde de platine DJ** (barres verticales, grille de beats).
- Mouvement : **en continu**, comme le fond d'Operate.

### Principes retenus
| # | Principe | Vient de | Pièce du dossier | Décision |
|---|---|---|---|---|
| 1 | Une seule encre pour tout ce qui se lit et s'actionne | R1 | D2 | Velvet Cherry sur gris, partout |
| 2 | Le contenu est un objet fixé sur un fond vivant | R1 | D3 | Panneau gris à charnières sur la piste bordeaux |
| 3 | La structure se montre : filets, terminaisons, arcs | R1 | D4 | Quatre colonnes égales tracées en filets |
| 4 | Le fond est une matière du métier | R1 + réponse d'Eliott | D3 | Forme d'onde et grille de beats à 124 BPM |

### Tests de distance
- T1 côte à côte : reconnaissable comme inspiré d'Operate, **à la demande écrite d'Eliott**
  (« le plus possible »). Consigné dans `.anti-slop-exceptions`.
- T2 signature : la signature d'Operate (charnières et plaque) est reprise à sa demande ; leur
  fond (bulles) est remplacé par la piste.
- T3 surface : aucune police, couleur, texte ni logo d'Operate.
- T4 interchangeabilité : la piste et la pause de platine sont propres au client.
- T5 anti-slop : voir `.anti-slop-exceptions` (boucle du fond, filets, mono).
- T6 marque : Operate est un logiciel américain, autre secteur et autre pays.

## 4. Boîte morphologique (P-04)

| Paramètre | Valeurs permises | Ancre |
|---|---|---|
| Encre | Velvet Cherry ; cherry appuyé pour l'emphase | oui |
| Surfaces | gris panneau, gris relevé, gris plaque, lavis rose | |
| Fond | piste bordeaux animée (canvas), repli bordeaux uni | oui |
| Typo | Archivo 400 à 600 (tout) ; Space Mono 400 (étiquettes, tampon, plaque) | |
| Grille | 4 colonnes égales tracées ; 1 colonne sur mobile | oui |
| Traits | filet 1 px, terminaison carrée de 7 px, arc d'un quart de cercle | |
| Cartes | fenêtre papier à bande de titre (texte courant), lavis rose (citation), bordeaux plein (l'essentiel) ; large, haute ou simple selon le poids du texte. Ajoutées le 17.11.2026 à la demande d'Eliott pour casser les blocs de texte | |
| Mouvement | fond seulement ; couleurs au survol ; pression 0,97 | |

## 5. Typographie

- **Archivo** (Omnibus-Type, libre, SIL OFL) : linéale grotesque d'origine typographique de
  presse, déjà la voix de la DA précédente. Titres en 600 (comme les titres demi-gras de la
  référence), texte en 400. Rapport titre / texte : 2,4 sur grand écran (48 / 20 px), 2 sur
  mobile (32 / 16 px), comme R1.
- **Space Mono** : seulement pour les étiquettes encadrées, le tampon et la plaque (voix
  « machine » de la DA précédente, exception CT-21 / CT-28 existante).
- Échelle : 13, 15, 16→20 (texte), 17→20 (rangées), 20→24, 26→36, 32→48 px.
- Convention romande : espace fine insécable avant ; : ! ? ; guillemets « » ; apostrophe ’ ;
  heures `18:30` (format déjà utilisé par l'association sur ses données), dates `21.11.2026`.
- Polices encore servies par Google Fonts : le téléchargement des fichiers a été refusé
  pendant la refonte. **À héberger en WOFF2 dans `assets/fonts/` avant la mise en ligne.**

## 6. Couleur

| Jeton | Valeur | Origine | Rôle |
|---|---|---|---|
| `--c-cherry` | `#6e1221` | D2, Velvet Cherry | encre : textes, filets, boutons |
| `--c-cherry-deep` | `#490c15` | D2 appuyé | emphase dans le texte |
| `--c-field` | `#5a0416` | D2, plus profond (OKLCH L 0,30) | fond de la piste, comme le vert de R1 est plus sombre que son encre |
| `--c-panel` | `#ece8e8` | neutre teinté de l'encre (C 0,004) | panneau |
| `--c-panel-light` | `#f8f6f6` | idem, plus clair | fenêtres, cartes |
| `--c-plate` | `#dcd8d8` | idem, plus sombre | plaque d'en-tête, barre panier |
| `--c-wash` | `#eaccca` | D2 dilué (L 0,87), éclairci pour que le texte courant passe l'APCA | feuille du manifeste et des dons, encadré radio ; le texte y est en `--c-cherry-deep` |
| `--c-wave-*` | `#811c2b`, `#b13d54`, `#da748c` | D2, du cherry vers le Flossy | barres de la piste |

Contrastes (WCAG 2) : encre sur panneau 9,75:1 ; sur fenêtre 11:1 ; bordeaux profond sur lavis 10,38:1 (APCA Lc 76) ; sur
plaque 8,39:1 ; texte clair sur bouton plein 11:1. Liste complète dans `paires.txt`.

## 7. Grille

Panneau : marge de 12 px (mobile) à 38 px (bureau) autour, rails dans cette marge. Contenu :
4 colonnes égales sur grand écran (≥ 60 rem), séparées par des filets ; 1 colonne avec un filet
à gauche sur mobile. Unité verticale : l'interligne du texte courant (1,4 × corps).

## 8. Mouvement

| Quoi | Pourquoi | Valeurs |
|---|---|---|
| La piste du fond défile | demande d'Eliott : fond vivant comme R1 ; c'est une piste qui joue | linéaire, 124 BPM, ~40 px/s ; s'arrête onglet caché, en mouvement réduit, et par le bouton pause |
| Bouton pause de platine | WCAG 2.2.2 : tout mouvement de plus de 5 s a une pause | état mémorisé pour le visiteur |
| Survols | couleur seulement | 160 ms, ease |
| Pression | retour tactile | `scale(0.97)`, 120 ms |
| Fenêtres (fiche, commande) | changement d'état | fondu + `scale(0.96 → 1)`, 200 ms, sortie 150 ms |

## 9. Formats livrés

Quatre pages statiques (accueil, association, boutique, agenda), mobile d'abord, de 320 px à
1472 px (largeur maximale du panneau).
