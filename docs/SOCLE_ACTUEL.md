# Socle actuel de JFF

Etat : socle clos sur la reference locale Linux/Chromium le 26 septembre 2026.
Le code et les [decisions validees](bot-spec/03-contrat-et-questions.md) font
foi. Les fonctions listees dans les [extensions](bot-spec/04-extensions.md)
ne sont pas incluses dans cette cloture.

## Architecture

- `src/engine/session.ts` detient le monde commun, les deux bots, les
  decisions, les transactions et l'horloge logique unique.
- `src/engine/botMachine.ts` represente les operations XState v5. La session
  choisit les intentions faisables et applique leurs effets.
- `src/engine/world.ts` genere une carte reproductible en coordonnees axiales,
  avec ressources symetriques et un service unique de chaque type place a
  distance de trajet presque egale des deux bases ; il calcule les trajets
  adjacents par BFS.
- `src/engine/resources.ts` applique les transferts par compartiment ;
  `src/engine/rules.ts` contient les valeurs reglementaires.
- `src/workers/session-worker.ts` partage une seule `SessionHost` entre les
  onglets de meme origine. `src/engine/protocol.ts` valide les commandes et
  l'identite de partie ; `src/stores/useSessionStore.ts` reconstruit les
  snapshots. Aucun moteur local de secours n'est prevu.
- `src/components/session/` contient le terrain, le diagnostic et le mode
  expert. Le rendu interpole les snapshots sans avancer la simulation.

Le flux est : transaction de session -> contexte XState -> snapshot versionne
-> store Zustand -> affichage React/Three.js. Le worker publie au plus dix
mises a jour periodiques par seconde, hors commandes et connexions.

Les tuiles ou un bot s'arrete pour agir sont exclusives. Le dernier pas vers
une cible reserve la place, tandis que les trajets intermediaires restent
survolables. Le bot concurrent attend sans frais sur la tuile d'approche ;
deux bots face a face peuvent echanger leur place par un croisement en vol.

## Garanties et sorties

Pour chaque ressource : stock restant dans le monde + cargaisons + depots
cumules + pertes explicites = stock initial. Pour chaque bot : budget +
depenses = debris deposes ; score = Provisions deposees ; actions disponibles +
actions depensees = ressources speciales deposees. La provenance des collectes ne constitue pas un
stock supplementaire. La session peut finir normalement apres les derniers
depots ou passer en `blocked` lorsqu'aucun objectif ou retour n'est faisable.
Le blocage n'invente ni vainqueur ni perte de cargaison pour un vaisseau immobilise.

Le snapshot est en `schemaVersion: 11` et transporte des evenements metier
structures pour le mode expert ; le protocole de commandes reste en version 1.
Un onglet avec un ancien worker doit etre ferme avant reconnexion. L'export
JSON est un diagnostic, pas une sauvegarde restaurable.

## Verification

Utiliser Node >= 22.12 puis `npm run validate`. Cette commande controle les
types de tout `src/`, les tests Vitest, la syntaxe et les identifiants des dix
fichiers Gherkin, le lint et le build. Les etapes Gherkin ne sont pas executees.
La CI lance `npm ci` puis `scripts/pre-commit.sh`, qui ajoute un audit des
dependances. Les controles des vues sur le build servi doivent couvrir
`/vue1`, `/vue2`, la connexion au worker et les commandes principales.

`npm run benchmark` mesure les cartes de 37 et 217 cases, le temps des ticks,
la taille des snapshots et la memoire sur la machine courante. Les anciennes
mesures locales ne certifient pas d'autres navigateurs ou appareils. Un chunk
3D superieur a 500 ko peut produire un avertissement Vite sans echec du build.
Le protocole de reproduction se trouve dans [scripts/README.md](../scripts/README.md).
