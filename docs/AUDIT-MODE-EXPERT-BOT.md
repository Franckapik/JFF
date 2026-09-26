# Audit et recommandations pour un mode expert par bot

Date : 26 septembre 2026. Portee : vues actives Terrain et Diagnostic, moteur de session actuel. Ce document ne propose aucune modification des regles de gameplay.

## Objectif

Le mode expert doit permettre de repondre rapidement, pour un bot donne, a cinq questions :

1. Que fait-il maintenant ?
2. Pourquoi a-t-il choisi cette action ?
3. Ou l'action se deroule-t-elle et combien de temps reste-t-il ?
4. Quels incidents, couts et gains a-t-il subis ?
5. Dans quel ordre ces faits se sont-ils produits ?

La vue actuelle repond correctement a une partie de la premiere question. Elle ne permet pas encore de reconstituer de facon fiable la causalite et la chronologie completes.

## Etat actuel

### Deja visible sur Terrain

- Etat courant, derniere decision, position et nombre de cases connues.
- Score, budget, carburant, degats, rayon et disponibilite du drone.
- Cargaison courante par compartiment et capacite.
- Monde ou connaissance individuelle du bot, tuile selectionnee et ressources visibles.

### Deja visible dans Diagnostic

- Etat XState, cible courante, pas, carburant consomme, scans, tentatives de collecte, collectes non vides et tuiles distinctes.
- Nombre de remorquages et depenses.
- Provenance cumulee des collectes par bot, tuile et ressource.
- Bilan physique global des ressources et controle de conservation.
- Journal textuel des 30 dernieres decisions, sur 120 entrees au maximum dans le moteur.

## Informations manquantes prioritaires

### P0 - Securite, incidents et causes de sortie

| Information                            | Disponibilite actuelle                                                       | Recommandation iconique                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Nombre de drones detruits              | Disponible dans `statistics.droneLosses`, non affiche                        | `ScanLine` ou `Plane` barre + compteur ; alerte seulement lors d'une nouvelle perte                |
| Detail d'une perte de drone            | Message textuel seulement ; coordonnee, operation et remplacement non relies | Evenement `drone.lost` avec heure logique, tuile dangereuse et identifiant d'operation             |
| Panne de carburant                     | Carburant courant et total de remorquages seulement                          | `Fuel` + seuil colore pour l'etat courant ; `Truck` + compteur pour les pannes historiques         |
| Cargaison perdue pendant un remorquage | Comptee uniquement dans les pertes globales                                  | `PackageX` + quantites par ressource, heure, coordonnee et bot responsable                         |
| Impacts de danger                      | Degats courants visibles, aucun historique                                   | `TriangleAlert` + nombre d'impacts ; detail avec tuile, degats avant/apres et heure                |
| Reparations et ravitaillements         | Etat final observable, occurrences non comptees                              | `Wrench` et `Fuel` avec compteurs distincts par base/station                                       |
| Elimination                            | Etat et `eliminationReason` disponibles, raison non affichee explicitement   | `Skull` + raison, heure, position, cargaison perdue et dernier objectif                            |
| Blocage individuel                     | Seule la raison globale de session existe                                    | `OctagonX` par bot avec objectif, retour ou service inaccessible ; ne pas inventer une elimination |

Un carburant bas n'est pas a lui seul une panne. Le moteur doit publier le statut d'urgence qu'il a effectivement utilise pour decider, afin que l'interface ne reproduise pas partiellement les regles de planification.

### P0 - Action courante et progression

Ces champs existent deja dans le snapshot et peuvent etre exposes sans nouvelle regle metier :

| Information       | Presentation recommandee                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Type d'operation  | Une icone stable par operation : `Route`, `ScanLine`, `PackageOpen`, `Wrench`, `Expand`, `ShoppingCart`, `Truck` |
| Progression       | Anneau ou barre compacte calculee avec `remaining / duration`, accompagnee du temps restant                      |
| Cible et objectif | `Crosshair` pour la cible ; icone de motif pour collecte, exploration, base, carburant ou reparation             |
| Route restante    | `Route` + nombre de pas ; tracage sur la carte uniquement quand le bot est selectionne                           |
| Etat final        | `Flag`, `Trophy`, `Skull` ou `OctagonX`, selon termine, gagnant, elimine ou bloque                               |

La cible de l'operation et l'objectif strategique ne doivent pas etre fusionnes : pendant un trajet, la premiere est le prochain waypoint et le second est la destination finale.

### P1 - Decisions et explication

La chaine `decision` et les logs actuels indiquent le choix retenu, pas les raisons completes. Pour expliquer un bot, il manque :

