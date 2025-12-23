/**
 * ==========================================================================
 * FSM LOGGER STUB - Pour tests Node.js sans dépendances
 * ==========================================================================
 * 
 * Version stub du logger pour permettre l'exécution des tests en terminal.
 * Remplace les fonctions de logging par des no-ops ou des console.log simples.
 * 
 * USAGE: Ce fichier est utilisé automatiquement par le système de test
 * en mode terminal pour éviter les dépendances au navigateur.
 */

const fsmLogger = {
  // Méthodes principales
  info: (...args) => {
    // Silencieux par défaut, décommenter pour debug:
    // console.log('[FSM INFO]', ...args);
  },
  
  warn: (...args) => {
    console.warn('[FSM WARN]', ...args);
  },
  
  error: (...args) => {
    console.error('[FSM ERROR]', ...args);
  },
  
  debug: (...args) => {
    // Silencieux par défaut, décommenter pour debug:
    // console.log('[FSM DEBUG]', ...args);
  },
  
  log: (...args) => {
    // Silencieux par défaut, décommenter pour debug:
    // console.log('[FSM LOG]', ...args);
  },
  
  // Méthodes spécifiques du logger FSM (si utilisées)
  logStateChange: () => {},
  logAction: () => {},
  logCondition: () => {},
  logEvent: () => {},
  logContext: () => {},
  logMouvement: () => {},
  logPlayer: () => {},
  logGame: () => {},
  logHistory: () => {},
  
  // Méthodes de gestion du logger
  enable: () => {},
  disable: () => {},
  setLevel: () => {},
  getHistory: () => [],
  clearHistory: () => {},
  exportLogs: () => '[]',
};

export default fsmLogger;
