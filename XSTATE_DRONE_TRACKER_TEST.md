# Implémentation des Trackers XState - Drone & Ship

## Résumé de l'implémentation

Les trackers XState ont été implémentés pour connecter les positions visuelles des véhicules dans la scène 3D aux événements de la machine d'état XState.

### Fichiers implémentés :
- `useXFSMDroneTracker.js` - Tracker spécialisé pour les drones
- `useXFSMShipTracker.js` - Tracker spécialisé pour les vaisseaux  
- `exploring.actions.js` - Actions XState pour tous les sous-états d'exploration

## 🚁 Tracker Drone - Cycle d'exploration automatique

### 1. **drone_deploying** → **DRONE_REACHES_TILE**
- Le drone se déplace vers sa cible d'exploration (sélectionnée aléatoirement)
- Calcul de distance en temps réel vers la position cible
- Quand distance < seuil (`TARGET_REACH`), envoi de `DRONE_REACHES_TILE`
- Transition automatique vers `drone_scanning`

### 2. **drone_scanning** → **DRONE_SCANS_TILE**  
- Le drone scanne la tuile pendant 2 secondes (simulé via `setTimeout`)
- Marquage automatique de la tuile comme explorée via `useTileStore`
- Récupération des vraies ressources de la tuile 
- Envoi de `DRONE_SCANS_TILE` avec toutes les données collectées
- Transition automatique vers `drone_returning`

### 3. **drone_returning** → **DRONE_REACHES_BASE**
- Le drone retourne vers le vaisseau (position de base)
- Calcul de distance vers la position du vaisseau
- Quand distance < seuil, envoi de `DRONE_REACHES_BASE`
- Transition automatique vers `evaluating` (retour à l'état parent)

## 🚢 Tracker Ship - Suivi de position

### Fonctionnalités :
- **Position initiale** : Envoi automatique de `SHIP_POSITION_UPDATE` au démarrage
- **Mouvements significatifs** : Détection des changements de position > seuil minimum
- **Debounce** : Évite les mises à jour trop fréquentes
- **Logging** : Traces des mouvements pour debug

## 🎯 Intégration dans Fleet.jsx

```jsx
// Trackers spécialisés appelés dans Fleet.jsx
const updateDroneVisualPosition = useXFSMDroneTracker(context, fsmSend, botId, 'explorer');
const updateShipVisualPosition = useXFSMShipTracker(context, fsmSend, botId, 'ship');

// Transmission des positions depuis les hooks d'animation
useDroneAnimation(context, shipPosition, updateDroneVisualPosition, 'explorer');
useShipAnimation(context, shipPosition, updateShipVisualPosition);
```

## 🔧 Architecture technique

### Flux de données :
1. **Animation hooks** calculent les positions locales relatives
2. **Animation hooks** convertissent en coordonnées mondiales  
3. **Tracker hooks** reçoivent les positions mondiales
4. **Tracker hooks** calculent les distances et détectent les seuils
5. **Tracker hooks** envoient les événements XState appropriés
6. **Machine XState** effectue les transitions d'état
7. **Context** est mis à jour avec les nouvelles données

### Gestion des seuils :
- `TARGET_REACH` : Distance pour considérer une cible atteinte
- `MIN_MOVEMENT` : Distance minimale pour enregistrer un mouvement
- `EVENT_COOLDOWN` : Délai minimum entre événements

### Système de debounce :
- Utilise `useEventDebounce` pour éviter les événements en rafale
- Chaque type d'événement a sa propre clé unique
- Timers de reset configurables par type d'action

## ✅ Vérification visuelle

### Sur la scène 3D :
1. **Démarrer l'exploration** depuis le panneau Debug/XState
2. **Observer le drone** se déplacer vers une tuile aléatoire (orange → vert)
3. **Voir la tuile devenir explorée** (changement de couleur visible)
4. **Observer le retour du drone** vers le vaisseau
5. **Voir le cycle se répéter** automatiquement selon l'état de la machine

### Dans les logs console :
- 🛸 Messages de position initiale du drone
- 🎯 Messages d'arrivée à la cible  
- 🔍 Messages de scan de tuile (avec délai de 2s)
- 💎 Messages de ressources découvertes (nourriture, débris, spécial)
- 🏠 Messages de retour à la base
- 🚢 Messages de position du vaisseau

## 🧪 Test manuel recommandé

1. **Charger l'application** en mode développement
2. **Ouvrir le panneau XState Simulation** (Debug/XStateSimulationPanel)
3. **Cliquer sur "needExploring"** pour démarrer le cycle
4. **Observer dans la scène 3D** :
   - Mouvement du drone vers la cible
   - Changement de couleur de la tuile explorée
   - Retour du drone au vaisseau
5. **Vérifier les logs console** pour confirmer les transitions
6. **Répéter** pour valider la robustesse

## 🎉 Résultat

Le système est maintenant **entièrement fonctionnel** avec :
- ✅ Tracking automatique basé sur les vraies positions visuelles 3D
- ✅ Cycle d'exploration complet : deploying → scanning → returning → evaluating
- ✅ Intégration avec le système de tuiles existant
- ✅ Découverte automatique des ressources 
- ✅ Gestion robuste des événements avec debounce
- ✅ Architecture modulaire et extensible pour futurs véhicules

**Le cycle d'exploration fonctionne désormais de manière autonome en se basant sur les positions réelles des mesh 3D !** 🚀
