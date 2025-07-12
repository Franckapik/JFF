# Chaîne de Réaction des Fonctions d'Exploration Drone (FSM)

## 1. Déclenchement de l’exploration
- **Événement reçu** : `needExploring`
- **Machine concernée** : `machineX`
- **État courant** : `exploring`
- **Transition** : L’événement déclenche l’action `updateContext`.

## 2. Action de transition : `updateContext`
- **Fichier** : `exploring.actions.ts`
- **Fonction** : `updateContext`
- **Rôle** :
  - Log l’événement.
  - Si l’événement est `needExploring`, appelle la fonction de déploiement du drone :
    ```ts
    const deploymentResult = droneDeployForExploration(context, {
      type: 'droneDeployForExploration',
      range: 3,
      droneType: 'explorer'
    });
    ```
  - Met à jour le contexte avec le résultat du déploiement.

## 3. Déploiement du drone : `droneDeployForExploration`
- **Fichier** : `core/droneExploringActions.ts`
- **Fonction** : `droneDeployForExploration`
- **Rôle** :
  - Vérifie la présence du drone dans la flotte.
  - Sélectionne une tuile cible dans un rayon donné via :
    ```ts
    const targetPosition = selectTargetTileInRadiusForDrone(context, range);
    ```
  - Si aucune tuile n’est trouvée, arrête l’exploration.
  - Met à jour l’état du drone (`deploying`), sa position cible, et le contexte de mission.

## 4. Sélection de la tuile cible : `selectTargetTileInRadiusForDrone`
- **Fichier** : `core/droneExploringActions.ts`
- **Fonction** : `selectTargetTileInRadiusForDrone`
- **Rôle** :
  - Récupère la position du vaisseau.
  - Filtre les tuiles dans le rayon spécifié autour du vaisseau.
  - Sélectionne une tuile au hasard parmi celles disponibles.
  - Retourne la position cible pour le drone.

## 5. Mise à jour du contexte
- Le contexte retourné par `droneDeployForExploration` est utilisé pour mettre à jour l’état global de la FSM.
- Le drone passe à l’état `deploying` et commence à se déplacer vers la tuile cible.

## 6. Handlers d’état du drone
- **Entrée dans l’état `drone_deploying`** :
  - Action : `action_drone_deploying_entry` (log uniquement, la logique de déplacement est déjà gérée).
- **Arrivée sur la tuile cible** :
  - Événement : `DRONE_REACHES_TILE` → transition vers `drone_scanning`.
- **Entrée dans l’état `drone_scanning`** :
  - Action : `action_drone_scanning_entry` (met à jour l’état du drone à `scanning`).
- **Fin du scan** :
  - Événement : `DRONE_SCANS_TILE` → transition vers `drone_returning`.
- **Entrée dans l’état `drone_returning`** :
  - Action : `action_drone_returning_entry` (met à jour l’état du drone à `returning` et cible le vaisseau).
- **Arrivée au vaisseau** :
  - Événement : `DRONE_REACHES_BASE` → transition vers `evaluating`.

---

## Schéma visuel

```
needExploring (event)
   ↓
updateContext (exploring.actions.ts)
   ↓
droneDeployForExploration (droneExploringActions.ts)
   ↓
selectTargetTileInRadiusForDrone (droneExploringActions.ts)
   ↓
Mise à jour du contexte (drone en deploying)
   ↓
[Handlers d’état XState: deploying → scanning → returning → docked]
```

---

# Proposition de Refactorisation et Structure Unifiée

## Objectifs
- **Centraliser** la logique de sélection de tuile et de mise à jour du drone dans des fonctions pures et réutilisables.
- **Unifier** la gestion des événements et des transitions pour tous les types d’actions (exploration, collecte, etc.).
- **Définir** les constantes (radius, seuils, etc.) dans un fichier de config unique.
- **Documenter** chaque étape de la chaîne pour faciliter la maintenance.

## Structure proposée

```
/ai/fsm/machineX/
  actions/
    core/
      droneActions.ts         // Toutes les actions drone (exploration, collecte, retour...)
      tileSelection.ts        // Fonctions de sélection de tuiles (exploration, collecte...)
    exploring.actions.ts      // Actions XState pour l’exploration (orchestration)
    collecting.actions.ts     // Actions XState pour la collecte
    ...
  config/
    constants.ts             // Toutes les constantes numériques/config
  context/
    initialContext.ts        // Contexte initial de la FSM
  ...
```

## Exemple de factorisation

- **Fonction générique de sélection de tuile** :
  ```ts
  export function selectTargetTile(context, radius, filterFn) {
    // Filtre les tuiles selon le filtre fourni (exploration, collecte, etc.)
    // Retourne la position cible ou null
  }
  ```
- **Actions drone** :
  ```ts
  export function deployDrone(context, event, type: 'exploration' | 'collecte') {
    // Utilise selectTargetTile avec le bon filtre
    // Met à jour le contexte du drone
  }
  ```
- **Actions XState** :
  - Appellent les fonctions génériques selon le type d’action.

## Avantages
- **Moins de duplication**
- **Plus facile à maintenir**
- **Ajout de nouveaux comportements (ex: collecte) très simple**

---

*Document généré par GitHub Copilot le 10/07/2025*
