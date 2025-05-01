import { create } from 'zustand'; // Zustand est une bibliothèque de gestion d'état légère
import usePlayerStore from './usePlayerStore'; // Store pour gérer les joueurs
import { useTileStore } from './useNewTileStore'; // Store pour gérer les tuiles du jeu

/**
 * ARCHITECTURE DU BOT:
 * 
 * Ce store implémente une séparation stricte entre:
 * 1. LA PRISE DE DÉCISION (planActions, ex-makeDecision): détermine quoi faire et ajoute à la file d'actions
 *    - Ne doit JAMAIS exécuter directement des actions sur le playerStore
 *    - Utilise uniquement: queueAction(), changeState(), updateMemory()
 * 
 * 2. L'EXÉCUTION (executeAction, ex-executeNextAction): exécute les actions de la file
 *    - Seul endroit où les méthodes du playerStore sont appelées
 * 
 * WORKFLOW: planActions → queueAction → executeAction → playerStore
 */

// Bot states - Définit les états possibles du bot
const BOT_STATES = {
  IDLE: 'idle',           // En attente
  EXPLORING: 'exploring', // Exploration de la carte
  COLLECTING: 'collecting', // Collecte de ressources
  RETURNING: 'returning', // Retour à la base
  AVOIDING: 'avoiding',   // Évitement de danger
  REPAIRING: 'repairing', // Réparation du véhicule
  REFUELING: 'refueling', // Rechargement du carburant
};

// Bot priority levels - Pour définir l'importance des actions
const PRIORITY = {
  LOW: 1,      // Priorité basse
  MEDIUM: 2,   // Priorité moyenne
  HIGH: 3,     // Priorité haute
  CRITICAL: 4, // Priorité critique
};

