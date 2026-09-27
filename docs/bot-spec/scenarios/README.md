# Scenarios du socle valide

Les dix fichiers `.feature` expriment les [decisions Q01-Q20](../03-contrat-et-questions.md)
avec des effets observables et des identifiants stables. Ils contiennent 56
scenarios et 67 cas apres expansion des exemples.

`npm run scenarios:check` verifie la syntaxe Gherkin, les identifiants et la
compilation des exemples. **Il n'execute pas les etapes.** `npm test` execute
les tests TypeScript du moteur et du mode expert, sans garantir une couverture
integrale des phrases Gherkin. Les vues et la synchronisation entre onglets
necessitent un controle navigateur.

| Fichier | Ce qu'il decrit |
| --- | --- |
| `initialization.feature` | Creation, graine, reset et protocole. |
| `initialization-fairness.feature` | Symetrie, connectivite et tailles limites. |
| `exploration.feature` | Scans, rayon mobile et connaissance individuelle. |
| `collection.feature` | Compartiments et transactions concurrentes. |
| `maintenance.feature` | Services locaux, trajets et achats. |
| `danger-tiles.feature` | Degats, perte de drone et revelation du danger. |
| `emergency.feature` | Pause, remorquage et elimination. |
| `game-over.feature` | Derniers depots, egalite et blocage. |
| `multi-bot.feature` | Monde partage et arbitrage concurrent. |
| `edge-cases.feature` | Chemins absents, commandes et limites. |

Les anciens scenarios restent accessibles dans la revision Git
`87cce823b28ed6b1da74e83fdd1e6d980e12f93f`. Le contrat courant remplace
leurs regles contradictoires. Le raccordement executable progressif des
`.feature` est l'[extension E01](../04-extensions.md#e01-rendre-les-scenarios-executables).
