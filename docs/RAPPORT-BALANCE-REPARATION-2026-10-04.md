# Balance de la reparation : 4 octobre 2026

## Regle comparee

Avant : un depot a la base remettait aussi les degats a zero, et la base etait
une destination de reparation. Apres : le depot conserve les degats et seule
la station de reparation repare le vaisseau. Le seuil de priorite reste a 50
degats. A 100 degats, le bot est elimine definitivement.

## Methode

- 1 000 parties par version, graines identiques de 0 a 999, deux bots par partie.
- Limite de 1 000 000 ms logiques par partie ; toutes les parties ont termine
  avant cette limite.
- Le taux principal compte les graines ou au moins un bot atteint 100 degats.
  Atteindre 100 elimine le bot ; son etat final garde donc cette valeur.
- Les rapports JSON par graine sont disponibles localement dans
  `report.repair-before.json` et `report.repair-after.json` (fichiers ignores
  par Git). Le second contient aussi la comparaison des issues par graine.

## Resultats

| Mesure | Avant | Apres | Ecart |
| --- | ---: | ---: | ---: |
| Graines avec au moins un bot a 100 degats | 0 / 1 000 (0 %) | 0 / 1 000 (0 %) | 0 point |
| Bots elimines a 100 degats | 0 / 2 000 | 0 / 2 000 | 0 |
| Borne haute de l'intervalle de Wilson a 95 % du taux par graine | 0,383 % | 0,383 % | — |
| Graines avec au moins un bot a 50 degats en fin de partie | 0 | 6 | +6 |
| Degats moyens en fin de partie par bot | 0,0175 | 13,4225 | +13,405 |
| Degats maximaux en fin de partie | 20 | 60 | +40 |
| Parties avec victoire | 995 | 996 | +1 |
| Parties bloquees | 5 | 4 | -1 |

Les six graines ayant encore au moins 50 degats a la fin sont 12, 39, 157,
231, 246 et 382. La graine 104 passe de « bloquee » a « victoire ». Les
graines 506, 536, 606 et 782 restent bloquees. Aucune graine ne regresse sur
l'issue de partie dans ce lot.

La nouvelle regle laisse nettement plus de degats non repares en fin de partie,
mais aucune destruction a 100 % n'a ete observee sur ce lot. Le taux observe
de 0 % ne prouve pas que la destruction soit impossible sur d'autres graines.
Les degats de fin de partie ne representent pas le maximum atteint pendant le
jeu ; le comptage de 100 % est exact parce que cet etat elimine le bot.

## Reproduction

Avec Node 22.12 ou plus recent, lancer les deux versions du moteur avec les
memes options de `npm run balance`, puis comparer les rapports avec `--compare`.
Les fichiers JSON locaux ci-dessus conservent les resultats par graine du
present essai. La validation du code modifie passe avec `npm run validate` :
types, 89 tests, syntaxe et identifiants des scenarios, lint et build.
