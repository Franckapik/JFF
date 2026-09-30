# JFF : consignes pour les modifications

## Sources de verite

- Le [contrat valide](../docs/bot-spec/03-contrat-et-questions.md) fixe les
  regles metier Q01-Q20. Les [extensions](../docs/bot-spec/04-extensions.md)
  ne sont pas des fonctions du socle actuel.
- `src/engine/session.ts` detient le monde partage, les decisions, les
  transactions et l'horloge. `botMachine.ts` expose les etats XState v5 ;
  `rules.ts`, `resources.ts`, `world.ts` et `model.ts` definissent les regles,
  bilans, trajets et types.
- `src/workers/session-worker.ts` possede la session unique.
  `src/engine/protocol.ts` et `src/stores/useSessionStore.ts` valident et
  transportent les snapshots entre onglets. Il n'y a aucun moteur local de
  secours.
- `src/components/session/` affiche les snapshots. Le rendu n'avance pas la
  simulation et ne modifie pas les ressources. Le mode expert lit les
  evenements structures emis par la session.

## Invariants

Pour chaque ressource : monde + cargaisons + depots cumules + pertes
explicites = stock initial. Pour chaque bot : budget + depenses = score depose.
Les achats debitent le budget ; les trajets utilisent des cases adjacentes
praticables ; les services sont locaux. Utiliser une seule horloge de session
pour les actions des bots. Preserver `gameId`, la reconnexion idempotente, la
pause, le pas a pas et le reset partage.

## Travail et verification

Toute modification d'une regle de gameplay ou d'un comportement observable
doit mettre a jour les scenarios Gherkin concernes dans
`docs/bot-spec/scenarios/*.feature` au cours du meme changement. Ajouter les
cas manquants, corriger les cas devenus faux et tenir a jour leur `README.md`
si le nombre ou la liste des fichiers change. Executer `npm run scenarios:check`
apres ces modifications ; ce controle verifie la syntaxe et les identifiants,
pas l'execution des etapes.

Node >= 22.12 ; `npm ci` depuis le lockfile. `npm run validate` lance les types
de tout `src/`, Vitest, le controle de syntaxe Gherkin, ESLint et le build.
`scripts/pre-commit.sh` ajoute l'audit des dependances. Les fichiers `.feature`
ne sont pas executes comme tests. Reutiliser `src/engine/session.test.ts` pour
les scenarios moteur proches et des tests de vue cibles lorsque necessaire.

Le worker publie un snapshot version 7, le protocole de commandes est en
version 1. Un changement de contrat de transport doit etre versionne et teste.
Les performances du poste Linux/Chromium ne certifient pas d'autres appareils.
Voir [le socle actuel](../docs/SOCLE_ACTUEL.md) et
[les commandes](../scripts/README.md).
