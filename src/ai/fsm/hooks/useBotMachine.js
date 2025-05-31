/**
 * ============================================================================
 * HOOK USEBOTMACHINE - Interface React simplifiée pour la machine FSM Bot
 * ============================================================================
 * 
 * Ce hook fournit une interface simplifiée pour interagir avec un bot contrôlé
 * par une machine à états finis (FSM). Il encapsule la complexité du système FSM
 * et expose des méthodes faciles à comprendre pour contrôler le bot.
 * 
 * CONCEPTS CLÉS:
 * 1. Machine à états (FSM) - Système qui définit des comportements structurés
 * 2. État - La situation actuelle du bot (ex: exploration, collecte)
 * 3. Transitions - Comment le bot passe d'un état à un autre
 * 4. Événements - Déclencheurs qui peuvent causer des transitions
 * 5. Contexte - Données qui représentent l'état complet du bot
 * 
 * @author Migration FSM Phase 2
 * @version 2.0.0 - Version pédagogique simplifiée
 */

import { useEffect, useCallback, useRef } from 'react';
import { useMachine } from 'react-robot';
import { createEntityContext, ENTITY_TYPES, isAutonomous, canManualControl, getMainVehicle, isMoving } from '../machine/context/initialContext.js';
import { BOT_STATES } from '../machine/constants.js';
import { createBotMachine } from '../machine/machineFactory.js';

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook pour gérer un bot avec la machine FSM
 * 
 * @param {string} botId - ID unique du bot (ex: 'bot-0')
 * @param {string} entityType - Type d'entité (auto, manual, human)
 * @returns {Object} - Interface simplifiée pour contrôler le bot
 */
