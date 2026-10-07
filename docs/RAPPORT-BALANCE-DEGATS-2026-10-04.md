# Balance des degats : 4 octobre 2026

## Regles testees

- A 50 degats, le rayon effectif de vision et des drones baisse de un, avec un
  minimum de 1. Le rayon achete reste conserve et revient apres reparation.
- A 70 degats, un pas du vaisseau dure 800 ms au lieu de 400 ms, sans changer
  son cout en carburant.
- A 100 degats, le vaisseau est immobilise sur sa tuile. Sa cargaison, son
  carburant et son score restent en place. Aucun remorquage de degats n'est
  encore implemente ; une partie qui en depend est `blocked`.
- Le bot peut prendre un chemin connu comme dangereux vers une ressource d'au
  moins 200 si cela raccourcit le trajet et si les degats connus projetes
  restent sous 100. Il evite encore les mines memorisees dans ce choix.
- Les impacts valent 15 sur une tuile dangereuse, 40 sur une mine et 45 pour
  le nuage. La recherche prioritaire de reparation commence a 65 degats ; la
  station est indisponible 40 s apres chaque reparation.

## Methode

Chaque graine cree deux bots. Une graine compte pour un seuil si au moins un
bot l'atteint a un moment de la partie, meme s'il est repare ensuite. Les
mesures viennent des evenements de degats et de l'etat final, sur une limite
de 1 000 000 ms logiques par partie. Aucun essai ci-dessous n'a expire.

Un balayage initial sur les graines 0 a 299 a servi a choisir les parametres.
Le candidat retenu a ensuite ete mesure sur 0 a 999, puis valide sur 4 000 a
4 999 sans nouveau reglage. Les graines 1 053 et 1 707 ne produisent pas de
carte avec le generateur actuel ; le lot 1 000 a 1 999 n'a donc pas pu servir
de validation. Le lot 4 000 a 4 999 a ete choisi sur la seule capacite de
generation des cartes, avant de mesurer les degats.

## Balayage initial : 300 graines

| Reglage | Graines a 50 | Graines a 70 | Graines a 100 |
| --- | ---: | ---: | ---: |
| Premier prototype : impacts 10/20/25, reparation des 50, delai 12 s | 95 | 16 | 0 |
| Intermediaire : impacts 15/30/35, reparation des 60, delai 24 s | 150 | 90 | 15 (5 %) |
| Retenu : impacts 15/40/45, reparation des 65, delai 40 s | 154 | 120 | 36 (12 %) |
| Plus fort : impacts 20/45/50, reparation des 70, delai 40 s | 227 | 153 | 79 (26,3 %) |

Les triplets d'impacts sont donnes dans l'ordre tuile dangereuse / mine /
nuage. Le seuil de valeur pour un raccourci dangereux est respectivement
300, 250, 200 et 200. Le reglage retenu est le seul candidat teste dans la
plage voulue de 10 a 20 % pour l'immobilisation sans la depasser dans ce
balayage. Ce choix ne garantit pas cette plage pour toute graine future.

## Lots complets

| Mesure par graine | Reglage 0–999 | Validation 4 000–4 999 |
| --- | ---: | ---: |
| Au moins un bot atteint 50 degats | 521 / 1 000 (52,1 %) | 540 / 1 000 (54,0 %) |
| Au moins un bot atteint 70 degats | 421 / 1 000 (42,1 %) | 442 / 1 000 (44,2 %) |
| Au moins un bot atteint 100 degats | 112 / 1 000 (11,2 %) | 131 / 1 000 (13,1 %) |
| Intervalle de Wilson a 95 % pour 100 degats | 9,39–13,31 % | 11,15–15,33 % |
| Bots immobilises | 115 / 2 000 | 135 / 2 000 |
| Parties `blocked` | 128 | 144 |
| Parties `blocked` avec immobilisation | 112 | 131 |
| Pannes de carburant hors station | 8 | 11 |

Au total, 243 des 2 000 graines independantes atteignent 100 degats :
**12,15 %**, avec un intervalle de Wilson a 95 % de **10,79 a 13,65 %**.
Le precedent reglage, apres la suppression de la reparation a la base, donnait
0 / 1 000 graine a 100 degats. Les seuils se recouvrent : une graine a 100
est egalement comptee a 50 et a 70.

Exemples de graines immobilisees pour rejouer : 36, 68, 96, 98 et 104 dans
le lot de reglage ; 4 000, 4 002, 4 025, 4 028 et 4 033 dans le lot de
validation. Les rapports JSON locaux par graine sont
`report.damage-calibration.json` et `report.damage-validation.json` ; ils sont
ignores par Git. Le rapport precedent est
`RAPPORT-BALANCE-REPARATION-2026-10-04.md`.

## Portee des resultats

Le seuil de 50 compte le niveau de degats, y compris pour un bot dont le
rayon achete est deja au minimum de 1 : dans ce cas, sa portee effective ne
peut pas baisser davantage. Le seuil de 70 compte l'atteinte du niveau ; un
bot repare avant son prochain pas peut ne jamais effectuer de pas ralenti.
Les parties immobilisees restent bloquees tant que la regle de remorquage a
100 degats n'est pas definie. Le taux de blocage n'est donc pas un pronostic
du taux de defaite une fois ce remorquage ajoute.

La validation du code passe avec Node 22 : types, 94 tests, scenarios Gherkin,
lint et build. Les etapes Gherkin sont verifiees syntaxiquement et ne sont pas
executees par cette commande.