- Le declencheur de priorite : carburant urgent, seuil de degats, pression d'un compartiment, retour final ou remplacement de drone.
- Les options considerees et leur faisabilite : cible inaccessible, retour non abordable, capacite saturee ou budget insuffisant.
- Les valeurs ayant conduit au choix : distance, cout carburant aller/service, reserve, quantite disponible et rendement quantite/distance.
- L'arbitrage aleatoire entre collecte et scan : probabilite appliquee et tirage, a placer dans un detail avance et non dans le panneau principal.
- La transition XState observee, son heure et le temps passe dans l'etat precedent.

Recommandation : afficher une icone `CircleHelp` a cote de l'action. Son infobulle donne une raison courte ; un panneau de detail montre les facteurs et les options rejetees. La logique d'explication doit etre emise par le planificateur, jamais recalculee dans React.

### P1 - Economie et ressources par bot

| Information                                    | Etat actuel                                                      | Recommandation                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Depots par type de ressource                   | Disponible par bot, mais seul le score total est mis en avant    | `PackageCheck` ouvrant les trois quantites                                     |
| Depenses par type d'achat                      | Seul le total depense est conserve                               | Distinguer `Expand` et `Bot`/drone, avec prix et heure                         |
| Achats et extensions termines                  | Le lancement peut apparaitre en texte, sans historique structure | Compteurs et jalons dans la chronologie                                        |
| Pertes par bot et par cause                    | Seulement un total de session par ressource                      | Ventiler remorquage et elimination, sans les ajouter au score                  |
| Collecte vide ou perdue lors d'une concurrence | Tentative et succes sont comptes, cause non conservee            | `PackageX` discret avec tuile, stock observe avant transaction et resultat nul |
| Saturation des compartiments                   | Deducible de la cargaison courante seulement                     | `Gauge` par compartiment au moment de la decision de retour                    |

Les achats debitent le budget, pas le score ni le bilan physique. L'affichage doit conserver visuellement ces trois notions separees.

### P2 - Parcours, connaissance et efficacite

- Nombre de visites par tuile, deja disponible dans `visits` : surcouche de chaleur `Footprints`.
- Carte connue par le bot, deja disponible, mais sans ordre de decouverte : `Eye` + progression actuelle ; chronologie impossible sans nouvel evenement.
- Historique du trajet et positions successives : non conserve ; necessaire pour rejouer ou expliquer un detour.
- Duree cumulee par etat et operation : non conservee ; utile pour comparer exploration, collecte, maintenance et attente.
- Distances parcourues par objectif, taux de scans utiles, quantites par collecte et rendement par pas : derivables seulement si l'historique structure est ajoute.
- Nombre d'objectifs inaccessibles et motifs : non conserve ; important pour comprendre une fin `blocked` ou `Aucun objectif accessible`.

Ces mesures sont secondaires. Elles doivent rester dans un onglet Performance ou sous des filtres, pas dans le resume permanent du bot.

## Limite du journal actuel

Le journal est borne, textuel et destine a l'affichage. Il ne permet pas de garantir un historique complet :

- seules 120 entrees sont conservees et 30 affichees ;
- le type d'evenement, l'operation, la position et les variations de valeurs ne sont pas structures ;
- plusieurs completions ne produisent aucun message explicite ;
- un texte traduit ou reformule ne constitue pas un contrat de donnees ;
- les transitions, impacts, niveaux de carburant historiques et causes detaillees ne peuvent pas etre reconstruits a partir du dernier snapshot.

Pour une vue complete de ce qui s'est deroule, il faut donc un historique d'evenements metier structure, produit par la session autoritaire.

## Contrat d'observabilite recommande

Chaque evenement devrait au minimum porter :

```ts
{
  sequence: number;
  time: number;
  botId: BotId | null;
  type: string;
  operationId?: string;
  coord?: Coord;
  target?: Coord;
  reason?: string;
  before?: Record<string, number>;
  delta?: Record<string, number>;
  after?: Record<string, number>;
}
```

Familles minimales : decision planifiee, operation commencee/terminee/interrompue, arrivee sur une tuile, scan termine, drone perdu/remplace, collecte tentee/terminee, depot, ravitaillement, reparation, achat, remorquage, cargaison perdue, elimination, fin individuelle et blocage de session.

Les evenements doivent etre emis dans `GameSession`, avec l'heure logique et dans le meme ordre que les transactions. Le rendu ne doit produire aucun fait metier. Une evolution de ce contrat demandera un nouveau `schemaVersion` de snapshot ou un flux versionne distinct.

Pour concilier historique complet et taille des snapshots :

