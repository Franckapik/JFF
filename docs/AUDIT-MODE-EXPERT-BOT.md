# Mode expert par bot

Premiere version livree le 26 septembre 2026 sur les vues actives. Le mode
expert expose des faits emis par la session autoritaire ; il n'applique aucune
regle de gameplay et n'avance pas l'horloge.

## Disponible

- Activation iconique depuis Terrain, avec nom accessible et etat presse. Le
  mode normal reste disponible.
- Resume compact de six indicateurs par bot et tiroir individuel avec
  chronologie filtree, route et statistiques. La route restante du bot analyse
  est mise en evidence sur la carte.
- Operation, cible, progression, carburant, degats, drone, remorquages,
  ressources deposees et compteurs issus du snapshot.
- Evenements structures pour mouvements, scans, impacts, pertes et achats de
  drones, ressources, maintenance, remorquages, immobilisations et fins.
- `schemaVersion: 10` pour le snapshot courant ; protocole de commandes en version 1.
  Une connexion recoit l'historique complet de la partie. Les diffusions
  periodiques n'envoient que les evenements nouveaux ; le store reconstitue la
  chronologie par sequence. L'export JSON du diagnostic inclut ces evenements.
- Tests du moteur et test de rendu statique accessible dans
  `src/components/session/ExpertBotView.test.tsx`.

Les types d'evenements sont declares dans [model.ts](../src/engine/model.ts),
leur emission et leur ordre dans [session.ts](../src/engine/session.ts), et la
reconstruction dans [useSessionStore.ts](../src/stores/useSessionStore.ts).
[ExpertBotView.tsx](../src/components/session/ExpertBotView.tsx) affiche les
donnees sans reconstruire une regle metier depuis le texte du journal.

## Limites et extensions possibles

Les options rejetees par le planificateur, la probabilite et le tirage exact de
chaque arbitrage, la duree cumulee par etat et l'import/rejeu d'un historique
ne sont pas exposes. La connexion transmet l'historique complet ; mesurer ce
cout avant de viser de tres longues sessions ou de grandes cartes. L'export
est un diagnostic, pas une sauvegarde restaurable. Les informations inconnues
ne doivent pas etre inferees d'un etat final ambigu.

Un graphe complet des transitions doit etre derive de la machine active et des
snapshots ([extension E02](bot-spec/04-extensions.md#e02-graphe-de-diagnostic-de-la-machine-active)).
Les decisions metier sont dans le [contrat valide](bot-spec/03-contrat-et-questions.md).
