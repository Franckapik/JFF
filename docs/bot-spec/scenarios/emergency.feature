# language: fr
@socle @emergency
Fonctionnalité: Panne, destruction et suspension du temps
  Les interruptions individuelles d'urgence sont une extension, pas une fonction du socle.

  @EMERG-01
  Scénario: Remorquer un vaisseau sans carburant
    Étant donné un bot hors de sa base et hors station carburant avec 0 carburant
    Et une cargaison de 20 nourritures, 10 débris et 1 spécial
    Quand son remorquage de 5000 ms se termine
    Alors il est à sa base avec une cargaison vide et encore 0 carburant
    Et ces ressources figurent dans les pertes explicites, pas dans le score
    Et son compteur de secours augmente de 1
    Et la base ne fournit aucun carburant après ce remorquage
    Et le bot sans carburant ne peut plus quitter sa base

  @EMERG-02
  Scénario: Éliminer définitivement un vaisseau détruit
    Étant donné un bot dont les dégâts atteignent 100
    Quand la session constate cet état
    Alors le bot est éliminé sans réparation ni réapparition
    Et sa cargaison rejoint les pertes explicites
    Et son score déposé reste conservé mais il n'est plus éligible à la victoire

  @EMERG-03
  Scénario: Suspendre une opération sans la transformer en urgence
    Étant donné une collecte ou un vol de drone en cours
    Quand la session est mise en pause
    Alors le temps logique, la progression et les stocks cessent d'évoluer
    Et aucun rappel de drone, service ou remorquage n'est déclenché par la pause
    Quand la session reprend
    Alors l'opération continue depuis sa progression conservée

  @EMERG-04
  Scénario: Prioriser les besoins simultanés aux frontières d'opération
    Étant donné un bot avec 60 dégâts et 10 carburants
    Et des trajets faisables vers réparation et carburant
    Et aucun service disponible à sa position
    Quand il choisit sa prochaine opération
    Alors la réparation est recherchée avant le ravitaillement distant
    Et une réserve inférieure à 2 carburants hors service aurait priorité sous forme de remorquage
    Et à sa propre base seuls le dépôt et la réparation sont assurés

  @EMERG-05
  Scénario: Ne pas franchir une case avec une réserve inférieure au coût du vaisseau
    Étant donné un vaisseau hors station carburant avec 1 carburant commun
    Quand il tente de se déplacer vers une case voisine
    Alors le déplacement de coût 2 ne démarre pas
    Et aucun carburant supplémentaire n'est créé par le déplacement
