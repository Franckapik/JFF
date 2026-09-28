# JFF

Simulation de deux bots dans un monde hexagonal partage. Le moteur et l'horloge
sont detenus par un SharedWorker ; les vues Terrain et Diagnostic lisent les
memes snapshots. Le mode expert detaille les evenements et statistiques d'un bot.

## Demarrer

Node 22.12 ou plus recent est requis.

```bash
npm ci
npm run dev
```

- `/vue1` : terrain, selection du bot et mode expert.
- `/vue2` : diagnostic de la session partagee.
- `npm run validate` : types, tests, scenarios Gherkin, lint et build.
- `npm run preview -- --host 127.0.0.1` : servir le build.

## References actuelles

- [Architecture et limites du socle](docs/SOCLE_ACTUEL.md)
- [Audit du jeu et vision créative](docs/AUDIT-ET-VISION-JEU.md)
- [Contrat metier valide](docs/bot-spec/03-contrat-et-questions.md)
- [Scenarios du socle](docs/bot-spec/scenarios/README.md)
- [Audit de la visibilite et du gameplay](docs/bot-spec/05-audit-visibilite-gameplay.md)
- [Extensions envisagees](docs/bot-spec/04-extensions.md)
- [Mode expert](docs/AUDIT-MODE-EXPERT-BOT.md)
- [Parametres des bots](docs/PARAMETRES_COMPORTEMENT_BOTS.md)
- [Commandes et mesures](scripts/README.md)

Les anciennes implementations et leurs analyses restent consultables dans
l'historique Git. Les fichiers presents constituent la reference de travail.
