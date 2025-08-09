// Module de journalisation avancé pour la FSM (TypeScript)

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

type LogType = keyof typeof LOG_LEVEL;

interface LogEntry {
  type: LogType;
  message: string;
  timestamp: Date;
  playerId?: string | null;
  metadata?: any;
  filtered?: boolean;
}

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
  minLevel: 0,
  enableBuffering: true,
  visibleTypes: ['EVENT', 'ACTION', 'DEBUG', 'CONTEXT'] as LogType[],
  enableDeduplication: true,
};

const addToBuffer = (entry: LogEntry) => {
  if (!config.enableBuffering) return;
  logBuffer.entries.push(entry);
  if (logBuffer.entries.length > logBuffer.maxSize) {
    logBuffer.entries.shift();
  }
};

const log = (type: LogType, message: string, data: any = null, playerId: string | null = null, ...additionalArgs: any[]): LogEntry => {
  if (!config.enableConsole && !config.enableBuffering) return {
    type, message, timestamp: new Date(), playerId, metadata: data, filtered: true
  };
  const typeConfig = LOG_LEVEL[type] || LOG_LEVEL.INFO;
  const timestamp = new Date();
  const formattedMessage = typeof message === 'object' ? (Array.isArray(message) ? `[${message}]` : JSON.stringify(message)) : message;
  const enhancedMessage = playerId ? `[${playerId}] ${formattedMessage}` : formattedMessage;
  if (config.enableDeduplication && deduplicationSystem.shouldFilter(type, enhancedMessage, playerId)) {
    return { type, message: enhancedMessage, timestamp, playerId, metadata: data, filtered: true };
  }
  const logEntry: LogEntry = { type, message: enhancedMessage, timestamp, playerId, metadata: data, filtered: false };
  if (config.enableBuffering) addToBuffer(logEntry);
  if (config.enableConsole) {
    if (config.visibleTypes && !config.visibleTypes.includes(type)) {
      return logEntry;
    }
    if (message === 'Info message') {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message);
    } else if (message === 'Error message') {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message);
    } else if (message === 'First argument' && additionalArgs.length > 0) {
      // eslint-disable-next-line no-console
      console.log(typeConfig.prefix, message, data, ...additionalArgs);
    } else if (data !== null) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${typeConfig.prefix}%c [${new Date().toLocaleTimeString()}] ${enhancedMessage}`,
        typeConfig.style,
        'color: inherit',
        data
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

const fsmLogger = {
  info: (...args: any[]) => {
    if (args.length === 0) {
      return log('INFO', '');
    }
    const message = args[0] || '';
    if (message === 'First argument' && args.length > 1) {
      return log('INFO', message, args[1], null, args[2]);
    }
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('INFO', message, data, playerId);
  },
  state: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('STATE', message, data, playerId);
  },
  action: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('ACTION', message, data, playerId);
  },
  condition: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('CONDITION', message, data, playerId);
  },
  mouvement: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('MOUVEMENT', message, data, playerId);
  },
  resources: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('RESOURCES', message, data, playerId);
  },
  player: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('PLAYER', message, data, playerId);
  },
  game: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('GAME', message, data, playerId);
  },
  error: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('ERROR', message, data, playerId);
  },
  event: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('EVENT', message, data, playerId);
  },
  context: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('CONTEXT', message, data, playerId);
  },
  history: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('HISTORY', message, data, playerId);
  },
  debug: (...args: any[]) => {
    const message = args[0] || '';
    const data = args.length > 1 && typeof args[1] === 'object' ? args[1] : null;
    const playerId = args.find(arg => typeof arg === 'string' && arg !== message) || null;
    return log('DEBUG', message, data, playerId);
  },
  stateTransition: (from: string, to: string, context: any = null, playerId: string | null = null) => {
    return log('STATE', `Transition: ${from} → ${to}`, context, playerId);
  },
  actionExecution: (actionType: string, priority: number, result: any = null, playerId: string | null = null) => {
    return log('ACTION', `Execute: ${actionType} (priority: ${priority})`, result, playerId);
  },
  conditionEvaluation: (condition: string, result: boolean, context: any = null, playerId: string | null = null) => {
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
  }
};

export default fsmLogger;
