Le jeu demarre depuis le fichier App.tsx, le HUD associé puis la Scene.tsx contenue dans le canvas. 
Les tuiles sont initialisées depuis la methode du Tile store : initializeGameGrid.
Cette fonction retourne un Tile Map, autrement dit un Tile[] mais classées par coordonnées.
Les tuiles sont marquées comme initialisées dans le game store avec markTilesAsInitialized.
Si les tuiles sont initialisées, un bot de type botId:string est ajouté au nom de bot-0.
Si le nombre de activesBots change et est supérieur à 0, la fonction assignStartingTiles est appelée avec le nombre de bots pour mettre a jour les tuiles en placant des tuiles de départ.
Les tuiles sont mappées et le display est différent en fonction du type et de l'assignedBot.