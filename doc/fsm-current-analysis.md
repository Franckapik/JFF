# Analyse de la Machine à États Finis (FSM) Actuelle

Ce document détaille la logique de la FSM actuelle dans `src/ai/` et `useBotStore` pour faciliter la compréhension et la migration vers `react-robot`.

## Table des États, Transitions, Actions et Conditions

| **État** | **Transitions Possibles** | **Actions Disponibles** | **Conditions de Transition** | **Actions d'Entrée** | **Actions de Sortie** |
|----------|---------------------------|--------------------------|------------------------------|----------------------|----------------------|
| **IDLE** | `EXPLORING`<br>`COLLECTING`<br>`RETURNING` | - `evaluateConditionsFromIdle`<br>- `refuel` (si à la base)<br>- `moveToResource`<br>- `exploreDrone`<br>- `returnToBase` | **Vers EXPLORING:**<br>- À la base ET carburant plein<br>- Pas assez de ressources connues<br>- `hasEnoughFuel() && !hasEnoughKnownResources()`<br><br>**Vers COLLECTING:**<br>- Ressources connues disponibles<br>- Carburant suffisant<br>- `hasEnoughKnownResources() && hasEnoughFuel()`<br><br>**Vers RETURNING:**<br>- Carburant bas (`fuel < 50`)<br>- Capacité maximale atteinte<br>- `isLowFuel() \|\| isAtMaxCapacity()` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **EXPLORING** | `IDLE` | - `exploreWithDrone`<br>- Timeout après 30s<br>- Retour automatique à IDLE | **Vers IDLE:**<br>- Drone de retour au vaisseau<br>- Ressources découvertes<br>- Exploration terminée<br>- `isDroneAtShip() && hasExplored`<br>- Conditions critiques (carburant/capacité) | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **COLLECTING** | `IDLE`<br>`RETURNING` | - `moveToResourceAction`<br>- `collectResourceAction`<br>- Séquence en 2 étapes | **Vers IDLE:**<br>- Toutes ressources collectées<br>- `allKnownResourcesCollected()`<br><br>**Vers RETURNING:**<br>- Capacité maximale atteinte<br>- `isAtMaxCapacity()` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |
| **RETURNING** | `IDLE` | - `returnToBaseAction`<br>- Déplacement vers base<br>- Timeout après 30s | **Vers IDLE:**<br>- Arrivé à la base<br>- `isAtBase(botVehicle)`<br>- `botVehicle.coord === botVehicle.startCoord` | `StateUtils.handleStateEnter()` | `StateUtils.handleStateExit()` |

## Conditions Détaillées

### 🔴 Conditions de Sécurité (Priorité SAFETY = 4)

| **Condition** | **Fonction** | **Seuils** | **Action Résultante** |
|---------------|-------------|------------|----------------------|
| Carburant bas | `isLowFuel(botVehicle, threshold=50)` | `fuel < 50` | `returnToBase` (PRIORITY.HIGH) |
| Carburant suffisant | `hasEnoughFuel(botVehicle, threshold=50)` | `fuel >= 50` | Permet autres actions |
| Capacité maximale | `isAtMaxCapacity(botVehicle)` | `food >= maxFood \|\| debris >= maxDebris \|\| special >= maxSpecial` | `returnToBase` (PRIORITY.HIGH) |

### 🟡 Conditions de Capacité (Priorité CAPACITY = 3)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| À la base | `isAtBase(botVehicle)` | `botVehicle.coord === botVehicle.startCoord` | Permet ravitaillement |
| Plein de carburant | `isFullyRefueled(botVehicle)` | `fuel >= 100` | Permet exploration/collecte |

### 🟠 Conditions d'Efficacité (Priorité EFFICIENCY = 2)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| Ressources connues suffisantes | `hasEnoughKnownResources()` | `knownResources.length >= 3` | `moveToResource` vers COLLECTING |
| Ressources découvertes | `hasDiscoveredResources()` | `hasNewResourceDiscovery === true` | Transition vers IDLE pour réévaluation |
| Toutes ressources collectées | `allKnownResourcesCollected()` | Vérification mémoire du bot | Retour IDLE |

### 🔵 Conditions de Découverte (Priorité DISCOVERY = 1)