- conserver dans le snapshot les compteurs et le dernier evenement important par categorie ;
- transmettre les evenements incrementaux depuis une sequence connue ;
- inclure l'historique complet dans l'export de diagnostic, ou documenter explicitement une limite de retention ;
- ne pas envoyer toute la chronologie a chaque tick de 100 ms.

## Composition visuelle recommandee

### Mode normal inchange

Le mode expert devrait etre active par un bouton icone `SlidersHorizontal` avec `aria-pressed`, infobulle et libelle accessible. Il ne remplace pas les vues actuelles et ne surcharge pas le mode normal.

### Resume expert dans le panneau du bot

Ajouter une seule rangee compacte de six indicateurs au maximum :

- action et progression ;
- carburant ou urgence carburant ;
- degats et impacts ;
- drone disponible/pertes ;
- remorquages et cargaison perdue ;
- alertes d'accessibilite ou elimination.

Chaque indicateur associe une icone, une valeur courte et une infobulle. Un clic ouvre le detail correspondant ; aucun paragraphe explicatif permanent n'est necessaire.

### Tiroir expert par bot

Trois onglets suffisent :

1. `History` : chronologie verticale filtree par incident, decision, mouvement, ressource et maintenance.
2. `Route` : objectif, chemin restant, visites et marqueurs d'incidents sur la carte.
3. `ChartNoAxesColumn` : compteurs, durees et rendements.

Sur mobile, utiliser un tiroir pleine largeur. Sur bureau, conserver le terrain visible et limiter le detail a un panneau lateral, sans ajouter des cartes imbriquees.

### Regles d'iconographie

- Utiliser `lucide-react`, deja present, et verifier les noms exacts disponibles dans la version installee avant implementation.
- Une icone represente toujours le meme concept dans Terrain, Diagnostic, chronologie et export visuel.
- Ne jamais coder un etat uniquement par la couleur : ajouter compteur, forme, infobulle et nom accessible.
- Rouge uniquement pour destruction, elimination ou anomalie active ; ambre pour seuil/risque ; couleurs neutres pour l'historique resolu.
- Montrer le nombre `0` seulement dans les vues statistiques. Masquer les incidents absents dans le resume compact.
- Utiliser des badges numeriques pour les cumuls ; une animation breve peut signaler un nouvel incident, sans clignotement continu.
- Garder du texte pour les infobulles, lecteurs d'ecran, raisons detaillees et exports. Une interface uniquement pictographique serait ambigue et inaccessible.

## Ordre de livraison recommande

1. **P0 sans changement de contrat** : pertes de drone, raison d'elimination, operation/progression, objectif, route, visites, depots par bot et compteurs existants.
2. **P0 avec observabilite** : evenements structures pour panne, remorquage, cargaison perdue, impacts, reparation, ravitaillement, achat et elimination.
3. **P1 explication** : facteurs de decision, options infaisables, transitions et durees.
4. **P2 analyse** : chronologie complete, surcouches de carte et indicateurs de rendement.

## Criteres d'acceptation futurs

- Le mode expert desactive laisse la vue actuelle inchangee.
- Un incident affiche qui, quoi, quand, ou, cause, consequence et eventuelle recuperation.
- Une perte de drone, une panne, une perte de cargaison et une elimination sont distinguables sans lire un journal brut.
- Les etats courant, historique et resolu ne peuvent pas etre confondus.
- Chaque icone interactive est utilisable au clavier et possede un nom accessible et une infobulle.
- La chronologie suit l'heure logique de session et reste deterministe pour une meme graine et les memes commandes.
- Les informations inconnues sont marquees comme telles ; elles ne sont jamais deduites d'un etat final ambigu.
- Les filtres permettent d'isoler un bot et une categorie sans masquer les incidents critiques.
- L'export permet un audit plus long que la retention visuelle, sans gonfler chaque snapshot periodique.
- Le mode expert n'avance jamais l'horloge, ne complete aucune operation et ne modifie aucune ressource.

## Sources auditees

- Vue Terrain et panneau bot : [GameView.tsx](../src/components/session/GameView.tsx) et [BotPanel.tsx](../src/components/session/BotPanel.tsx).
- Vue Diagnostic : [Diagnostics.tsx](../src/components/session/Diagnostics.tsx).
- Donnees exposees : [model.ts](../src/engine/model.ts).
- Decisions, transactions et journal : [session.ts](../src/engine/session.ts).
- Etats XState actifs : [botMachine.ts](../src/engine/botMachine.ts).
- Regles confirmees : [03-contrat-et-questions.md](bot-spec/03-contrat-et-questions.md).

Les anciens composants FSM restent des references historiques hors du graphe actif. Ils ne doivent pas servir de source de verite ni etre reconnectes pour construire ce mode expert.
