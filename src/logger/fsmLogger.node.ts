/**
 * ==========================================================================
 * FSM LOGGER - Version compatible Node.js & Browser
 * ==========================================================================
 * 
 * Détecte l'environnement et charge le logger approprié:
 * - Browser: logger complet avec styles console
 * - Node.js: stub simple pour tests
 */

// Détection de l'environnement
const isNode = typeof process !== 'undefined' && 
               process.versions != null && 
               process.versions.node != null;

// Export conditionnel
let fsmLogger;

if (isNode) {
  // En Node.js, utiliser le stub
  fsmLogger = {
    info: () => {},
    warn: (...args) => console.warn('[FSM WARN]', ...args),
    error: (...args) => console.error('[FSM ERROR]', ...args),
    debug: () => {},
    log: () => {},
    logStateChange: () => {},
    logAction: () => {},
    logCondition: () => {},
    logEvent: () => {},
    logContext: () => {},
    logMouvement: () => {},
    logPlayer: () => {},
    logGame: () => {},
    logHistory: () => {},
    enable: () => {},
    disable: () => {},
    setLevel: () => {},
    getHistory: () => [],
    clearHistory: () => {},
    exportLogs: () => '[]',
  };
} else {
  // En browser, importer le vrai logger
  // Note: Ceci ne sera jamais exécuté en Node.js donc pas de problème d'import
  const { default: browserLogger } = await import('./fsmLogger.ts');
  fsmLogger = browserLogger;
}

export default fsmLogger;
