import type { BotPhase, ElectricCloud } from "../../engine/model";
import { RULES } from "../../engine/rules";
import type { BotId, TileKind } from "../../engine/world";

export const BOT_COLORS: Record<BotId, string> = { "bot-0": "#287c79", "bot-1": "#be6249" };
export const DEPLETED_TILE_COLOR = "#829aac";
export const MINED_TILE_COLOR = "#a84962";
export const TILE_COLORS: Record<TileKind, string> = {
  resource: "#a8bda3",
  empty: "#e0d7c1",
  obstacle: "#8f988e",
  danger: "#d58b72",
  base: "#dac7a5",
  fuel: "#dfbb75",
  repair: "#b5a8bc",
};
export const TILE_LABELS: Record<TileKind, string> = {
  resource: "Ressources",
  empty: "Vide",
  obstacle: "Obstacle",
  danger: "Danger",
  base: "Base",
  fuel: "Carburant",
  repair: "Reparation",
};
export const RESOURCE_LABELS = { food: "Provisions", debris: "Débris", special: "Cartes action" };
export const PHASE_LABELS: Record<BotPhase, string> = {
  deciding: "Decision",
  moving: "Deplacement",
  waiting: "En attente",
  scanning: "Exploration",
  mining: "Pose de mine",
  mineScanning: "Scan de mines",
  neutralizing: "Neutralisation",
  collecting: "Collecte",
  servicing: "Maintenance",
  upgrading: "Extension",
  memoryUpgrading: "Mémoire améliorée",
  purchasing: "Achat de drone",
  rescuing: "Remorquage",
  disabled: "Immobilise",
  finished: "Termine",
};
export function cloudOpacity(cloud: ElectricCloud, elapsed: number): number {
  return Math.max(0, Math.min(1,
    (elapsed - cloud.appearedAt) / RULES.cloudFadeDuration,
    (cloud.expiresAt - elapsed) / RULES.cloudFadeDuration
  ));
}
export function clock(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
