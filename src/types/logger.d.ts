// Types centralisés pour le logger et la config

export type LogType =
  | "INFO"
  | "STATE"
  | "ACTION"
  | "CONDITION"
  | "MOUVEMENT"
  | "PLAYER"
  | "GAME"
  | "EVENT"
  | "CONTEXT"
  | "HISTORY"
  | "RESOURCES"
  | "DEBUG"
  | "ERROR";

export interface LogEntry {
  type: LogType;
  message: string;
  timestamp: Date;
  playerId?: string | null;
  metadata?: unknown;
  filtered?: boolean;
}

export interface LoggerConfig {
  enableConsole: boolean;
  minLevel: number;
  enableBuffering: boolean;
  visibleTypes: LogType[];
  enableDeduplication: boolean;
}

