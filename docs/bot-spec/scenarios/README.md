# Scenarios du socle valide

Les dix fichiers `.feature` expriment les decisions Q01-Q20 du
[contrat](../03-contrat-et-questions.md). Ils contiennent 56 definitions et
67 cas apres expansion des exemples. Les identifiants tels que `COL-03`
sont stables ; les etapes decrivent des effets, pas les anciens guards.

## Verification

- `npm run scenarios:check` : syntaxe Gherkin francaise, identifiants uniques,
  scenarios non vides et compilation des exemples. **Ne joue pas les etapes.**
- `npm test` : tests du moteur et du transport dans
  [session.test.ts](../../../src/engine/session.test.ts).
- `npm run validate` et la CI comprennent ces deux controles distincts.
- Les vues et les comportements propres au navigateur se verifient dans le
  navigateur ; les mesures locales figurent dans le
  [bilan de cloture](../../AUDIT-2026-09-26.md#cloture-du-socle-apres-validation-du-questionnaire).

## Tracabilite

Les originaux etaient inchanges dans la revision Git
`87cce823b28ed6b1da74e83fdd1e6d980e12f93f`. Les noms de fichiers sont conserves.
Pour retrouver un scenario supprime ou fusionne :

```bash
git show 87cce823b28ed6b1da74e83fdd1e6d980e12f93f:docs/bot-spec/scenarios/collection.feature
```

Le tableau ci-dessous relie chaque groupe historique aux decisions et aux
nouveaux identifiants. Les divergences S01-S38 de l'audit restent un constat
historique, pas une description du code apres cloture.

| Fichier | Divergences historiques | Nouveaux IDs | Preuve comportementale disponible |
| --- | --- | --- | --- |
| initialization.feature | S01-S04, S38 | INIT-01 a INIT-05 | Tests creation, initialisation idempotente, reset et rejet ancien snapshot |
| initialization-fairness.feature | S05-S07 | FAIR-01 a FAIR-05 | Tests symetrie, connectivite, graines et tailles limites ; pas de garantie de score egal |
| exploration.feature | S08-S13 | EXP-01 a EXP-06 | Tests scans publics exclus, rayon mobile et connaissance individuelle ; heuristiques relues dans `plan()` |
| collection.feature | S14-S19 | COL-01 a COL-07 | Tests compartiments, concurrence, tentative vide, prelevements repetes et invariants ; politique de retour relue |
| maintenance.feature | S20-S22, S25 | MAINT-01 a MAINT-07 | Tests lieux, trajets, services, extensions et drone ; seuils exacts relus dans `plan()` |
| danger-tiles.feature | S12, S23-S26 | DANGER-01 a DANGER-04 | Tests degats par arrivee et perte de drone aux trois distances ; terrain statique inspecte |
| emergency.feature | S27-S29 | EMERG-01 a EMERG-04 | Tests pause, remorquage et elimination ; ordre des priorites relu |
| game-over.feature | S31-S34 | END-01 a END-06 | Tests derniers depots, egalite, survivants, blocages et absence de perte fictive |
| multi-bot.feature | S35-S38 | MULTI-01 a MULTI-05 | Tests concurrence et temps ; vues, connaissance masquee et synchronisation verifiees en navigateur |
| edge-cases.feature | S30-S31 | EDGE-01 a EDGE-07 | Tests chemins, entrees invalides, pas et reconnexion ; controles responsive manuels |

Cette correspondance n'affirme pas qu'un test execute chaque phrase de chaque
scenario. En particulier, les heuristiques de choix et certains seuils ont une
preuve par lecture du moteur, pas une couverture exhaustive par exemples.

## Regles remplacees et extensions

Remplacees par decision : reserve de base de 400, surcharge globale a 80 %,
rayon partage, penalites de score/degats a l'extension, fin au rayon 3, achat
de drone contre degats, chargement consommant du carburant, decouverte du
danger apres un retour fictif.

Differees explicitement : interruptions individuelles, dangers mobiles,
flottes, sauvegardes, graphe complet et selection des grandes cartes.
Voir le [carnet des extensions](../04-extensions.md). Les anciennes promesses
de rendement sur 50/100 tuiles ne sont pas des criteres certifies du socle.