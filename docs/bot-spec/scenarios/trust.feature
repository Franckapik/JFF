# language: fr
@socle @trust
Fonctionnalité: Confiance directionnelle entre les bots
  La confiance traduit les actes observables de l'autre bot dans un monde partagé.

  @TRUST-01
  Scénario: Garder deux jugements distincts et bornés
    Étant donné une nouvelle session où les deux bots s'accordent chacun 50 points de confiance sur 100
    Quand le Bot 0 repère une mine du Bot 1 pendant son armement
    Alors la confiance du Bot 0 envers le Bot 1 passe à 38
    Et la confiance du Bot 1 envers le Bot 0 reste à 50
    Et chaque valeur reste comprise entre 0 et 100

  @TRUST-02
  Scénario: Lire les causes et les conséquences sur la scène
    Étant donné un joueur qui regarde la scène du Bot 0, prioritaire sur une case disputée
    Quand le Bot 1 attend avant d'entrer sur cette case
    Alors le joueur voit la confiance du Bot 0 envers le Bot 1 passer de 50 à 55
    Et la variation récente apparaît sur la case de l'événement avec sa valeur signée
    Et le flux d'événements nomme la cause et la case sélectionnable
    Mais le joueur du Bot 1 ne voit pas le jugement privé du Bot 0

  @TRUST-03
  Scénario: Comparer les jugements dans la vue développeur
    Étant donné un joueur en vue développeur
    Alors la scène montre simultanément la confiance du Bot 0 envers le Bot 1 et celle du Bot 1 envers le Bot 0
    Et chaque dernière cause reste lisible après la disparition du signal temporaire sur la case
