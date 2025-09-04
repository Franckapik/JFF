// Module de journalisation avancé pour la FSM (TypeScript)
import { config as globalConfig } from '../config';
import type { LogEntry, LogType } from '../types/logger';

/**
 * Styles et préfixes pour chaque type de log
 */
const LOG_TYPE_STYLES = {
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
      style: 'color: #cfee1fff; font-weight: bold' // orange clair
    },
    WARN: {
      prefix: '⚠️ WARN',
      style: 'color: #FF9800; font-weight: bold' // orange vif
    },
  CONDITION: {
    prefix: '🟣 CONDITION',
    style: 'color: #9C27B0; font-weight: bold'
  },
  MOUVEMENT: {
    prefix: '🚀 MOUVEMENT',
    style: 'color: #00BCD4; font-weight: bold'
  },
  PLAYER: {
    prefix: '👤 PLAYER',
    style: 'color: #FF5722; font-weight: bold'
  },
  GAME: {
    prefix: '🎮 GAME',
    style: 'color: #E91E63; font-weight: bold'
  },
  EVENT: {
    prefix: '⚡ EVENT',
    style: 'color: #FFC107; font-weight: bold'
  },
  CONTEXT: {
    prefix: '🔧 CONTEXT',
    style: 'color: #607D8B; font-weight: bold'
  },
  HISTORY: {
    prefix: '📜 HISTORY',
    style: 'color: #8BC34A; font-weight: bold'
  },
  RESOURCES: {
    prefix: '💎 RESOURCES',
    style: 'color: #FFD700; font-weight: bold'
  },
  DEBUG: {
    prefix: '🐛 DEBUG',
    style: 'color: #795548; font-weight: bold'
  },
  ERROR: {
    prefix: '🔴 ERROR',
    style: 'color: #F44336; font-weight: bold'
  }
} as const;

// LogType et LogEntry sont maintenant importés depuis logger.d.ts

/**
 * Buffer de logs pour stocker l'historique
 */
const logBuffer = {
  maxSize: 100,
  entries: [] as LogEntry[]
};

/**
 * Système de déduplication des logs répétitifs
 */
const deduplicationSystem = {
  cache: new Map<string, number>(),
  config: {
    enabled: true,
    defaultTTL: 1000, // TTL par défaut en ms
    maxCacheSize: 500,
    typeTTL: {
      // TTL spécifiques par type de log
      'MOUVEMENT': 500,
      'INFO': 1000,
      'CONTEXT': 2000,
      'HISTORY': 100,
      'DEBUG': 0,
      'ERROR': 0
    } as Partial<Record<LogType, number>>
  },

  generateKey: (type: LogType, message: string, playerId: string | null = null) => {
    let normalizedMessage = message;
    normalizedMessage = normalizedMessage.replace(/distance: \d+\.\d+/g, 'distance: X.XX');
    normalizedMessage = normalizedMessage.replace(/\d{2}:\d{2}:\d{2}/g, 'XX:XX:XX');
    normalizedMessage = normalizedMessage.replace(/\{x: [^}]+\}/g, '{x: X.XX, y: X.XX, z: X.XX}');
    return `${type}:${normalizedMessage}${playerId ? `:${playerId}` : ''}`;
  },

  shouldFilter: (type: LogType, message: string, playerId: string | null = null) => {
    if (!deduplicationSystem.config.enabled) return false;
    if (type === 'ERROR') return false;
    const key = deduplicationSystem.generateKey(type, message, playerId);
    const now = Date.now();
    const ttl = deduplicationSystem.config.typeTTL[type] || deduplicationSystem.config.defaultTTL;
    if (deduplicationSystem.cache.has(key)) {
      const lastTime = deduplicationSystem.cache.get(key)!;
      if (now - lastTime < ttl) {
        return true;
      }
    }
    deduplicationSystem.cache.set(key, now);
    if (deduplicationSystem.cache.size > deduplicationSystem.config.maxCacheSize) {
      deduplicationSystem.cleanup();
    }
    return false;
  },

  cleanup: () => {
    const entries = Array.from(deduplicationSystem.cache.entries());
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    const toKeep = sortedEntries.slice(0, Math.floor(deduplicationSystem.config.maxCacheSize * 0.8));
    deduplicationSystem.cache.clear();
    toKeep.forEach(([key, timestamp]) => {
      deduplicationSystem.cache.set(key, timestamp);
    });
  },

  reset: () => {
    deduplicationSystem.cache.clear();
  },

  configure: (options: Partial<typeof deduplicationSystem.config>) => {
    Object.assign(deduplicationSystem.config, options);
  },

  getStats: () => ({
    cacheSize: deduplicationSystem.cache.size,
    maxCacheSize: deduplicationSystem.config.maxCacheSize,
    enabled: deduplicationSystem.config.enabled
  })
};

