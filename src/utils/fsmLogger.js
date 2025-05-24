// src/utils/fsmLogger.js
// Module de journalisation avancé pour la FSM

/**
 * Classes de log avec couleurs pour la console
 */
const LOG_LEVEL = {
  INFO: {
    prefix: '🔵 INFO',
    style: 'color: #2196F3; font-weight: bold'
  },
  STATE: {
    prefix: '🟢 STATE',
    style: 'color: #4CAF50; font-weight: bold'
  },
  ACTION: {
    prefix: '🟠 ACTION',
    style: 'color: #FF9800; font-weight: bold'
  },
  CONDITION: {
    prefix: '🟣 CONDITION',
    style: 'color: #9C27B0; font-weight: bold'
  },
  MOUVEMENT: {
    prefix: '🚀 MOUVEMENT',
    style: 'color: #00BCD4; font-weight: bold'
  },
  ERROR: {
    prefix: '🔴 ERROR',
    style: 'color: #F44336; font-weight: bold'
  }
};

/**
 * Buffer de logs pour stocker l'historique
 */
const logBuffer = {
  maxSize: 100,
  entries: []
};

/**
 * Configuration du logger
 */
let config = {
  enableConsole: true, // Activé pour voir les logs dans la console
  minLevel: 0, // Niveau minimum pour afficher un log
  enableBuffering: true, // Activer/désactiver le stockage des logs dans le buffer
};

/**
 * Ajoute une entrée au buffer de logs
 * @param {Object} entry - Entrée de log
 */
const addToBuffer = (entry) => {
  if (!config.enableBuffering) return;
  
  logBuffer.entries.push(entry);
  
  // Limite la taille du buffer
  if (logBuffer.entries.length > logBuffer.maxSize) {
    logBuffer.entries.shift();
  }
};

/**
 * Fonction principale de journalisation
 * @param {string} type - Type de log (STATE, ACTION, CONDITION, etc.)
 * @param {string} message - Message à journaliser
 * @param {Object} data - Données supplémentaires
 * @param {string} playerId - ID du joueur/bot concerné (optionnel)
 */
const log = (type, message, data = null, playerId = null) => {
  if (!config.enableConsole && !config.enableBuffering) return;
  
  const typeConfig = LOG_LEVEL[type] || LOG_LEVEL.INFO;
  const timestamp = new Date().toISOString();
  
  // Modifier le message pour inclure l'ID du joueur/bot si fourni
  const enhancedMessage = playerId ? `[${playerId}] ${message}` : message;
  
  // Créer l'entrée de log
  const logEntry = {
    type,
    message: enhancedMessage,
    data,
    timestamp,
    playerId // Stocker l'ID du joueur/bot pour référence
  };
  
  // Ajouter au buffer si activé
  addToBuffer(logEntry);
  
  // Afficher dans la console si activé
  if (config.enableConsole) {
    // Modification: n'afficher le paramètre data que s'il n'est pas null
    if (data !== null) {
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}`,
        typeConfig.style,
        'color: inherit',
        data
      );
    } else {
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}`,
        typeConfig.style,
        'color: inherit'
      );
    }
  }
  
  return logEntry;
};

/**
 * Fonctions spécifiques pour chaque type de log
 */
const fsmLogger = {
  info: (message, data = null, playerId = null) => log('INFO', message, data, playerId),
  state: (message, data = null, playerId = null) => log('STATE', message, data, playerId),
  action: (message, data = null, playerId = null) => log('ACTION', message, data, playerId),
  condition: (message, data = null, playerId = null) => log('CONDITION', message, data, playerId),
  mouvement: (message, data = null, playerId = null) => log('MOUVEMENT', message, data, playerId),
  error: (message, data = null, playerId = null) => log('ERROR', message, data, playerId),
  
  /**
   * Enregistre une transition d'état
   * @param {string} from - État de départ
   * @param {string} to - État d'arrivée
   * @param {Object} context - Contexte de la transition
   * @param {string} playerId - ID du joueur/bot concerné
   */
  stateTransition: (from, to, context = null, playerId = null) => {
    return log('STATE', `Transition: ${from} → ${to}`, context, playerId);
  },
  
  /**
   * Enregistre l'exécution d'une action
   * @param {string} actionType - Type d'action
   * @param {number} priority - Priorité de l'action
   * @param {Object} result - Résultat de l'action
   * @param {string} playerId - ID du joueur/bot concerné
   */
  actionExecution: (actionType, priority, result = null, playerId = null) => {
    return log('ACTION', `Execute: ${actionType} (priority: ${priority})`, result, playerId);
  },
  
  /**
   * Enregistre l'évaluation d'une condition
   * @param {string} condition - Nom de la condition
   * @param {boolean} result - Résultat de l'évaluation
   * @param {Object} context - Contexte de l'évaluation
   * @param {string} playerId - ID du joueur/bot concerné
   */
  conditionEvaluation: (condition, result, context = null, playerId = null) => {
    const resultStr = result ? 'TRUE' : 'FALSE';
    return log('CONDITION', `Evaluate: ${condition} = ${resultStr}`, context, playerId);
  },
  
  /**
   * Configure le logger
   * @param {Object} newConfig - Nouvelle configuration
   */
  configure: (newConfig) => {
    config = { ...config, ...newConfig };
    log('INFO', `Logger configuration updated`, config);
    return config;
  },
  
  /**
   * Récupère le buffer de logs
   * @param {number} count - Nombre d'entrées à récupérer (par défaut: toutes)
   * @param {string} type - Filtrer par type (optionnel)
   * @returns {Array} - Entrées de log
   */
  getLogBuffer: (count = null, type = null) => {
    let result = [...logBuffer.entries];
    
    // Filtrer par type si spécifié
    if (type) {
      result = result.filter(entry => entry.type === type);
    }
    
    // Limiter le nombre d'entrées si spécifié
    if (count !== null) {
      result = result.slice(-count);
    }
    
    return result;
  },
  
  /**
   * Efface le buffer de logs
   */
  clearBuffer: () => {
    logBuffer.entries = [];
    log('INFO', 'Log buffer cleared');
  }
};

export default fsmLogger;