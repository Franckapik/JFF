// src/ai/fsm/actions/botActions.js
// Ce fichier centralise les actions que le bot peut exécuter dans la FSM

/* Liste des actions du bot:
 * 
 * evaluateConditionsFromIdle - Évalue les conditions depuis l'état IDLE pour déterminer l'action suivante
 * moveToRandomTile - Déplace le vaisseau du bot vers une tuile aléatoire
 * returnToBase - Déplace le vaisseau vers sa base/tuile de départ
 * refuelAtBase - Fait le plein de carburant et transfère les ressources au score à la base
 * exploreWithDrone - Envoie le drone explorer une tuile non découverte à proximité
 * moveToResourceAction - Déplace le vaisseau vers la meilleure ressource connue
 * collectResourceAction - Collecte la ressource une fois arrivé à la tuile cible
 */

import { evaluateConditionsFromIdleAction } from './individual/evaluateConditionsFromIdleAction';
import { moveToRandomTileAction } from './individual/moveToRandomTileAction';
import { returnToBaseAction } from './individual/returnToBaseAction';
import { refuelAtBaseAction } from './individual/refuelAtBaseAction';
import { exploreWithDroneAction } from './individual/exploreWithDroneAction';
import { moveToResourceAction } from './individual/moveToResourceAction';
import { collectResourceAction } from './individual/collectResourceAction';

/**
 * Registre des actions du bot
 * Chaque fonction prend le store du joueur et le store des tuiles
 * et effectue une action spécifique
 */
export const BotActions = {
  // Actions individuelles importées
  evaluateConditionsFromIdle: evaluateConditionsFromIdleAction,
  moveToRandomTile: moveToRandomTileAction,
  returnToBase: returnToBaseAction,
  refuelAtBase: refuelAtBaseAction,
  explorerWithDrone: exploreWithDroneAction,
  moveToResourceAction: moveToResourceAction,
  collectResourceAction: collectResourceAction,
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    'evaluateIdle': 'evaluateConditionsFromIdle',
    'collect': 'moveToResourceAction',          // Redirigé vers la nouvelle action
    'moveToResource': 'moveToResourceAction',   // Nouvelle action de déplacement vers ressource
    'collectResource': 'collectResourceAction', // Nouvelle action de collecte de ressource
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase',
    'exploreDrone': 'explorerWithDrone',
    'moveToRandomTile': 'moveToRandomTile'
  }
}