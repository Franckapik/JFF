# Contrat de reference et decisions validees

Date : 26 septembre 2026. Etat : decisions Q01-Q20 validees par le concepteur.

Ce document accompagne la [feuille de route](../AUDIT-2026-09-26.md#feuille-de-route).
Le concepteur a ensuite explicitement valide toutes les recommandations : Q12 = B ; toutes les autres reponses = A.
Les dix fichiers de scenarios sont reecrits selon ces decisions. Leur origine et leur niveau de verification sont documentes dans le [registre de migration](scenarios/README.md).
La cloture porte sur le socle actuel et la cible locale Linux/Chromium, pas sur les [extensions futures](04-extensions.md).

## Contrat deja valide

- Deux bots en competition dans un monde partage ; connaissance, score, budget et progression individuels.
- Drone rattache au vaisseau mobile ; rayon centre sur celui-ci. Choix probabiliste entre intentions faisables, maintenance urgente prioritaire.
- Compartiments independants : nourriture 200, debris 1800, special 3. Collectes partielles possibles, sans duplication du stock partage.
- Depot a sa propre base : credit du score cumule et du budget. Achats sur le budget uniquement : rayon 1 vers 2 pour 50, puis 2 vers 3 pour 100, maximum 3.
- Depot, carburant, reparation et achats a sa base ; stations specialisees pour carburant ou reparation. Services gratuits et locaux.
- Chaque pas coute 1 carburant, aller et retour. Panne loin d'un point de carburant : remorquage, perte declaree de la cargaison, reprise.
- Degats a 100 : elimination definitive. Fin normale : epuisement des ressources accessibles, derniers retours et depots, comparaison des scores deposes.
- Monde gere par une session et une horloge ; le rendu ne decide pas. Tests automatises cibles autorises.
- Sur un danger, le drone est perdu et la cible revelee des son arrivee, sans attendre un scan ou retour fictif. Le vaisseau distant reste indemne.

Invariant physique, **pour chaque ressource** : stock restant + cargaisons + depots cumules + pertes explicites = stock initial.
Invariant financier : budget + depenses = score depose. Le registre des collectes est une provenance, pas un stock a ajouter au bilan.

## Corrections de cette tranche

Ces choix conservateurs sont desormais valides, implementes et testes :

- Services publics exclus des objectifs de scan ; ils restent traversables et visibles dans l'inspecteur.
- Distinction entre tentatives de collecte, collectes non vides et tuiles distinctes. Quantites prelevees cumulees par bot et par coordonnee, meme apres depot ou perte.
- Vue individuelle du panneau du bot selectionne ; diagnostic de provenance et consommation cumulee de carburant.
- Etat de session `blocked` si les objectifs ou le retour final sont impossibles. Pas de victoire artificielle, de destruction inventee ni de conversion gratuite de cargaison en score. Le temps s'arrete ; export et nouvelle partie restent disponibles.
- Snapshot `schemaVersion: 3` avec evenements metier structures pour le mode expert, protocole de commandes toujours 1. Un ancien worker est refuse avec une erreur recuperable : fermer ses anciens onglets avant reconnexion. Pas de second monde local de secours.

Le point d'entree executable est [session.ts](../../src/engine/session.ts), les valeurs sont dans [rules.ts](../../src/engine/rules.ts), les checks dans [session.test.ts](../../src/engine/session.test.ts).

## Historique du questionnaire

Les options ci-dessous conservent le raisonnement pedagogique ayant conduit aux decisions.
Elles ne sont plus ouvertes : le registre des reponses fait foi. Une evolution ulterieure demande une nouvelle decision explicite.

### Perimetre et preuve

#### Q01. Quelle version cloturons-nous ?

**Actuel :** socle jouable avec deux bots ; pas de dangers mobiles, flotte de drones, sauvegarde persistante ni interruption individuelle d'urgence.
**Exemple :** une ancienne exigence reclame un danger qui se deplace alors que le nouveau moteur utilise un terrain fixe.
**A :** cloturer le socle actuel et inscrire ces fonctions comme extensions. **B :** les exiger pour cette version, apres specification.
**Recommandation : A**, pour distinguer stabilite du socle et enrichissement fonctionnel. B maintient la feuille de route ouverte.

#### Q02. Quels appareils font foi ?

**Actuel :** mesures sur ce poste Linux, Node 22.20 et Chromium integre ; affichage mobile emule. Aucun telephone physique certifie.
**Exemple :** un ecran de 390 px sur ce PC ne mesure pas les performances d'un smartphone.
**A :** accepter cette reference locale, autres cibles dans une campagne distincte. **B :** fournir navigateurs, appareils et budgets obligatoires avant cloture.
**Recommandation : A pour le prototype**, sans transformer l'emulation en certification mobile.

### Carte et connaissance

#### Q03. Departs fixes ou variables ?

**Actuel :** bases symetriques en bord de carte, positions fixes pour une taille donnee ; la graine change terrain et ressources.
**Exemple :** rejouer une autre graine conserve les positions des deux bases.
**A :** conserver. **B :** positions variables selon la graine, avec distances et acces minimaux a definir.
**Recommandation : A** pour la reference reproductible. Concerne S02 et S38.

#### Q04. Y a-t-il des ressources a la base au depart ?

**Actuel :** zero ; aucune base n'est une tuile de collecte. Les anciens textes se contredisent sur une reserve de 400.
**A :** zero. **B :** reserve initiale, en precisant sa composition, son proprietaire et si elle appartient au bilan physique.
**Recommandation : A**, sans credit gratuit implicite. Concerne S03.

#### Q05. Quelle garantie d'equite ?

**Actuel :** symetrie de la carte initiale et connectivite testees, pas de validateur generique de cartes arbitraires.
**Exemple :** des scores finaux differents ne prouvent pas une carte inegale : les decisions des bots peuvent diverger.
**A :** accepter la symetrie comme garantie de cette version. **B :** definir des tolerances de distances, stocks et obstacles, puis un rapport et des tentatives bornees de generation.
**Recommandation : A** tant qu'aucun import de carte arbitraire n'est requis. Concerne S05-S07.

#### Q06. Que faut-il envoyer scanner ?

**Actuel apres correction :** ressources, cases vides et dangers inconnus ; pas les bases, stations ou obstacles publics.
**Exemple :** une station connue par sa fonction ne consomme plus un aller-retour de drone.
**A :** confirmer cette separation. **B :** cacher certains services et autoriser leur decouverte, en precisant lesquels.
**Recommandation : A** ; B impose d'aligner aussi l'affichage et la recherche des services. Concerne S09.

#### Q07. Que sait le vaisseau sans drone ?

**Actuel :** il decouvre la case ou il arrive et peut continuer a chercher des frontieres ; les bots ne partagent pas leurs decouvertes.
**Exemple :** perdre le drone n'interdit pas au vaisseau de decouvrir une ressource en s'y deplacant.
**A :** conserver. **B :** interdire de nouvelles decouvertes sans drone, mais permettre les services et la collecte deja connue.
**Recommandation : A**, pour eviter un blocage automatique sans budget de remplacement. Concerne S10 et S26.

### Decisions et services

#### Q08. Comment choisir et quand decharger ?

**Actuel :** meilleures collectes classees par quantite / longueur de trajet ; arbitrage probabiliste avec le scan. Un compartiment plein et une cible ailleurs peuvent provoquer le retour meme si un autre compartiment reste libre.
**Exemple :** special plein, debris encore disponibles : le retour n'attend pas obligatoirement de remplir tous les compartiments.
**A :** conserver ces heuristiques. **B :** preciser une autre priorite et la condition de retour.
**Recommandation : A comme reference initiale**, sans figer des pourcentages de rendement non mesures. Concerne S08, S14-S15 et S19.

#### Q09. Quels seuils declenchent la maintenance ?

**Actuel :** reparation a partir de 50 degats ; carburant urgent a 20 ou sous le cout d'acces au service + reserve de 3. Sur une station carburant, service automatique sous 30 ; reparation prioritaire entre deux besoins distants.
**Exemple :** 28 carburants n'imposent pas toujours un retour, mais 50 degats declenchent une recherche de reparation.
**A :** conserver. **B :** donner les seuils et la priorite quand les deux besoins coexistent.
**Recommandation : A**, sous reserve des tests de trajets et de reserve. Concerne S20 et S28.

#### Q10. Un passage a la base est-il un service combine ?

**Actuel :** en 1 200 ms, depot complet, plein et reparation complete. Une station specialisee ne rend que son service.
**A :** conserver. **B :** separer depot, plein et reparation, avec ordre, durees et possibilite d'interruption a definir.
**Recommandation : A**, sans modifier leur gratuite deja validee. Concerne S21.

#### Q11. Charger consomme-t-il aussi du carburant ?

**Actuel :** seuls les deplacements en consomment ; la collecte coute du temps.
**Exemple :** deux chargements sur place ne retirent pas de carburant.
**A :** conserver. **B :** ajouter un cout, a chiffrer ; la reserve de retour devra l'anticiper.
**Recommandation : A** pour la lisibilite du bilan de deplacement. Concerne S16.

### Dangers et interruptions

#### Q12. Quand le drone est-il perdu, et que revele son echec ?

**Avant decision :** perte et decouverte en fin de l'operation complete. **Actuel :** perte et decouverte des l'arrivee sur le danger ; vaisseau distant indemne.
**Exemple :** le danger apparait dans la connaissance meme si le drone est detruit.
**A :** conserver. **B :** perte et decouverte des l'arrivee. **C :** perte a l'arrivee sans revelation complete, avec memorisation d'une cible a risque pour eviter de la retenter indefiniment.
**Decision : B**, implementee dans l'ordonnanceur et testee aux distances 1, 2 et 3. Concerne S12, S24 et S26.

#### Q13. Comment remplacer le drone perdu ?

**Actuel :** uniquement a sa base, pour 50 de budget, sans toucher au score. Pas d'echange contre des degats.
**A :** conserver. **B :** autoriser une solution sans budget ; preciser prix, contrepartie et limite.
**Recommandation : A**. L'ancien remplacement contre +20 degats serait une nouvelle regle, pas une correction. Concerne S25.

#### Q14. Faut-il une urgence distincte de la pause ?

**Actuel :** pause globale, puis reprise exacte. Pas d'evenement d'urgence qui interrompe individuellement une operation de bot.
**Exemple :** mettre en pause une collecte ne l'annule pas et ne declenche aucun secours.
**A :** conserver la pause et differer l'interruption individuelle. **B :** ajouter celle-ci ; preciser les etats interruptibles et le sort de l'operation, du trajet, du temps restant et de la cargaison.
**Recommandation : A pour cette version**. Concerne S23, S27 et S29 ; la pause ne sera jamais decrite comme une couverture des urgences historiques.

#### Q15. Que faire si aucun objectif ou retour n'est faisable ?

**Actuel apres correction :** session `blocked`, temps arrete, aucun vainqueur, cargaison et degats preserves, export/reset possibles.
**Exemple :** un vaisseau a 90 degats devrait traverser un danger mortel pour rentrer ; cela ne justifie ni sa destruction fictive ni un depot a distance.
**A :** conserver ce diagnostic explicite. **B :** definir une regle de secours exceptionnelle, differente de la panne de carburant. **C :** definir une defaite pour immobilisation, avec traitement explicite de la cargaison.
**Recommandation : A tant que B/C ne sont pas definis**. Concerne S31 et la sortie attendue du lot 2.

### Resultats et prochaines etapes

#### Q16. Qui peut gagner et comment traiter les egalites ?

**Actuel :** seuls les survivants sont eligibles ; tous les meilleurs scores ex aequo gagnent. Aucun survivant ou session bloquee : aucun vainqueur.
**Exemple :** un bot elimine avec 500 points ne bat pas un survivant avec 300.
**A :** conserver. **B :** definir un autre classement ou departage, sans modifier retroactivement le score depose.
**Decision : A**, classement confirme. Concerne S34.

#### Q17. Quelles durees garder ?

**Actuel :** pas 400 ms ; scan 800 ms plus aller-retour ; collecte 1 000 ms ; service 1 200 ms ; achat/extension 1 000 ms ; remorquage 5 000 ms. Les vitesses 1x/2x/4x/8x accelerent la meme horloge.
**A :** conserver. **B :** fournir les valeurs souhaitees. Ne pas confondre vitesse d'animation et duree metier.
**Recommandation : A** avant une campagne d'equilibrage. Concerne S13, S19 et S33.

#### Q18. Que signifie le mot "collecte" dans les scenarios ?

**Actuel apres correction :** trois mesures distinctes : tentative terminee, transfert non vide, tuile distincte ayant fourni des ressources. La provenance cumule les quantites, pas les seuls stocks encore transportes.
**Exemple :** deux bots arrivent sur 10 nourritures : deux tentatives, un transfert non vide, une tuile recoltee par le gagnant de la transaction.
**A :** garder les trois termes explicites. **B :** preciser une autre mesure principale, sans fusionner ces faits differents.
**Recommandation : A**. Concerne S17-S18 et S37.

#### Q19. Quel diagnostic visuel est indispensable ?

**Actuel :** etat reel, cible, compteurs, bilan, provenance, logs bornes et panneau individuel via Vision ; pas de graphe anime complet des transitions.
**A :** accepter ces vues pour cette version. **B :** exiger le graphe derive de la machine active, en plus des tableaux.
**Recommandation : A pour le socle**, B comme outil de conception suivant. Concerne S36-S37.

#### Q20. Quelle extension faut-il specifier ensuite ?

**Actuel :** terrain fixe, un drone par bot, pas de persistance apres fermeture du worker ; export JSON sans import. Le generateur accepte 217 tuiles, mais l'interface lance 37 tuiles.
**A :** aucune extension pour cette cloture. **B :** dangers mobiles. **C :** plusieurs drones. **D :** sauvegarde/reprise. **E :** grandes cartes selectionnables. Plusieurs choix possibles, avec un ordre de priorite.
**Recommandation : A pour cloturer, puis une seule priorite.** B exige cadence et collisions ; C ordonnancement et capacites ; D versionnement et restauration ; E cadrage et budgets sur l'appareil cible.

## Registre des reponses validees

| Question | Choix | Decision retenue                                              |
| -------- | ----- | ------------------------------------------------------------- |
| Q01      | A     | Socle actuel ; fonctions historiques absentes en extensions   |
| Q02      | A     | Reference locale Linux/Chromium et viewport mobile emule      |
| Q03      | A     | Bases fixes et symetriques                                    |
| Q04      | A     | Bases sans ressources initiales                               |
| Q05      | A     | Symetrie initiale, sans validateur de cartes arbitraires      |
| Q06      | A     | Services et obstacles publics non scannables                  |
| Q07      | A     | Decouverte possible par le vaisseau sans drone                |
| Q08      | A     | Heuristiques actuelles de collecte et de dechargement         |
| Q09      | A     | Seuils et priorites actuels de maintenance                    |
| Q10      | A     | Service gratuit combine a sa base en 1200 ms                  |
| Q11      | A     | Aucun carburant facture au chargement                         |
| Q12      | B     | Perte et decouverte du danger des l'arrivee du drone          |
| Q13      | A     | Remplacement a sa base pour 50 de budget uniquement           |
| Q14      | A     | Pause globale ; interruptions individuelles differees         |
| Q15      | A     | Blocage explicite, sans vainqueur ni destruction artificielle |
| Q16      | A     | Survivants seuls eligibles ; egalites partagees               |
| Q17      | A     | Durees actuelles et horloge unique                            |
| Q18      | A     | Tentatives, transferts non vides et tuiles distinctes separes |
| Q19      | A     | Diagnostic actuel ; graphe complet en extension               |
| Q20      | A     | Aucune extension supplementaire dans cette cloture            |

## Correspondance des scenarios reecrits

| Fichier                                                                      | Decisions appliquees | Base executable actuelle                           |
| ---------------------------------------------------------------------------- | -------------------- | -------------------------------------------------- |
| [initialization.feature](scenarios/initialization.feature)                   | Q03-Q04              | creation, graine et protocole                      |
| [initialization-fairness.feature](scenarios/initialization-fairness.feature) | Q03-Q05              | symetrie, connectivite, tailles limites            |
| [exploration.feature](scenarios/exploration.feature)                         | Q06-Q08, Q12, Q17    | rayon mobile et connaissance individuelle          |
| [collection.feature](scenarios/collection.feature)                           | Q08, Q11, Q18        | compartiments et transactions concurrentes         |
| [maintenance.feature](scenarios/maintenance.feature)                         | Q09-Q11, Q13, Q17    | services locaux, achats individuels                |
| [danger-tiles.feature](scenarios/danger-tiles.feature)                       | Q12-Q14, Q20         | degats par arrivee, perte de drone                 |
| [emergency.feature](scenarios/emergency.feature)                             | Q14-Q15              | remorquage et elimination ; interruptions absentes |
| [game-over.feature](scenarios/game-over.feature)                             | Q15-Q16              | derniers depots, egalite, blocage explicite        |
| [multi-bot.feature](scenarios/multi-bot.feature)                             | Q16, Q18-Q19         | monde partage et arbitrage concurrent              |
| [edge-cases.feature](scenarios/edge-cases.feature)                           | Q01-Q02, Q15, Q20    | pause, absence de chemin, limites et protocole     |

Les evenements obsoletes ont ete remplaces par des effets observables. Chaque scenario dispose d'un identifiant stable ; les fonctions differees sont listees separement, sans promesse de livraison implicite.

Les 43 tests Vitest ne sont **pas** une execution des fichiers `.feature`. `npm run scenarios:check` utilise le parseur officiel pour verifier les 10 fichiers, 56 identifiants et 67 cas decrits apres expansion des exemples. L'execution des etapes Gherkin reste une extension ; aucun taux de couverture Gherkin n'est revendique.
