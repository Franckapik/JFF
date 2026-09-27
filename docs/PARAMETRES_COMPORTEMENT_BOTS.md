# Parametres influencant le comportement des bots

Date de l'analyse : 26 septembre 2026.

Ce document inventorie les valeurs qui influencent le comportement des bots
dans le moteur actif. Il distingue les regles centralisees, les heuristiques
encore codees dans le planificateur et les propositions d'equilibrage. Les
anciennes FSM sous `src/ai/fsm/` ne font pas partie de ce comportement.

## Chemin de decision actif

Le comportement est principalement decide par
[`GameSession.plan()`](../src/engine/session.ts#L159). La machine
[`botMachine`](../src/engine/botMachine.ts) expose les etats XState, mais ne
choisit pas elle-meme les objectifs.

Les constantes centralisees se trouvent dans
[`RULES`](../src/engine/rules.ts). La session applique ensuite ces regles aux
trajets, ressources, services et achats. Le SharedWorker possede l'unique
session et toutes les vues observent donc les memes reglages.

## Regles centralisees

| Domaine | Parametre | Valeur actuelle | Effet principal |
| --- | --- | ---: | --- |
| Capacite | `capacity.food` | 200 | Limite independante de nourriture transportee. |
| Capacite | `capacity.debris` | 1 800 | Limite independante de debris transportes. |
| Capacite | `capacity.special` | 3 | Limite independante de ressources speciales. |
| Carte | `mapRadius` | 3 | Produit une carte hexagonale de 37 cases. |
| Exploration | `maxExplorationRadius` | 3 | Rayon maximal du drone. Le rayon initial vaut 1. |
| Economie | `upgradePrices` | 50, puis 100 | Cout des passages aux rayons 2 et 3. |
| Economie | `dronePrice` | 50 | Cout de remplacement d'un drone perdu. |
| Carburant | `fuelCapacity` | 100 | Carburant initial et niveau apres un plein. |
| Carburant | `fuelPerStep` | 1 | Consommation par case parcourue, aller et retour. |
| Carburant | `fuelReserve` | 3 | Marge exigee lors de la validation d'une cible. |
| Carburant | `fuelUrgencyThreshold` | 20 | Declenche la recherche prioritaire d'un ravitaillement. |
| Carburant | `stationFuelThreshold` | 30 | Autorise un plein opportuniste sur une station traversee. |
| Danger | `dangerDamage` | 10 | Degats recus en entrant sur une case dangereuse. |
| Reparation | `repairThreshold` | 50 | Rend la recherche d'une reparation prioritaire. |
| Temps | `stepDuration` | 400 ms | Duree logique d'un pas du vaisseau. |
| Temps | `scanDuration` | 800 ms | Duree fixe d'un scan, hors trajet du drone. |
| Temps | `collectDuration` | 1 000 ms | Duree d'une collecte. |
| Temps | `serviceDuration` | 1 200 ms | Duree d'un depot, plein ou d'une reparation. |
| Temps | `purchaseDuration` | 1 000 ms | Duree d'un achat de drone ou d'extension. |
| Temps | `rescueDuration` | 5 000 ms | Duree du remorquage apres une panne. |
| Diagnostic | `maxLogEntries` | 120 | Nombre maximal d'entrees du journal conservees. |

## Priorites de decision

Le planificateur examine les besoins dans cet ordre :

1. elimination si les degats atteignent 100 ;
2. remorquage si le carburant est nul hors d'un point de ravitaillement ;
3. service si le bot est deja a sa base ou dans une station pertinente ;
4. retour final quand les ressources accessibles sont epuisees ;
5. trajet vers une reparation a partir de 50 degats ;
6. trajet vers un ravitaillement en cas de carburant urgent ;
7. poursuite d'un objectif deja choisi ;
8. remplacement du drone ou achat d'une extension a la base ;
9. choix pondere entre collecte et exploration ;
10. retour pour deposer ou deplacement vers une nouvelle frontiere ;
11. fin du bot si aucun objectif n'est accessible.

Ces priorites ont davantage d'effet que les probabilites : une urgence ou une
contrainte satisfaite plus haut empeche d'evaluer les branches suivantes.

## Heuristiques encore codees dans le planificateur

### Faisabilite liee au carburant

Une cible de collecte ou d'exploration n'est retenue que si le bot peut
atteindre cette cible, puis un point de ravitaillement, tout en conservant la
reserve :

$$
(distance_{aller} + distance_{retour}) \times fuelPerStep + fuelReserve
\leq carburant
$$

Dans le code, les longueurs de chemins incluent leur case de depart. Le calcul
equivalent retire donc deux cases aux longueurs additionnees.

Le seuil d'urgence reel est dynamique :

$$
seuil = \max(fuelUrgencyThreshold,
distance_{station} \times fuelPerStep + fuelReserve)
$$

### Choix entre collecte et exploration

Les cibles de collecte sont classees par quantite actuellement chargeable
divisee par la longueur du chemin. La probabilite de choisir la meilleure
collecte plutot qu'un scan est :

$$
P(collecte) = \min\left(0{,}9,
0{,}55 + \frac{ressourcesChargeables}{1500}
+ \frac{cargaison}{5000}\right)
$$

Les valeurs `0,9`, `0,55`, `1500` et `5000` sont codees directement dans
[`session.ts`](../src/engine/session.ts#L232). Elles devraient devenir des
parametres nommes avant d'etre exposees dans l'interface.

### Retour et capacites

Le bot revient deposer s'il transporte quelque chose et qu'aucune collecte
faisable ne reste. Il revient aussi lorsqu'un compartiment est plein et que la
meilleure action ne peut pas continuer sur la case actuelle. Un compartiment
plein n'interdit pas de charger les autres ressources.

La faible capacite de ressources speciales, fixee a 3, peut provoquer des
retours frequents. Ces retours declenchent egalement un plein complet a la
base et influencent donc indirectement la pertinence du carburant.

### Dangers

Le calcul de route prefere un chemin ne traversant aucun danger. Si aucun
chemin sur n'existe, un chemin dangereux peut etre accepte seulement si ses
degats projetes restent strictement inferieurs a 100. La reparation devient
prioritaire a partir de 50 degats, avant l'urgence carburant.

### Achats

Le drone perdu est remplace a la base des que le budget atteint 50. Une
extension est achetee lorsque le bot a le budget requis, dispose de son drone,
n'a plus de case inconnue dans son rayon actuel et peut atteindre des cases au
rayon suivant. Les achats reduisent le budget, jamais le score depose.

## Generation du monde

La generation reproductible est implementee dans
[`world.ts`](../src/engine/world.ts#L76). Hors cases reservees et protegees :

| Element | Valeur actuelle |
| --- | ---: |
| Obstacles | 12 % |
| Dangers | 8 % |
| Cases vides | 10 % |
| Cases de ressources | 70 % |
| Nourriture par case de ressources | 20 a 100 |
| Debris par case de ressources | 80 a 300 |
| Ressources speciales par case | 0 a 6 |

Les cases situees a une distance maximale de 1 d'une base restent des cases de
ressources. Les deux bases et le terrain sont symetriques. Les stations de
carburant sont actuellement fixes en `-1,1` et `1,-1`, et les stations de
reparation en `-1,0` et `1,0`.

## Pourquoi le carburant reste presque toujours eleve

Le carburant participe bien aux decisions, mais plusieurs regles reduisent
fortement son influence observable :

- une carte de rayon 3 est petite face a une autonomie de 100 pas ;
- chaque depot a la base remet gratuitement le reservoir a 100 ;
- la capacite speciale de 3 provoque des retours et donc des pleins frequents ;
- le filtre de faisabilite elimine preventivement les destinations trop
  couteuses ;
- les trajets du drone ne consomment aucun carburant du vaisseau ;
- le seuil d'urgence de 20 represente encore vingt pas avec le cout actuel.

Le carburant est donc surtout une contrainte de securite. Il produit rarement
un arbitrage visible, une visite forcee a une station ou une panne dans une
partie normale.

## Proposition d'equilibrage du carburant

Un premier preset experimental peut rendre cette ressource visible sans faire
de la panne le resultat habituel :

| Parametre | Standard actuel | `Carburant visible` |
| --- | ---: | ---: |
| `fuelCapacity` | 100 | 40 |
| `fuelPerStep` | 1 | 2 |
| `fuelReserve` | 3 | 6 |
| `fuelUrgencyThreshold` | 20 | 14 |
| `stationFuelThreshold` | 30 | 20 |

Ces valeurs sont des hypotheses d'equilibrage, pas de nouvelles regles
validees. Elles doivent etre comparees sur un lot de graines reproductibles.
Il est preferable de modifier ensemble capacite, cout et reserve : diminuer
uniquement le seuil d'urgence changerait peu de choses puisque le filtre de
faisabilite continuerait a securiser les destinations.

Autres leviers possibles :

- ne faire le plein a la base que sous un seuil configurable ;
- donner un cout en carburant aux scans du drone ;
- augmenter le rayon de carte, ce qui renforce naturellement les decisions de
  trajet sans changer les regles du carburant ;
- augmenter la capacite speciale pour reduire les retours automatiques ;
- rendre le ravitaillement non instantane ou payant, apres decision de gameplay.

## Mesures a ajouter avant comparaison

Le diagnostic expose deja les pas, le carburant cumule consomme et les
remorquages. Pour mesurer l'effet reel d'un reglage, ajouter par bot :

- carburant minimal atteint ;
- nombre de pleins a la base et en station ;
- nombre de decisions motivees par le carburant ;
- distance ajoutee par les detours de ravitaillement ;
- ressources deposees par unite de carburant ;
- temps passe en deplacement, collecte, exploration et maintenance ;
- cargaison perdue et nombre de remorquages.

Les comparaisons devraient utiliser les memes graines et publier moyenne,
mediane et valeurs extremes. Le score seul ne permet pas de comprendre
pourquoi un comportement a change.

## Reglages futurs dans l'interface

L'interface possede deja la pause, le pas de 100 ms, les vitesses `1x`, `2x`,
`4x`, `8x`, la graine et le reset dans
[`SessionToolbar`](../src/components/session/SessionToolbar.tsx). Un panneau
de parametres pourrait completer ces controles avec :

- presets `Standard`, `Carburant visible` et `Survie` ;
- controles numeriques pour carburant, degats, capacites, prix et durees ;
- reglages de probabilite pour la collecte et l'exploration ;
- parametres de generation appliques uniquement a une nouvelle partie ;
- vitesses `16x`, `32x` et une commande de simulation jusqu'a la fin ;
- comparaison des resultats avec une meme graine ;
- restauration des valeurs par defaut.

Les parametres qui changent la carte, les capacites ou les invariants doivent
etre verrouilles pendant une partie. Les poids de decision pourraient etre
modifies en pause, mais appliquer tous les reglages au prochain reset serait
plus simple et garantirait un replay exact.

## Architecture recommandee pour ces reglages

1. Definir un type `GameRules` et une configuration par defaut validee.
2. Donner une copie immutable de ces regles a chaque `GameSession`.
3. Ajouter les regles au message de creation ou de reset du protocole.
4. Inclure les regles effectives dans `SessionSnapshot` et dans les exports.
5. Faire valider les bornes dans le worker, qui reste la source de verite.
6. Ajouter des tests de decision et des simulations multi-graines par preset.

Il faut eviter de laisser l'interface importer `RULES` comme source de verite
une fois les reglages dynamiques introduits. Elle doit afficher les regles
confirmees par le snapshot du SharedWorker. Ainsi, tous les onglets observent
la meme configuration et un export contient bien `graine + regles + resultat`.

## Ordre de mise en oeuvre propose

1. Nommer et centraliser les quatre constantes de probabilite de collecte.
2. Introduire `GameRules` sans changer les valeurs ni le comportement.
3. Ajouter les mesures carburant et verifier un lot fixe de graines.
4. Ajouter les presets et leur validation au protocole.
5. Construire le panneau de reglages et appliquer les changements au reset.
6. Ajouter les grandes vitesses et la comparaison rapide des resultats.
7. Ajuster les valeurs a partir des mesures plutot qu'a partir du seul rendu.

Les decisions de gameplay deja confirmees restent documentees dans
[`AUDIT-2026-09-26.md`](AUDIT-2026-09-26.md#decisions-de-gameplay-validees).