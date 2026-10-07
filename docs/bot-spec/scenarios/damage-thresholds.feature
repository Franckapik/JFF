# language: fr
@socle @damage
Fonctionnalité: Conséquences progressives des dégâts

  @DMG-01
  Scénario: Réduire le rayon effectif dès 50 dégâts
    Étant donné un bot avec un rayon acheté de 3
    Quand ses dégâts atteignent 50
    Alors sa vision et la portée de ses drones passent à 2 hexagones
    Et son rayon acheté reste 3
    Quand le bot est réparé sur la station dédiée
    Alors son rayon effectif revient à 3

  @DMG-02
  Scénario: Garder un rayon minimal
    Étant donné un bot avec un rayon acheté de 1
    Quand ses dégâts atteignent 50
    Alors son rayon effectif reste à 1

  @DMG-03
  Scénario: Ralentir le vaisseau dès 70 dégâts
    Étant donné un bot avec 70 dégâts
    Quand il parcourt une case
    Alors ce pas dure 800 ms au lieu de 400 ms
    Et le coût en carburant du pas ne change pas

  @DMG-04
  Scénario: Conserver le vaisseau immobilisé à 100 dégâts
    Étant donné un bot avec une cargaison et un score déjà déposé
    Quand ses dégâts atteignent 100
    Alors il reste sur sa tuile sans nouvelle opération
    Et sa cargaison et son score restent conservés
    Et un remorquage sera nécessaire selon une règle à définir