| **Condition** | **Fonction** | **Logique** | **Action Résultante** |
|---------------|-------------|-------------|----------------------|
| Besoin d'explorer | `shouldExplore(botVehicle)` | `!hasEnoughKnownResources() && hasEnoughFuel()` | `exploreDrone` vers EXPLORING |
| Drone au vaisseau | `isDroneAtShip()` | `useDroneState.isDroneDocked(botDroneId)` | Permet nouvelle exploration |
| Drone en mouvement | `isDroneMoving()` | `droneState.isDroneInState(...MOVING_TO_TARGET \|\| RETURNING_TO_SHIP)` | Attendre fin mouvement |

## Actions Spécifiques

### Actions par État

| **Action** | **État Source** | **Description** | **Durée/Timeout** | **Conditions d'Échec** |
|------------|-----------------|-----------------|------------------|----------------------|
| `evaluateConditionsFromIdle` | IDLE | Évalue les conditions et décide du prochain état | Throttling 2s | - |
| `exploreWithDrone` | EXPLORING | Envoie drone explorer tuile non découverte | 30s timeout | Drone indisponible |
| `moveToResourceAction` | COLLECTING | Déplace vaisseau vers meilleure ressource | 30s timeout | Pas de ressources |
| `collectResourceAction` | COLLECTING | Collecte ressource à la position actuelle | - | Pas à la tuile cible |
| `returnToBaseAction` | RETURNING | Retour à la tuile de départ | 30s timeout | Base introuvable |
| `refuelAtBaseAction` | IDLE/BASE | Ravitaillement et transfert ressources | - | Pas à la base |

### Logique de File d'Actions

- **File unique par bot** dans `useBotStore`
- **Priorités**: URGENT(4) > HIGH(3) > MEDIUM(2) > LOW(1)
- **États d'action**: PENDING, IN_PROGRESS, COMPLETED, FAILED
- **Vidage de file** lors des changements d'état

## Critiques de l'Architecture Actuelle

### ❌ **Problèmes Majeurs Identifiés**

#### 1. **Anti-Pattern "IDLE Central"**
- **Problème** : Tous les états reviennent à IDLE pour réévaluation
- **Impact** : Ralentit les transitions, overhead inutile
- **Exemple** : `EXPLORING → IDLE → COLLECTING` au lieu de `EXPLORING → COLLECTING`

#### 2. **Manque de Transitions Directes d'Urgence**
- **Problème** : Pas de transition `* → RETURNING` pour les urgences
- **Impact** : Délai dangereux en cas de carburant critique
- **Exemple** : Bot en COLLECTING avec fuel=10, doit passer par IDLE

#### 3. **Gestion Incohérente des Timeouts**
- **Problème** : Timeouts différents selon les états (30s vs 2s throttling)
- **Impact** : Comportement imprévisible
- **Exemple** : Exploration 30s vs évaluation 2s

#### 4. **Duplication de Logique**
- **Problème** : Conditions dupliquées entre states et actions
- **Impact** : Maintenance difficile, bugs potentiels
- **Exemple** : `isLowFuel` défini dans conditions ET actions

#### 5. **Couplage Fort Store/FSM**
- **Problème** : FSM directement intégrée dans useBotStore
- **Impact** : Difficile à tester, réutiliser, débugger
- **Exemple** : Logic FSM mélangée avec gestion des données

### ⚠️ **Problèmes Mineurs**

#### 1. **Throttling Trop Lent**
- `evaluateConditionsFromIdle` throttlé à 2s
- Impact : Réactivité réduite, perception de lag

#### 2. **Conditions Complexes**
- Logique imbriquée difficile à comprendre
- Exemple : `hasEnoughFuel() && !hasEnoughKnownResources() && isAtBase()`

#### 3. **Pas de Visualisation**
- Debug difficile sans représentation graphique
- États et transitions opaques

## Recommandations pour Migration

### 🎯 **Objectifs de l'Architecture Optimisée**

1. **Éliminer l'anti-pattern IDLE central**
2. **Ajouter transitions directes d'urgence**
3. **Unifier la gestion des timeouts**
4. **Découpler FSM du store**
5. **Améliorer la testabilité**

### 📋 **Plan de Migration**

1. **Phase 1** : Créer la nouvelle structure React-Robot en parallèle
2. **Phase 2** : Migrer les conditions et actions existantes
3. **Phase 3** : Tester la nouvelle FSM avec les données actuelles
4. **Phase 4** : Remplacer progressivement l'ancienne FSM
5. **Phase 5** : Supprimer l'ancien code et nettoyer

Cette analyse met en évidence les limitations de l'architecture actuelle et justifie le besoin d'une refactorisation complète vers React-Robot avec une approche plus modulaire et performante.
