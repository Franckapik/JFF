# 🧑‍💻 Copilot Instructions for JFF FSM Project

## Big Picture Architecture
- The project is a React/Three.js app with a domain-driven FSM (finite state machine) core using XState v5 (see `src/ai/fsm/machineX/machine.xstate.v5.ts`).
- FSM logic is split by business domain: global, evaluation, exploration, collecting, maintenance. Each domain has its own actions and guards, organized in `src/ai/fsm/machineX/domains/`.
- The main state machine is used in stores (see `src/stores/useGameStore/`, `useXFSMStore/`) and in the UI via hooks (`useMachine`, `useInterpret` from `@xstate-ninja/react`).
- The v5 machine is now production default; v4 is kept as backup in `backup/` and legacy files.

## Developer Workflows
- **Build:** Standard Vite workflow (`npm run dev`, `npm run build`).
- **Lint:** ESLint config is custom, see `eslint-xstate-naming.json` and `.eslintrc.json`.
- **Pre-commit:** Use `./scripts/pre-commit.sh` for validation (lint, import/export checks, build).
- **Import/Export checks:** Run `npm run check-exports` or `node scripts/check-exports.js` to validate module boundaries and conventions.

## Logging & Debugging
- Logs are always managed by copy-pasting from the browser/node console, or by using the ninja logging tools (see `console-ninja_runtimeLogs*`).
- Do not generate or expect any test or validation files; all validation relies strictly on TypeScript type constraints and runtime logs.

## Project-Specific Conventions
- **Exports:**
  - Stores/hooks: named exports only
  - React components: default export only
- **XState Actions:**
  - Context updates: prefix with `assign*Context` (e.g., `assignDroneDeployingContext`)
  - Entry/exit effects: prefix with `on*Entry`/`on*Exit` (e.g., `onExploringEntry`)
- **Guards:**
  - Use `adaptLegacyGuard` for migration compatibility
  - Guard names reflect business logic (e.g., `shouldCollect`, `needsRefuel`)
- **Types:**
  - All events and context strictly typed in `src/types/events.d.ts` and `src/types/xstate.v5.types.ts`
- **FSM Machine:**
  - Use `setup()` API for XState v5
  - All actions/guards are referenced by string name in the machine config, implemented in the setup object


## Trackers, Animations & FSM Logic
- **Trackers** (see `src/ai/fsm/machineX/hooks/trackers/`): Observe the FSM state and context, and expose derived data (e.g., positions, statuses) for use in UI and animation logic.
- **Animations** (see `src/animations/`): Animation hooks and utilities consume tracker outputs and FSM context to drive Three.js visual updates (e.g., drone/ship movement, tile effects).
- **FSM Machine**: The state machine emits events and updates context; trackers subscribe to these changes and propagate relevant data to animation hooks, ensuring UI stays in sync with FSM state.

**Typical flow:** FSM → Trackers → Animation hooks → Three.js scene/components.

This separation allows business logic (FSM) to remain decoupled from rendering/animation, while trackers act as a bridge for state synchronization.

## Examples
- **FSM usage in UI:**
  ```tsx
  import { useMachine } from '@xstate-ninja/react';
  import { machineXV5Pure } from './ai/fsm/machineX/machine.pure.v5';
  const [state, send] = useMachine(machineXV5Pure, { devTools: true });
  ```
- **Store integration:**
  ```ts
  import machineXV5 from '../../ai/fsm/machineX/machine.xstate.v5.ts';
  const actor = createActor(machineXV5, { input: botContext });
  actor.send({ type: 'SHIP_POSITION_UPDATE', position: { x: 10, y: 0, z: 10 } });
  ```
- **Custom script:**
  ```bash
  npm run check-exports
  ./scripts/pre-commit.sh
  ```

---

For more details, see `/docs/` and `scripts/README.md`. If any section is unclear or missing, please provide feedback to improve these instructions.

**Note:** Never create test or validation files. All correctness is enforced by TypeScript and runtime logs only.
