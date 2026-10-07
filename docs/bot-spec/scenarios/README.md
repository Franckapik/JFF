# Scenarios du socle valide

Les fichiers `.feature` expriment les [decisions Q01-Q20 et les premieres evolutions](../03-contrat-et-questions.md)
avec des effets observables et des identifiants stables.

L'[audit de la visibilite et du gameplay](../05-audit-visibilite-gameplay.md)
recapitule les regles appliquees et les limites encore presentes.

`npm run scenarios:check` verifie la syntaxe Gherkin, les identifiants et la
compilation des exemples. **Il n'execute pas les etapes.** `npm test` execute
les tests TypeScript du moteur et du mode expert, sans garantir une couverture
integrale des phrases Gherkin. Les vues et la synchronisation entre onglets
necessitent un controle navigateur.

| Fichier | Ce qu'il decrit |
| --- | --- |
| `initialization.feature` | Creation, graine, reset et protocole. |
| `initialization-fairness.feature` | Symetrie, connectivite et tailles limites. |
| `exploration.feature` | Scans, réserve commune, vision du vaisseau et souvenir individuel du terrain. |
| `collection.feature` | Compartiments, transactions et objets visibles uniquement sur les cibles scannées. |
| `maintenance.feature` | Services locaux, ravitaillement en station, trajets et achats. |
| `danger-tiles.feature` | Degats, perte de drone et revelation des tuiles dangereuses statiques. |
| `offensive-drone.feature` | Pose, armement, visibilité, mémoire, scan, neutralisation et dégâts des mines. |
| `electric-cloud.feature` | Apparition, visibilité, dérive, collisions et rebonds du drone liés au nuage électrique. |
| `emergency.feature` | Pause, remorquage et immobilisation. |
| `damage-thresholds.feature` | Effets des seuils de dégâts à 50, 70 et 100 %. |
| `game-over.feature` | Derniers depots, egalite et blocage. |
| `multi-bot.feature` | Monde partage, reservation des tuiles d'arret et arbitrage concurrent. |
| `edge-cases.feature` | Chemins absents, commandes et limites. |

Les anciens scenarios restent accessibles dans la revision Git
`87cce823b28ed6b1da74e83fdd1e6d980e12f93f`. Le contrat courant remplace
leurs regles contradictoires. Le raccordement executable progressif des
`.feature` est l'[extension E01](../04-extensions.md#e01-rendre-les-scenarios-executables).