// Création du store avec Zustand
const useBotStore = create((set, get) => ({
  // Bot state configuration - Structure initiale des données du bot
  bots: {
    player2: { // Identifiant du joueur bot
      ship: {  // Identifiant du véhicule
        currentState: BOT_STATES.IDLE, // État actuel
        previousState: null, // État précédent (pour gérer les transitions)
        memory: { // Mémoire du bot pour stocker des informations sur l'environnement
          exploredTiles: [],  // Tiles déjà explorées
          knownResources: [], // Ressources identifiées
          knownDangers: [],   // Dangers identifiés
          availableMoves: [], // Mouvements possibles
        },
        actionQueue: [], // File d'actions à exécuter
        lastActionTime: 0, // Timestamp de la dernière action (pour le cooldown)
      },
    },
  },
  
  isRunning: false, // Indicateur si le bot est actif
  
  // Initialize bot with game data - Initialisation du bot au démarrage du jeu
  initializeBot: () => {
    set((state) => ({
      bots: {
        ...state.bots,
        player2: {
          ...state.bots.player2,
          ship: {
            ...state.bots.player2.ship,
            currentState: BOT_STATES.EXPLORING, // Démarrer en mode exploration
            lastActionTime: Date.now(),
          },
        },
      },
      isRunning: true, // Activer le bot
    }));
  },

  // Change bot state with transition logic - Gestion des transitions d'état
  changeState: (playerId, vehicleId, newState) => {
    set((state) => {
      const botVehicle = state.bots[playerId]?.[vehicleId];
      if (!botVehicle) return state; // Sécurité si le bot n'existe pas

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              previousState: botVehicle.currentState, // Sauvegarde l'état précédent
              currentState: newState, // Définit le nouvel état
            },
          },
        },
      };
    });
  },

  // Add action to the bot's queue - Ajoute une action à la file d'attente
  queueAction: (playerId, vehicleId, action) => {
    set((state) => {
      const botVehicle = state.bots[playerId]?.[vehicleId];
      if (!botVehicle) return state; // Vérification de sécurité

      // Ajoute l'action à la file avec un timestamp
      const updatedQueue = [...botVehicle.actionQueue, {
        ...action,
        timestamp: Date.now(), // Horodatage pour suivi et gestion de timeouts
      }];

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: updatedQueue, // Met à jour la file d'actions
            },
          },
        },
      };
    });
    
    // Log pour le débogage
    console.log(`Action ajoutée à la file pour ${playerId}/${vehicleId}:`, action.type);
  },

  // Clear action queue
  clearActionQueue: (playerId, vehicleId) => {
    set((state) => {
      const botVehicle = state.bots[playerId]?.[vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: [],
            },
          },
        },
      };
    });
  },

  // Execute the next action in queue - Exécute l'action suivante avec gestion du cooldown
  executeAction: (playerId, vehicleId) => {
    const botVehicle = get().bots[playerId]?.[vehicleId];
    if (!botVehicle || botVehicle.actionQueue.length === 0) return false; // Vérifie si une action est disponible

    // Système de cooldown pour éviter les actions trop rapides
    const now = Date.now();
    const cooldownTime = 1000; // 1 seconde entre chaque action
    if (now - botVehicle.lastActionTime < cooldownTime) {
      return false; // Encore en cooldown, ne fait rien
    }

    const nextAction = botVehicle.actionQueue[0]; // Prend la première action de la file
    const playerStore = usePlayerStore.getState(); // Accède au store joueur pour exécuter l'action
    
    console.log(`Exécution de l'action ${nextAction.type} pour ${playerId}/${vehicleId}`);
    
    let actionSucceeded = true; // Par défaut, on suppose que l'action réussira
    
    // Switch qui détermine quelle méthode du playerStore appeler selon le type d'action
    try {
      switch (nextAction.type) {
        case 'move': // Déplacement vers une tuile
          playerStore.moveToTile(playerId, vehicleId, nextAction.targetTile);
          break;
        case 'collect': // Collecte de ressources
          playerStore.collectResources(playerId, vehicleId, nextAction.tile);
          break;
        case 'repair': // Réparation du véhicule
          playerStore.repairVehicle(playerId, vehicleId);
          break;
        case 'refuel': // Rechargement du carburant
          playerStore.refuelVehicle(playerId, vehicleId);
          break;
        case 'transferResources': // Transfert des ressources à la base
          playerStore.transferResourcesToScore(playerId, vehicleId);
          break;
        default:
          console.warn(`Unknown action type: ${nextAction.type}`);
          actionSucceeded = false;
          break;
      }
    } catch (error) {
      // Gestion des erreurs lors de l'exécution
      console.error(`Erreur lors de l'exécution de l'action ${nextAction.type}:`, error);
      actionSucceeded = false;
    }

    // Remove executed action from queue and update last action time
    set((state) => {
      const botVehicle = state.bots[playerId]?.[vehicleId];
      if (!botVehicle) return state;
      
      // Si action en échec et tentatives max non dépassées
      if (!actionSucceeded && nextAction.retries < 3) {
        return {
          bots: {
            ...state.bots,
            [playerId]: {
              ...state.bots[playerId],
              [vehicleId]: {
                ...botVehicle,
                actionQueue: [
                  {...nextAction, retries: (nextAction.retries || 0) + 1},
                  ...botVehicle.actionQueue.slice(1)
                ],
                lastActionTime: now,
              },
            },
          },
        };
      }
      
      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: botVehicle.actionQueue.slice(1),
              lastActionTime: now,
              // Si action échouée même après tentatives, marquer pour replanification
              needsReplanning: !actionSucceeded
            },
          },
        },
      };
    });

    return actionSucceeded;
  },

 
  // Update memory with new information
  updateMemory: (playerId, vehicleId, memoryUpdates) => {
    set((state) => {
      const botVehicle = state.bots[playerId]?.[vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              memory: {
                ...botVehicle.memory,
                ...memoryUpdates,
              },
            },
          },
        },
      };
    });
  },

  // REFACTORISÉ: Planifier des actions basées sur l'état actuel et l'environnement
  planActions: (playerId, vehicleId) => {
    // Récupère l'état actuel du bot et du véhicule
    const botVehicle = get().bots[playerId]?.[vehicleId];
    const playerStore = usePlayerStore.getState();
    const vehicle = playerStore.players[playerId]?.vehicles?.[vehicleId];

    if (!botVehicle || !vehicle) {
      console.log("Données du bot ou du véhicule manquantes dans planActions");
      return;
    }

    console.log(`Bot ${playerId}/${vehicleId} planifie des actions dans l'état : ${botVehicle.currentState}`);

    // RÈGLE D'URGENCE: Vérifier capacité max -> passer en mode RETURNING
    if (vehicle.isAtCapacity && botVehicle.currentState !== BOT_STATES.RETURNING) {
      console.log(`Bot ${playerId}/${vehicleId} détecte capacité max et passe en mode RETURNING`);
      get().changeState(playerId, vehicleId, BOT_STATES.RETURNING);
      
      // Ajout d'une action de retour à la base
      get().queueAction(playerId, vehicleId, {
        type: 'move',
        targetTile: {
          position: vehicle.startPosition,
          coord: vehicle.startCoord
        }
      });
      return;
    }

    // Machine à états: comportement différent selon l'état actuel du bot
    switch (botVehicle.currentState) {
      case BOT_STATES.IDLE: // État d'attente
        // Passe en mode exploration
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        // Planifie un mouvement aléatoire pour commencer
        get().queueRandomMoveAction(playerId, vehicleId);
        break;

      case BOT_STATES.EXPLORING: // État d'exploration
        // Vérifie si le bot est immobile avant de planifier
        if (!vehicle.isMoving) {
          // Cherche des ressources à proximité - Utilise directement tileStore
          const nearbyResources = useTileStore.getState().analyzeResourcesNearPosition(vehicle, 3);
          
          if (nearbyResources.length > 0) {
            // Si des ressources sont trouvées, passe en mode collecte
            const targetResource = nearbyResources[0]; // Prend la plus proche
            get().changeState(playerId, vehicleId, BOT_STATES.COLLECTING);
            
            // Planifie d'abord le déplacement vers la ressource
            get().queueAction(playerId, vehicleId, {
              type: 'move',
              targetTile: {
                position: targetResource.position,
                coord: targetResource.coord
              }
            });
            
            // Puis planifie la collecte une fois arrivé
            get().queueAction(playerId, vehicleId, {
              type: 'collect',
              tile: {
                position: targetResource.position,
                coord: targetResource.coord
              }
            });
          } else {
            // Si aucune ressource n'est trouvée, continue l'exploration
            get().queueRandomMoveAction(playerId, vehicleId);
          }
        }
        break;

      case BOT_STATES.COLLECTING:
        // Ici on ne fait rien car les actions de collecte sont déjà dans la file
        // Une fois la collecte terminée, l'action sera exécutée automatiquement
        if (!vehicle.isMoving && botVehicle.actionQueue.length === 0) {
          // Si nous sommes en état de collecte mais sans actions et sans mouvement,
          // retour à l'exploration sans appel récursif
          get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
          
          // Marquer qu'une nouvelle planification est nécessaire
          set((state) => ({
            bots: {
              ...state.bots,
              [playerId]: {
                ...state.bots[playerId],
                [vehicleId]: {
                  ...state.bots[playerId][vehicleId],
                  needsReplanning: true
                }
              }
            }
          }));
        }
        break;

      case BOT_STATES.RETURNING:
        // Vérifier si arrivé à la base
        if (vehicle.coord === vehicle.startCoord && !vehicle.isMoving) {
          // Si à la base, transférer les ressources
          get().queueAction(playerId, vehicleId, {
            type: 'transferResources'
          });
          
          // Puis prévoir de revenir à l'exploration
          get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        } else if (!vehicle.isMoving && botVehicle.actionQueue.length === 0) {
          // Si arrêté mais pas à la base, planifier le retour
          get().queueAction(playerId, vehicleId, {
            type: 'move',
            targetTile: {
              position: vehicle.startPosition,
              coord: vehicle.startCoord
            }
          });
        }
        break;
        
      case BOT_STATES.AVOIDING:
        // À implémenter plus tard
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        break;
        
      case BOT_STATES.REPAIRING:
        // À implémenter plus tard
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        break;
        
      case BOT_STATES.REFUELING:
        // À implémenter plus tard
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        break;
        
      default:
        // État inconnu, revenir à l'exploration
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
    }
  },

  // Helper: Queue a random move action
  queueRandomMoveAction: (playerId, vehicleId) => {
    const randomTile = useTileStore.getState().selectRandomWalkableTile();
    if (!randomTile) {
      console.warn("Pas de tuile walkable disponible pour le déplacement aléatoire");
      return false;
    }

    console.log(`Bot ${playerId}/${vehicleId} planifie un déplacement vers:`, randomTile.coord);

    get().queueAction(playerId, vehicleId, {
      type: 'move',
      targetTile: {
        position: randomTile.position,
        coord: randomTile.coord
      }
    });

    return true;
  },

  // Process bot in real-time - Fonction appelée à intervalles réguliers
  processBot: () => {
    if (!get().isRunning) return; // Ne fait rien si le bot est désactivé
    
    const playerId = 'player2';
    const vehicleId = 'ship';
    
    const bot = get().bots[playerId]?.[vehicleId];
    if (!bot) return;
    
    // Stratégie: planifier de nouvelles actions si la file est vide
    if (bot.actionQueue.length === 0) {
      get().planActions(playerId, vehicleId);
    }
    
    // Tente d'exécuter l'action suivante (avec gestion du cooldown interne)
    get().executeAction(playerId, vehicleId);
  },
  
  // Start/stop bot processing - Activer/désactiver le bot
  toggleBotProcessing: () => {
    set(state => ({ isRunning: !state.isRunning }));
  }
}));

// Suppression des méthodes redondantes (intégrées dans les nouveaux workflows)
// - moveToRandomTile (remplacée par queueRandomMoveAction)
// - collectNearbyResources (intégrée directement dans planActions)

export default useBotStore;

