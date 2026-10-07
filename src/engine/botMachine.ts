import { assign, setup } from "xstate";

import type { Bot } from "./model";

type BotEvent = { type: "PLAN" | "TICK" | "COMPLETE" | "DISABLE" | "FINISH"; bot: Bot };

export const botMachine = setup({
  types: { context: {} as Bot, input: {} as Bot, events: {} as BotEvent },
  actions: { assignBotContext: assign(({ event }) => event.bot) },
  guards: {
    isMove: ({ event }) => event.bot.operation?.kind === "move",
    isWait: ({ event }) => event.bot.operation?.kind === "wait",
    isScan: ({ event }) => event.bot.operation?.kind === "scan",
    isMine: ({ event }) => event.bot.operation?.kind === "mine",
    isMineScan: ({ event }) => event.bot.operation?.kind === "mineScan",
    isNeutralize: ({ event }) => event.bot.operation?.kind === "neutralize",
    isCollect: ({ event }) => event.bot.operation?.kind === "collect",
    isService: ({ event }) => event.bot.operation?.kind === "service",
    isUpgrade: ({ event }) => event.bot.operation?.kind === "upgrade",
    isMemoryUpgrade: ({ event }) => event.bot.operation?.kind === "memoryUpgrade",
    isPurchase: ({ event }) => event.bot.operation?.kind === "purchase",
    isRescue: ({ event }) => event.bot.operation?.kind === "rescue",
  },
}).createMachine({
  id: "sessionBot",
  context: ({ input }) => input,
  initial: "deciding",
  on: {
    TICK: { actions: "assignBotContext" },
    DISABLE: { target: ".disabled", actions: "assignBotContext" },
    FINISH: { target: ".finished", actions: "assignBotContext" },
  },
  states: {
    deciding: {
      on: {
        PLAN: [
          { target: "moving", guard: "isMove", actions: "assignBotContext" },
          { target: "waiting", guard: "isWait", actions: "assignBotContext" },
          { target: "scanning", guard: "isScan", actions: "assignBotContext" },
          { target: "mining", guard: "isMine", actions: "assignBotContext" },
          { target: "mineScanning", guard: "isMineScan", actions: "assignBotContext" },
          { target: "neutralizing", guard: "isNeutralize", actions: "assignBotContext" },
          { target: "collecting", guard: "isCollect", actions: "assignBotContext" },
          { target: "servicing", guard: "isService", actions: "assignBotContext" },
          { target: "upgrading", guard: "isUpgrade", actions: "assignBotContext" },
          { target: "memoryUpgrading", guard: "isMemoryUpgrade", actions: "assignBotContext" },
          { target: "purchasing", guard: "isPurchase", actions: "assignBotContext" },
          { target: "rescuing", guard: "isRescue", actions: "assignBotContext" },
        ],
      },
    },
    moving: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    waiting: { on: {
      COMPLETE: { target: "deciding", actions: "assignBotContext" },
      PLAN: { target: "moving", guard: "isMove", actions: "assignBotContext" },
    } },
    scanning: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    mining: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    mineScanning: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    neutralizing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    collecting: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    servicing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    upgrading: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    memoryUpgrading: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    purchasing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    rescuing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    disabled: {},
    finished: { type: "final" },
  },
});
