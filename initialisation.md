Le jeu demarre depuis le fichier App.tsx, le HUD associé puis la Scene.tsx contenue dans le canvas. 
Les tuiles sont initialisées depuis la methode du Tile store : initializeGameGrid.
Cette fonction retourne un Tile Map, autrement dit un Tile[] mais classées par coordonnées.
Les tuiles sont marquées comme initialisées dans le game store avec markTilesAsInitialized.
Si les tuiles sont initialisées, 