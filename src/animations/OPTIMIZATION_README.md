# Optimisation du hook useDroneAnimation

## Résumé des changements

Le fichier `useDroneAnimation.ts` a été optimisé pour réduire le nombre de lignes et améliorer les performances.

### Changements principaux

#### 1. **useFrame conditionnel** ✅
- Le `useFrame` ne s'exécute plus que quand nécessaire
- Contrôlé par `animationEnabled.current`
- Désactivé quand le drone est `docked` et non en mouvement

#### 2. **Factorisation dans des utilitaires** ✅
- **`dronePositionUtils.ts`** : Calculs de position, vitesse, détection d'animation
- **`droneAnimationUtils.ts`** : Animations visuelles par état
- Réduction de la duplication de code

#### 3. **Réduction des logs** ✅
- Suppression du throttling à 60 FPS
- Logs uniquement lors des changements d'état
- Logs plus concis et informatifs

### Statistiques

- **Avant** : ~281 lignes
- **Après** : ~175 lignes  
- **Réduction** : ~37% de lignes en moins

### Utilitaires créés

```typescript
// dronePositionUtils.ts
- calculateTargetPosition()
- getDroneSpeed()
- shouldAnimateDrone()
- calculateWorldPosition()

// droneAnimationUtils.ts
- applyDroneVisualAnimations()
```

### Conditions d'activation de useFrame

Le `useFrame` s'active uniquement si :
1. La **target position a changé**
2. Le drone est **en mouvement** (`isMoving = true`)
3. Le drone nécessite une **animation continue** (`scanning`, `docked`, etc.)

### Pour appliquer les changements

1. Remplacer le contenu de `useDroneAnimation.ts` par `useDroneAnimation_clean.ts`
2. Les utilitaires sont prêts dans `./utils/`
3. Tester le comportement pour s'assurer que l'animation fonctionne correctement

### Performance attendue

- ⚡ Moins d'appels `useFrame` inutiles
- 🎯 Animation plus ciblée
- 📝 Code plus maintenable
- 🔧 Logique réutilisable