export const useBotMachine = (botId, entityType = ENTITY_TYPES.AUTO) => {
  
  // ========================================================================
  // ÉTAPE 1: INITIALISATION DE LA MACHINE À ÉTATS (FSM)
  // ========================================================================
  
  // Créer le contexte initial (les données de base du bot)
  const initialContext = createEntityContext(botId, entityType);
  
  // Créer la machine FSM pour ce bot spécifique
  const machine = createBotMachine(botId, initialContext);
  
  // Activer la machine FSM dans ce composant React avec useMachine
  // - current: contient l'état actuel et le contexte de la machine
  // - send: fonction pour envoyer des événements à la machine
  const [current, send] = useMachine(machine, initialContext);
  
  // Référence pour gérer l'intervalle du mode autonome
  const autoIntervalRef = useRef(null);
  
  // ========================================================================
  // ÉTAPE 2: EXTRACTION DES DONNÉES PRINCIPALES
  // ========================================================================
  
  // Extraire les données importantes du contexte actuel
  const entity = current.context;        // Toutes les données du bot
  const vehicle = getMainVehicle(entity); // Le véhicule principal du bot
  const state = current.context.currentState; // L'état FSM actuel (ex: "exploring")
  
  // ========================================================================
  // ÉTAPE 3: ACTIONS DISPONIBLES POUR CONTRÔLER LE BOT
  // ========================================================================
  
  /**
   * ACTIONS DE DÉPLACEMENT
   * 
   * Comment ça fonctionne: L'événement 'MOVE_TO' est envoyé à la FSM
   * qui décidera, selon l'état actuel du bot, si un mouvement est possible
   * et comment le réaliser.
   */
  const moveTo = useCallback((coord, position = null) => {
    // Créer l'objet représentant la cible
    const targetTile = { coord, position };
    
    // Envoyer l'événement MOVE_TO à la machine FSM
    send('MOVE_TO', { targetTile });
  }, [send]);

  /**
   * Arrête immédiatement le mouvement du bot
   */
  const stopMovement = useCallback(() => {
    // L'événement STOP sera géré différemment selon l'état actuel
    send('STOP');
  }, [send]);

  /**
   * ACTIONS DE COMPORTEMENT
   * 
   * Ces actions déclenchent des comportements complexes
   * qui impliquent potentiellement plusieurs états et transitions
   */
   
  /**
   * Lance l'exploration autonome de la carte
   */
  const startExploration = useCallback(() => {
    // Cet événement fera généralement passer le bot à l'état EXPLORING
    send('START_EXPLORING');
  }, [send]);

  /**
   * Lance la collecte de ressources connues
   */
  const startCollecting = useCallback(() => {
    // Cet événement fera généralement passer le bot à l'état COLLECTING
    send('START_COLLECTING');
  }, [send]);

  /**
   * Ordonne au bot de retourner à sa base
   */
  const returnToBase = useCallback(() => {
    // Cet événement fera généralement passer le bot à l'état RETURNING
    send('RETURN_TO_BASE');
  }, [send]);

  /**
   * ACTIONS DE CONTRÔLE
   */
   
  /**
   * [Retiré] Le basculement autonome/manuel n'est plus disponible
   * Les bots sont toujours autonomes
   */

  /**
   * Met à jour la progression du mouvement pendant un déplacement
   */
  const updateProgress = useCallback((progress) => {
    send('UPDATE_PROGRESS', { progress });
  }, [send]);

  /**
   * Force une transition vers un état spécifique (pour debug)
   */
  const forceState = useCallback((newState) => {
    // Vérifier que l'état demandé existe bien
    if (Object.values(BOT_STATES).includes(newState)) {
      send(newState);
    }
  }, [send]);

  // ========================================================================
  // ÉTAPE 4: FONCTIONS UTILITAIRES POUR VÉRIFIER L'ÉTAT DU BOT
  // ========================================================================
  
  /**
   * Vérifie si le bot fonctionne en mode autonome
   * 
   * En mode autonome, le bot prend ses propres décisions basées sur la FSM
   * sans intervention de l'utilisateur.
   */
  const isAutonomousMode = useCallback(() => {
    return isAutonomous(entity);
  }, [entity]);

  /**
   * Vérifie si ce bot peut être contrôlé manuellement
   * 
   * Certaines entités sont réservées au mode autonome uniquement.
   */
  const canManualControlMode = useCallback(() => {
    return canManualControl(entity);
  }, [entity]);

  /**
   * Vérifie si le bot est actuellement en mouvement
   */
  const isMovingState = useCallback(() => {
    return isMoving(entity);
  }, [entity]);

  /**
   * Récupère un résumé des métriques importantes du bot
   * 
   * Cette fonction extrait les données clés du contexte FSM complexe
   * et les présente dans un format simplifié plus facile à utiliser.
   */
  const getMetrics = useCallback(() => {
    return {
      // État FSM actuel
      state: state,
      
      // Ressources et santé
      fuel: vehicle?.fuel || 0,
      health: vehicle?.health || 100,
      resources: vehicle?.resources || { food: 0, debris: 0, special: 0 },
      
      // Position et mouvement
      position: vehicle?.coord || null,
      isMoving: isMoving(entity),
      
      // Mode de contrôle
      isAutonomous: isAutonomous(entity),
      
      // Informations de debug
      lastAction: entity.lastAction,
      error: entity.error,
      stateHistory: entity.memory?.stateHistory || [],
      uptime: Date.now() - (entity.timestamps?.stateChange || Date.now())
    };
  }, [state, vehicle, entity]);

  // ========================================================================
  // ÉTAPE 5: SYSTÈME D'ÉVÉNEMENTS AUTONOMES
  // ========================================================================
  
  /**
   * EXPLICATION:
   * En mode autonome, le bot doit régulièrement "réfléchir" et prendre des décisions.
   * Cette fonction configure un intervalle qui envoie périodiquement l'événement 'AUTO'
   * à la machine FSM, permettant des transitions automatiques basées sur l'état actuel.
   */
  
  /**
   * Active le système de prise de décision autonome
   * 
   * Démarre un intervalle qui envoie régulièrement l'événement 'AUTO'
   * à la machine FSM pour déclencher des transitions automatiques.
   */
  const startAutoEvents = useCallback(() => {
    // Ne rien faire si le bot n'est pas en mode autonome
    if (!isAutonomous(entity)) return;
    
    // Nettoyer tout intervalle existant
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
    }
    
    // Fréquence de prise de décision (configurable)
    const interval = entity.config?.explorationInterval || 3000;
    
    // Configurer l'intervalle de "réflexion" du bot
    autoIntervalRef.current = setInterval(() => {
      // L'événement 'AUTO' est interprété différemment selon l'état actuel
      send('AUTO');
    }, interval);
  }, [entity, send]);

  /**
   * Désactive le système de prise de décision autonome
   */
  const stopAutoEvents = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  // ========================================================================
  // ÉTAPE 6: GESTION DES EFFETS REACT
  // ========================================================================
  
  /**
   * Effet qui gère automatiquement le mode autonome
   * 
   * Démarre ou arrête le système de décision autonome
   * quand le mode autonome change.
   */
  useEffect(() => {
    // Si le bot est en mode autonome, activer les événements auto
    if (isAutonomous(entity)) {
      startAutoEvents();
    } else {
      // Sinon, arrêter les événements auto
      stopAutoEvents();
    }
    
    // Nettoyage en cas de changement de dépendances
    return stopAutoEvents;
  }, [entity.autonomousMode, startAutoEvents, stopAutoEvents]);
  
  /**
   * Effet de nettoyage quand le composant est démonté
   */
  useEffect(() => {
    // Assure que les intervalles sont nettoyés à la destruction
    return () => {
      stopAutoEvents();
    };
  }, [stopAutoEvents]);

  // ========================================================================
  // ÉTAPE 7: INTERFACE PUBLIQUE DU HOOK
  // ========================================================================
  
  /**
   * Retourne une interface simplifiée pour interagir avec le bot
   */
  return {
    // ----------------------------------------
    // DONNÉES PRINCIPALES
    // ----------------------------------------
    
    // Données brutes du bot
    entity,
    
    // Informations sur le véhicule principal
    vehicle,
    
    // État actuel du FSM (ex: "exploring", "collecting")
    state,
    
    // Alias pour compatibilité avec l'ancien système
    context: entity, 
    
    // ----------------------------------------
    // ACTIONS DE CONTRÔLE
    // ----------------------------------------
    actions: {
      // Actions de déplacement
      moveTo,           // Déplacer le bot vers une position
      stopMovement,     // Arrêter le mouvement
      
      // Actions de comportement
      startExploration, // Commencer l'exploration
      startCollecting,  // Collecter des ressources
      returnToBase,     // Retourner à la base
      
      updateProgress,   // Mettre à jour la progression du mouvement
      forceState        // Forcer un changement d'état (debug)
    },
    
    // ----------------------------------------
    // FONCTIONS UTILITAIRES
    // ----------------------------------------
    helpers: {
      isAutonomous: isAutonomousMode,       // Le bot est-il autonome?
      canManualControl: canManualControlMode, // Le bot peut-il être contrôlé manuellement?
      isMoving: isMovingState,              // Le bot est-il en mouvement?
      getMetrics                            // Récupérer les statistiques du bot
    },
    
    // ----------------------------------------
    // POUR LE DEBUG AVANCÉ
    // ----------------------------------------
    machine: {
      current,  // État actuel de la machine FSM
      send,     // Fonction pour envoyer des événements manuellement
      machine   // Définition de la machine FSM
    },
    
    // ----------------------------------------
    // GESTION DU MODE AUTONOME
    // ----------------------------------------
    autoEvents: {
      start: startAutoEvents,              // Démarrer le mode autonome
      stop: stopAutoEvents,                // Arrêter le mode autonome
      isActive: autoIntervalRef.current !== null  // Est-ce que le mode autonome est actif?
    }
  };
};

// ============================================================================
// EXPORT
// ============================================================================

/**
 * RÉSUMÉ:
 * 
 * Ce hook `useBotMachine` fournit une interface React pour contrôler un bot
 * basé sur une machine à états finis (FSM). Il permet:
 * 
 * 1. De contrôler les déplacements et comportements du bot
 * 2. De basculer entre modes autonome et manuel
 * 3. D'accéder à l'état actuel et aux métriques importantes
 * 4. De déboguer la machine FSM si nécessaire
 * 
 * Utilisation simple:
 *    const { actions, state, helpers } = useBotMachine('bot-1');
 *    // Pour déplacer le bot: actions.moveTo(coord);
 *    // Pour connaître l'état: state;
 *    // Pour les statistiques: helpers.getMetrics();
 */
export default useBotMachine;
