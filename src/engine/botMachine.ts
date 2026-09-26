import { assign, setup } from "xstate";

import type { Bot } from "./model";

type BotEvent = { type: "PLAN" | "TICK" | "COMPLETE" | "ELIMINATE" | "FINISH"; bot: Bot };

export const botMachine = setup({
  types: { context: {} as Bot, input: {} as Bot, events: {} as BotEvent },
  actions: { assignBotContext: assign(({ event }) => event.bot) },
  guards: {
    isMove: ({ event }) => event.bot.operation?.kind === "move",
    isScan: ({ event }) => event.bot.operation?.kind === "scan",
    isCollect: ({ event }) => event.bot.operation?.kind === "collect",
    isService: ({ event }) => event.bot.operation?.kind === "service",
    isUpgrade: ({ event }) => event.bot.operation?.kind === "upgrade",
    isPurchase: ({ event }) => event.bot.operation?.kind === "purchase",
    isRescue: ({ event }) => event.bot.operation?.kind === "rescue",
  },
}).createMachine({
  id: "sessionBot",
  context: ({ input }) => input,
  initial: "deciding",
  on: {
    TICK: { actions: "assignBotContext" },
    ELIMINATE: { target: ".eliminated", actions: "assignBotContext" },
    FINISH: { target: ".finished", actions: "assignBotContext" },
  },
  states: {
    deciding: {
      on: {
        PLAN: [
          { target: "moving", guard: "isMove", actions: "assignBotContext" },
          { target: "scanning", guard: "isScan", actions: "assignBotContext" },
          { target: "collecting", guard: "isCollect", actions: "assignBotContext" },
          { target: "servicing", guard: "isService", actions: "assignBotContext" },
          { target: "upgrading", guard: "isUpgrade", actions: "assignBotContext" },
          { target: "purchasing", guard: "isPurchase", actions: "assignBotContext" },
          { target: "rescuing", guard: "isRescue", actions: "assignBotContext" },
        ],
      },
    },
    moving: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    scanning: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    collecting: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    servicing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    upgrading: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    purchasing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    rescuing: { on: { COMPLETE: { target: "deciding", actions: "assignBotContext" } } },
    eliminated: { type: "final" },
    finished: { type: "final" },
  },
});
