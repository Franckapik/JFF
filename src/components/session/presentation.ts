import type { BotPhase, ElectricCloud } from "../../engine/model";
import { RULES } from "../../engine/rules";
import type { BotId, TileKind } from "../../engine/world";

export const BOT_COLORS: Record<BotId, string> = { "bot-0": "#087f8c", "bot-1": "#cf6348" };
export const DEPLETED_TILE_COLOR = "#476889";
export const TILE_COLORS: Record<TileKind, string> = {
  resource: "#8db7a0",
  empty: "#d8dfdb",
  obstacle: "#73817e",
  danger: "#d98377",
  base: "#eeeae0",
  fuel: "#e6c366",
  repair: "#b596b6",
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
export const RESOURCE_LABELS = { food: "Nourriture", debris: "Debris", special: "Special" };
export const PHASE_LABELS: Record<BotPhase, string> = {
  deciding: "Decision",
  moving: "Deplacement",
  waiting: "En attente",
  scanning: "Exploration",
  collecting: "Collecte",
  servicing: "Maintenance",
  upgrading: "Extension",
  purchasing: "Achat de drone",
  rescuing: "Remorquage",
  eliminated: "Elimine",
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