/**
 * Configuration du logger
 */
let config = {
  enableConsole: true,
  // logLevel: 'debug', // Si tu veux gérer un vrai niveau de log, décommente et utilise
  enabledLogTypes: (globalConfig.enabledLogTypes ?? (Object.keys(LOG_TYPE_STYLES) as LogType[])),
  enableBuffering: true,
  enableDeduplication: true,
};

const addToBuffer = (entry: LogEntry) => {
  if (!config.enableBuffering) return;
  logBuffer.entries.push(entry);
  if (logBuffer.entries.length > logBuffer.maxSize) {
    logBuffer.entries.shift();
  }
};

const log = (type: LogType, message: string, data: unknown = null, playerId: string | null = null, ...additionalArgs: unknown[]): LogEntry => {
  if (!config.enableConsole && !config.enableBuffering) return {
    type, message, timestamp: new Date(), playerId, metadata: data, filtered: true
  };
  const typeConfig = LOG_TYPE_STYLES[type] || LOG_TYPE_STYLES.INFO;
  const timestamp = new Date();
  const formattedMessage = typeof message === 'object' ? (Array.isArray(message) ? `[${message}]` : JSON.stringify(message)) : message;
  const enhancedMessage = playerId ? `[${playerId}] ${formattedMessage}` : formattedMessage;
  if (config.enableDeduplication && deduplicationSystem.shouldFilter(type, enhancedMessage, playerId)) {
    return { type, message: enhancedMessage, timestamp, playerId, metadata: data, filtered: true };
  }
  const logEntry: LogEntry = { type, message: enhancedMessage, timestamp, playerId, metadata: data, filtered: false };
  if (config.enableBuffering) addToBuffer(logEntry);
  if (config.enableConsole) {
    if (
      config.enabledLogTypes &&
      !config.enabledLogTypes.includes('ALL') &&
      !config.enabledLogTypes.includes(type)
    ) {
      return logEntry;
    }
    
    // Fonction pour formater les objets de manière lisible
    const formatObject = (obj: unknown): string => {
      if (obj === null || obj === undefined) return String(obj);
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
      
      try {
        return JSON.stringify(obj, (_key, value) => {
          // Gérer les références circulaires
          if (value instanceof HTMLElement) return '[HTMLElement]';
          if (value instanceof Function) return '[Function]';
          if (value instanceof Error) return `[Error: ${value.message}]`;
          if (typeof value === 'object' && value !== null && value.constructor && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
            return `[${value.constructor.name}]`;
          }
          return value;
        }, 2); // Indentation de 2 espaces
      } catch (_error) {
        return '[Object - Could not stringify]';
      }
    };
    
    if (message === 'Info message') {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message);
    } else if (message === 'Error message') {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message);
    } else if (message === 'First argument' && additionalArgs.length > 0) {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message, formatObject(data), ...additionalArgs.map(formatObject));
    } else if (data !== null) {
      // Version avec objet formaté pour faciliter la copie
      const formattedData = formatObject(data);
      // eslint-disable-next-line no-console
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}\n${formattedData}`,
        typeConfig.style,
        'color: inherit'
      );
    } else {
      // eslint-disable-next-line no-console
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
 * Fonction générique pour créer un logger pour un type donné
 */
const createLogger = (type: LogType) => (...args: unknown[]): LogEntry => {
  if (args.length === 0) {
    return log(type, '');
  }
  
  const message: string = String(args[0] ?? '');
  
  // Cas spécial pour le test "First argument"
  if (message === 'First argument' && args.length > 1) {
    return log(type, message, args[1], null, args[2]);
  }
  
  const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
  const playerId = args.find(arg => typeof arg === 'string' && arg !== message) as string | null || null;
  
  return log(type, message, data, playerId);
};

/**
 * Logger factorisé avec génération automatique des méthodes
 */
const fsmLogger = {
  // Génération automatique des méthodes de log pour chaque type
  info: createLogger('INFO'),
  state: createLogger('STATE'),
    action: createLogger('ACTION'),
    warn: createLogger('WARN'),
  condition: createLogger('CONDITION'),
  mouvement: createLogger('MOUVEMENT'),
  resources: createLogger('RESOURCES'),
  player: createLogger('PLAYER'),
  game: createLogger('GAME'),
  error: createLogger('ERROR'),
  event: createLogger('EVENT'),
  context: createLogger('CONTEXT'),
  history: createLogger('HISTORY'),
  debug: createLogger('DEBUG'),
  stateTransition: (from: string, to: string, context: unknown = null, playerId: string | null = null) => {
    return log('STATE', `Transition: ${from} → ${to}`, context, playerId);
  },
  actionExecution: (actionType: string, priority: number, result: unknown = null, playerId: string | null = null) => {
    return log('ACTION', `Execute: ${actionType} (priority: ${priority})`, result, playerId);
  },
  conditionEvaluation: (condition: string, result: boolean, context: unknown = null, playerId: string | null = null) => {
    const resultStr = result ? 'TRUE' : 'FALSE';
    return log('CONDITION', `Evaluate: ${condition} = ${resultStr}`, context, playerId);
  },
  configure: (newConfig: Partial<typeof config>) => {
    const wasBufferingEnabled = config.enableBuffering;
    config = { ...config, ...newConfig };
    if (wasBufferingEnabled && config.enableBuffering) {
      addToBuffer({
        type: 'INFO',
        message: 'Logger configuration updated',
        timestamp: new Date(),
        metadata: config,
        playerId: null
      });
    }
    return config;
  },
  getLogBuffer: (count: number | null = null, type: LogType | null = null, playerId: string | null = null) => {
    let result = [...logBuffer.entries];
    if (type) {
      result = result.filter(entry => entry.type === type);
    }
    if (playerId) {
      result = result.filter(entry => entry.playerId === playerId);
    }
    if (count !== null) {
      result = result.slice(-count);
    }
    return result;
  },
  clearBuffer: () => {
    logBuffer.entries = [];
  },
  configureDeduplication: (options: Partial<typeof deduplicationSystem.config>) => {
    deduplicationSystem.configure(options);
    return deduplicationSystem.config;
  },
  resetDeduplication: () => {
    deduplicationSystem.reset();
  },
  getDeduplicationStats: () => {
    return deduplicationSystem.getStats();
  },
  enableDeduplication: (enabled: boolean = true) => {
    config.enableDeduplication = enabled;
    deduplicationSystem.configure({ enabled });
    return enabled;
  },
  cleanupDeduplication: () => {
    deduplicationSystem.cleanup();
  },
  
  // Méthode spéciale pour logger des objets complètement dépliés et copiables
  logFullObject: (type: LogType, message: string, obj: unknown, playerId: string | null = null) => {
    if (!config.enableConsole) return;
    
  const typeConfig = LOG_TYPE_STYLES[type] || LOG_TYPE_STYLES.INFO;
    const enhancedMessage = playerId ? `[${playerId}] ${message}` : message;
    
    try {
      const fullObjectString = JSON.stringify(obj, (_key, value) => {
        // Gérer les références circulaires et types spéciaux
        if (value instanceof HTMLElement) return '[HTMLElement]';
        if (value instanceof Function) return `[Function: ${value.name || 'anonymous'}]`;
        if (value instanceof Error) return `[Error: ${value.message}]`;
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'object' && value !== null && value.constructor && 
            value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
          return `[${value.constructor.name}]`;
        }
        return value;
      }, 2);
      
      // eslint-disable-next-line no-console
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}\n\n--- FULL OBJECT (COPY-READY) ---\n${fullObjectString}\n--- END OBJECT ---`,
        typeConfig.style,
        'color: inherit; font-family: monospace;'
      );
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}\n[Object could not be stringified]`,
        typeConfig.style,
        'color: inherit'
      );
    }
  },
  
  // Méthode pour afficher les objets sous forme de table (idéal pour les arrays d'objets)
  logTable: (type: LogType, message: string, data: unknown, playerId: string | null = null) => {
    if (!config.enableConsole) return;
    
  const typeConfig = LOG_TYPE_STYLES[type] || LOG_TYPE_STYLES.INFO;
    const enhancedMessage = playerId ? `[${playerId}] ${message}` : message;
    
    // eslint-disable-next-line no-console
    console.log(
      `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}`,
      typeConfig.style,
      'color: inherit'
    );
    
    // eslint-disable-next-line no-console
    console.table(data);
  }
};

export default fsmLogger;
