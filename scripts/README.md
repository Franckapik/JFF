# Commandes et mesures JFF

Node >= 22.12 est requis. Installer avec `npm ci`, puis lancer `npm run dev`.
`/vue1` affiche le terrain et `/vue2` le diagnostic ; les onglets de meme
origine partagent une session. `npm run preview -- --host 127.0.0.1` sert le
build de production.

## Validation

```bash
npm run validate
./scripts/pre-commit.sh
```

`validate` enchaine les types de tout `src/`, Vitest, `scenarios:check`, ESLint
et le build. `scenarios:check` parse les dix fichiers Gherkin, controle leurs
identifiants et compile les exemples ; il n'execute pas les etapes. Le script
pre-commit ajoute `npm audit --audit-level=moderate`. La CI utilise le meme
script sur Node 22. Les tests du moteur sont dans `src/engine/session.test.ts` ;
le mode expert a un test de rendu statique cible.

## Mesures

```bash
npm run benchmark
npm run benchmark -- --games=200 --output=report.session-performance.json
```

Le benchmark mesure les ticks, snapshots et allocations sur cartes de 37 et
217 cases. Son rapport est local et ignore par Git ; un budget de temps est
specifique a la machine qui l'execute. Pour le rendu en developpement, ouvrir
`/vue1?profile` ou `/vue2?profile` et lire
`window.__JFF_RENDER_METRICS__` dans la console avant et apres une fenetre de
mesure. Comparer une fenetre active et une fenetre en pause ; ces mesures DOM
et RAF ne certifient pas les performances GPU ou mobile.

## Logs de developpement

Le diagnostic et l'export JSON contiennent les evenements de la session. Le
forwarder console est desactive par defaut et en production. Pour l'activer :

```bash
VITE_FORWARD_LOGS=true npm run dev:all
```

Le serveur ecoute `127.0.0.1:5123` ; le client limite le debit et la taille des
messages. Voir le [socle actuel](../docs/SOCLE_ACTUEL.md) et le
[contrat valide](../docs/bot-spec/03-contrat-et-questions.md).
