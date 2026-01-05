pathfinding for ship

La logique mise en place pour les actions se fait via le dossier domains. Les "actions" sont séparées selon :
- assign : maj du context
- actions : actions avec effets de bords (requetes api par exemple). Ici seulement des logs d'état.

Je disposes d'un FSM géré avec xstate. Un monitor (xstate-viewer) avec un brodacast me permets de voir les états et évolution des valeurs. La console dans le navigateur web me permets de voir les logs que je peux copier ici. Le visuel de r3f me permets de controler le comportement. Mais, je reste insatisfait vis à vis de la manière d'avanacer au fur et à mesure de la complexité du projet. Des branches postérieures m'ont permis de trouver mes besoins réels :

les guards doivent etre purs et 100% testables : les corriger.
les stores doivent etre utilisés aux bons endroits pour laisser plus de pouvoir aux tests.
les résultats doivent etre visibles dans le terminal de VScode pour povoir laisser plus d'autonomie à copilot : le but ultime est de pouvoir tester les guards et les cycles complets depuis le terminal. Attention à ne pas inserer trop de complexité ou de code sur lequel je n'aurais plus aucun controle.
peut-on envisager une certaine independance de xstate vis à vis de react three fiber ? Je comprends que les positions et interactions seront issues de r3f, mais comment pouvoir faire évoluer le code avec copilot en terminal, selon des tests très rapides sans trop intervenir sur r3f ?
contraindre au maximum avec ES lint et TS.
le worflow devrait etre j'observe, je passe dans Xstate, je recoit une commande ? J'ai peur de refaire la meme erreur en ajoutant une couche d'abstraction complexe.
EN résumé, il faut contraindre, sécuriser, rendre le FSM independant, et visible depuis le terminal vscode.
Les fichiers readme pourraient etre distribués egalement lorsqu'il y a des pratiques de generation de code à suivre pour diriger l'écriture systematiquement. Les commentaires pourraient/devraient aussi pouvoir aider.
Un fichier copilot instruction bien evidemment.


Que faire des liens guards et xtstaes ? 
Options pour Phase 2:

Soit injecter availableTiles: Tile[] dans le contexte FSM
Soit créer un service externe qui gère les queries spatiales
Soit utiliser un actor XState dédié pour les queries de tiles
Pour l'instant, on la garde deprecated mais fonctionnelle.

Le contexte FSM doit etre clair vis à vis de la séparation avec les stores Zustand. Comment le contraindre, quelle limite choisir?


Je dois faire une liste permettant de comprendre les poitn sobligatoire pour le bon déroulement d'un cycle :

App : Scene :



22:12:09 → {"collecting":"ship_moving_to_tile"}
22:12:09 → evaluating
22:12:07 → {"maintaining":"depositing"}
22:12:05 → {"collecting":"ship_returning"}
22:12:03 → {"collecting":"ship_collecting"}
22:12:01 → {"collecting":"ship_moving_to_tile"}
22:12:01 → evaluating
22:12:00 → {"maintaining":"depositing"}
22:11:57 → {"collecting":"ship_returning"}
22:11:56 → {"collecting":"ship_collecting"}
22:11:54 → {"collecting":"ship_moving_to_tile"}
22:11:54 → evaluating
22:11:53 → {"maintaining":"depositing"}
22:11:51 → {"collecting":"ship_returning"}
22:11:50 → {"collecting":"ship_collecting"}
22:11:49 → {"collecting":"ship_moving_to_tile"}
22:11:49 → evaluating
22:11:47 → {"maintaining":"depositing"}
22:11:44 → {"collecting":"ship_returning"}
22:11:43 → {"collecting":"ship_collecting"}



Refueling à - de 30% => correction à faire pour le changement d'état : boucle infinie eval - refueling.

L'exploration et la collecte privilegie-t-elle toujours des nouvelles tuiles ? COmment prouver l'inverse ? Comment rendre plus efficace le bot et lui accorder un profil ? 
Base de depart aléatoire
Connait-il deja les dangers ? 
Ajouter un evenement plus aléatoire (nuage) dans le simulateur ? 
Le refuel doit etre plus precoce dans le jeu

