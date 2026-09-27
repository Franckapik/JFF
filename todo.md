# Carnet creatif JFF

Notes d'intention personnelles et pistes non decidees. Elles ne definissent
aucune regle du moteur, aucun engagement de livraison et aucun etat du socle.
Le contrat technique et metier courant se trouve dans `docs/SOCLE_ACTUEL.md`
et `docs/bot-spec/03-contrat-et-questions.md`.

## Intention

La regle essentielle du projet est de **s'amuser** et de proteger l'imagination
contre une recherche sans fin du rendu parfait. J'aimerais montrer quelque
chose de complet et surprenant, pouvoir y jouer moi-meme, le montrer aux
autres, peut-etre le decliner en jeu reel ou en multijoueur. Je veux eviter
que l'accumulation d'idees transforme JFF en chantier permanent.

Melanger matieres du quotidien (papier, bois, carton), symboles numeriques et
3D. Explorer le trompe-l'oeil 2D/3D, un jeu de plateau classique perturbe par
de petites surprises, des pions subtilement animes, une camera qui compose des
scenes et des activites suggerees comme dans un portfolio. Le rendu peut eveiller
la curiosite sans viser le photorealisme. Penser aussi aux spirales.

## Pistes de jeu non arbitrees

- Une vue plus vivante du duel, avec une lecture claire de la victoire et des
  journaux moins verbeux ; eventuellement un mode de simulation tres rapide.
- Un nuage de danger mobile, eventuellement plus large, qui renvoie un drone
  vers une tuile aleatoire comme un brouillard electromagnetique. Examiner ses
  effets sur les stations et les tuiles avant toute regle.
- Terrain modifiable, perception des mines ou carte technologique, acceleration
  du vaisseau ou du drone ; comparer l'interet d'une teleportation.
- Physique et interactions au service de l'experience, pas comme detour pour
  repousser un choix de design.

Ces pistes demandent un contrat distinct avant toute implementation ; les
[extensions connues](docs/bot-spec/04-extensions.md) restent separees.

## Contrat court pour une vignette

A remplir avant de coder et relire a la fin :

1. Nom, intention en une phrase, emotion visee, apprentissage principal et
   **une seule** surprise memorable.
2. Boucle complete en trois lignes : debut, action, fin. Viser 60, 90 ou 120
   secondes. Si la boucle ne tient pas en trois lignes, reduire la portee.
3. Critere « montrable » : lancement simple ; objectif compris en dix secondes ;
   debut et fin ; une surprise ; aucun blocage sur trois minutes ; court GIF
   ou video. Livrer meme si le rendu est imparfait.
4. Choisir au moins trois exclusions temporaires : nouvelle persistance,
   framework, refonte, editeur, multijoueur, inventaire ou texture parfaite.
5. Fixer un seul axe visuel : papier/bois 2.5D, trompe-l'oeil 2D/3D ou jeu de
   plateau avec perturbation subtile. Limiter palette, typo, epaisseur, contours
   et ombres ; garantir la lisibilite.
6. Autoriser une a trois animations courtes et utiles. Eviter particules
   gratuites, camera mobile pendant une action cle et styles incoherents.
7. Fermer la liste technique de la vignette. Ne refactoriser que pour enlever
   un blocage ou simplifier une fonction de la boucle visible.
8. Planifier une session de 30 a 90 minutes : tache amusante et visible,
   boucle terminee, polish minimal. Terminer en jouant deux minutes et en
   ecrivant une seule prochaine action.
9. Si le plaisir se perd : jouer, ajouter une micro-surprise visible, reduire
   une fonction, remplacer une complexite par une illusion, livrer une version
   complete imparfaite ou arreter la vignette pour une autre saison.

Les notes completes anterieures restent dans l'historique Git.
