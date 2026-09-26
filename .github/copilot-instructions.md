# 🧑‍💻 Copilot Instructions for JFF FSM Project

## Big Picture Architecture

- The active runtime is `src/engine/session.ts`: one authoritative world, two XState v5 bot actors, serialized resource transactions and one logical scheduler.
- `src/engine/botMachine.ts` exposes explicit operation states through the XState `setup()` API. The session planner selects feasible intentions; the session applies their effects.
- `src/engine/resources.ts`, `rules.ts`, `world.ts`, `model.ts` and `protocol.ts` define resource arithmetic, configurable rules, axial geometry, typed state and the validated transport contract.
- `src/workers/session-worker.ts` owns one `SessionHost` and one clock. All same-origin tabs connect through `src/stores/useSessionStore.ts`; no local engine fallback is allowed.
- `src/components/session/` contains the lazy-loaded game and diagnostic views. Rendering interpolates snapshots; it never advances gameplay or changes resource stocks.
- The old `src/ai/fsm/machineX/`, game/XFSM/shared-worker stores, `fsm-shared-worker.ts`, `engine/gameEngine.ts`, `Vue1R3F.tsx` and related components remain historical references outside the active graph. Do not wire them back into production or use their old rules as the gameplay contract.

## Developer Workflows

- Node >= 22.12; use `npm ci` with the tracked lockfile.
- **Run/build:** `npm run dev`, `npm run build`, `npm run preview`.
- **Tests:** `npm test` or `npm run test:watch`; reuse `src/engine/session.test.ts` for nearby scenarios.
- **Types/lint:** `npm run type-check` checks the complete active entry graph with strict TypeScript and checked JavaScript. `npm run lint` uses `eslint.config.js`, rejects warnings and prohibits UI imports in the engine.
- **Gate:** `npm run validate` runs types, tests, lint and build. `./scripts/pre-commit.sh` also checks dependency advisories. The former `check-exports` and guard-menu commands do not exist in the active workflow.

## Logging & Debugging

- Logs are always managed by copy-pasting from the browser/node console, or by using the ninja logging tools (see `console-ninja_runtimeLogs*`).
- Focused automated test files are authorized by the user as of 2026-09-26. Cover shared-resource conservation, per-resource capacities, FSM transitions, and bot decisions with reproducible checks.
- Keep TypeScript checks and runtime logs as complementary verification. Reuse the existing test tooling and suitable test files; avoid unnecessary frameworks, duplicate suites, and one-off validation files.
- Console forwarding requires `VITE_FORWARD_LOGS=true` in development; it is disabled in production. The loopback log server and client bound request size and traffic.

## Gameplay Contract

- Follow the [confirmed gameplay decisions](../docs/AUDIT-2026-09-26.md#decisions-de-gameplay-validees) when changing the engine.
- Implementation status and conservative defaults are recorded in the audit's refactor follow-up. Keep new unresolved rules explicit instead of deciding gameplay implicitly.
- Enforce each resource compartment independently. Remaining world stock + cargo + cumulative deposits + explicit losses equals initial stock, per resource. Purchases debit budget, not cumulative score or the physical resource ledger.
- Use seeded randomness, adjacent walkable movement, local-only services, and the session clock. Do not add independent timers to bots or renderer-driven completion events.

## Project-Specific Conventions

- **Exports:**
  - Stores/hooks: named exports only
  - React components: default export only
- **XState Actions:**
  - Context updates: prefix with `assign*Context` (e.g., `assignDroneDeployingContext`)
  - Entry/exit effects: prefix with `on*Entry`/`on*Exit` (e.g., `onExploringEntry`)
- **Guards:**
  - Guard names reflect business logic (e.g., `shouldCollect`, `needsRefuel`)
  - Legacy adapters belong only to archived code, not to the active engine
- **Types:**
  - Active context/events are in `src/engine/model.ts`, `botMachine.ts` and `protocol.ts`; old `src/types/*fsm*` declarations are not the new contract
- **FSM Machine:**
  - Use `setup()` API for XState v5
  - All actions/guards are referenced by string name in the machine config, implemented in the setup object

## Rendering & Synchronization

- Flow: session transactions -> XState contexts -> versioned worker snapshot -> Zustand read model -> Three.js interpolation.
- Preserve `gameId` checks, idempotent connection, pause/step semantics and shared resets. An unsupported SharedWorker must produce a visible recoverable error, not an independent local world.
- Cache unchanged world references via `worldRevision`; use one instanced tile mesh. Keep derived UI statistics tied to the actual snapshot.
- Verify desktop/mobile layout, canvas pixels and interaction after rendering changes. Performance measurements from this machine do not certify all browsers or devices.

---

For more details, see `/docs/` and `scripts/README.md`. If any section is unclear or missing, please provide feedback to improve these instructions.

**Note:** Targeted automated tests are permitted. Keep verification proportional to the change, alongside TypeScript and runtime checks.
