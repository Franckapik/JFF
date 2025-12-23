# 🧪 FSM Guard Validation - Terminal Testing Guide

## Overview

This guide explains how to use the FSM guard validation system to test pure guards in Node.js without R3F, Zustand, or React dependencies.

### What is This For?

- ✅ **Test guards in isolation** in the terminal
- ✅ **Validate FSM transitions** deterministically
- ✅ **Enforce pure functions** via ESLint + TypeScript
- ✅ **Provide terminal visibility** for CI/CD and fast feedback loops
- ✅ **Enable Copilot autonomy** to iterate without browser context

---

## Quick Start

### 1. Run Interactive Validation Menu

```bash
npm run validate-guards
```

This opens an interactive CLI menu where you can:
1. Select a domain (maintenance, evaluation, collection, etc.)
2. Choose which guards to test
3. Select a scenario (healthy, critical, custom)
4. Configure context values (fuel, damage, resources, position)
5. See results in formatted tables

### 2. Example: Test "Low Fuel" Scenario

```
✓ Select domain: maintenance
✓ Select guards: needsRefuel
✓ Select context: custom
✓ Enter fuel: 20
✓ Enter damage: 0
✓ Enter resources: 0, 0, 0
✓ Enter position: 0, 0
```

**Result:**
```
══════════════════════════════════════════════════════════════
🧪 GUARD VALIDATION: MAINTENANCE
══════════════════════════════════════════════════════════════
Guards: needsRefuel
Timestamp: 2025-12-23T12:34:56.789Z
══════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────
Guard           Status      Result    Duration    Error
────────────────────────────────────────────────────────────
needsRefuel     ✅ PASS     true      0.25ms      -
────────────────────────────────────────────────────────────

📊 TEST SUMMARY
════════════════════════════════════════════════════════════
Total tests: 1
Passed: 1 ✅
Failed: 0 ❌
Pass rate: 100.0%
════════════════════════════════════════════════════════════
```

---

## Guard Architecture

### Pure Guards (Testable in Terminal)

All pure guards follow this pattern:

```typescript
// src/ai/fsm/machineX/domains/maintenance/guards.pure.ts

export const needsRefuel: XStateV5Guard = ({ context }) => {
  const fuel = context.vehicle?.fuel ?? 0;
  return fuel < 30; // Pure calculation, no side effects
};
```

**Characteristics:**
- ✅ No side effects (no `getState()`, no `console.log()`)
- ✅ Deterministic (same input → same output)
- ✅ Testable without R3F, Zustand, or React
- ✅ Type-safe with `XStateV5Guard`

### Importing Guards

**In machine.pure.v5.ts (the FSM definition):**

```typescript
// Import from guards.pure.ts (not guards.ts)
import {
  needsRefuel,
  needsRepair,
  isShipOnBase,
  maintenanceComplete,
} from './domains/maintenance/guards.pure';
```

---

## Terminal Workflow: Observe → Command → Log

The ideal workflow to advance the FSM with Copilot autonomy:

```
1. 👁️ OBSERVE (Visual Feedback)
   └─ Watch R3F scene to understand vehicle state
   └─ Open xstate-viewer in browser to see state machine
   └─ Check browser console for logs

2. 💬 PASS COMMAND (User Instruction)
   └─ "Increase fuel to 85%, test needsRefuel"
   └─ "Simulate critical maintenance scenario"
   └─ "Validate all 5 maintenance guards pass"

3. ✅ VALIDATE IN TERMINAL (Copilot Autonomy)
   └─ npm run validate-guards  (interactive)
   └─ See results immediately, no browser needed
   └─ Refine FSM logic based on results

4. 📊 LOG TRANSITION (FSM Output)
   └─ Check xstate-viewer for state change
   └─ Verify context updated correctly
   └─ Move to next task
```

**Key Benefit:** Steps 2-3 happen entirely in the terminal without blocking on R3F or browser interaction.

---

## Available Domains & Guards

### 🔧 Maintenance (READY - Fully Pure)

All guards in `guards.pure.ts`:

| Guard | Description | Test Case |
|-------|-------------|-----------|
| `needsRefuel` | fuel < 30% | fuel = 20 → true |
| `needsRepair` | damage > 50% | damage = 75 → true |
| `needsDeposit` | resources > 0 | food = 100 → true |
| `isShipOnBase` | distance <= 1.0 | pos = (0.5, 0.5) → true |
| `maintenanceComplete` | no issues | fuel=50, damage=0, empty → true |

**Status:** ✅ Production-ready, fully tested, ESLint enforced

### 📊 Evaluation

Mixed pure + impure guards. **2 pure guards** extracted to `guards.pure.ts`:

| Guard | Description | Test Case | Status |
|-------|-------------|-----------|--------|
| `shouldExplore` | cycle < 2, fuel > threshold, damage < 80 | fuel=50, damage=0 → true | ✅ PURE |
| `shouldMaintain` | fuel < 30% OR damage > 50% | fuel=20 → true | ✅ PURE |
| `shouldCollect` | checks tiles in radius via useTileStore | N/A | ⚠️ IMPURE (deferred) |

**Status:** 🔄 Partial migration - 2/3 guards pure, `shouldCollect` marked @deprecated for Phase 2

### 📦 Collection

Mixed pure + impure guards. **4 pure guards** extracted to `guards.pure.ts`:

| Guard | Description | Test Case | Status |
|-------|-------------|-----------|--------|
| `canCollectTile` | capacity available, fuel > 20%, damage < 80% | fuel=50, damage=20 → true | ✅ PURE |
| `isVehicleOverloaded` | resources >= 80% capacity | resources=80/100 → true | ✅ PURE |
| `shouldReturnToBase` | capacity >= 80% OR fuel < 30% OR damage > 70% | fuel=20 → true | ✅ PURE |
| `canContinueCollecting` | capacity < 80%, fuel > 30%, damage < 70% | fuel=50, damage=20 → true | ✅ PURE |
| `hasMoreCollectibleTiles` | checks tiles in radius via useTileStore | N/A | ⚠️ IMPURE (deferred) |

**Status:** 🔄 Partial migration - 4/5 guards pure, `hasMoreCollectibleTiles` marked @deprecated for Phase 2

### 🚀 Initializing

Mixed pure + impure guards. **4 pure guards** extracted to `guards.pure.ts`:

| Guard | Description | Test Case | Status |
|-------|-------------|-----------|--------|
| `isVehiclePositionInitialized` | checks vehicle position exists | position={x:10, z:20} → true | ✅ PURE |
| `isDronePositionInitialized` | checks first drone position exists | drone.position={x:5, z:15} → true | ✅ PURE |
| `isBasePositionInitialized` | checks base position exists | basePosition={x:0, z:0} → true | ✅ PURE |
| `areAllEntitiesInitialized` | composite check of all 3 guards | all positions valid → true | ✅ PURE |

**Status:** ✅ 100% pure - All 4 guards migrated successfully

**Note:** The impure versions in `guards.ts` call `useGameStore.getState().isGameInitialized()` and are marked @deprecated. The pure versions only check position data from context.

---

## Context Fixtures (Mock Data)

The validation system provides preset contexts to test common scenarios:

### Healthy Vehicle

```typescript
createHealthyVehicleContext()
// fuel: 75%, damage: 10%, empty resources, at base
```

### Critical Vehicle

```typescript
createCriticalVehicleContext()
// fuel: 15%, damage: 80%, full resources, far from base
```

### Custom Configuration

In the menu, select "Custom" and enter:
- Fuel percentage (0-100)
- Damage percentage (0-100)
- Food resources (0-800)
- Debris resources (0-800)
- Ship position (X, Z)

---

## ESLint Enforcement

Guards in `maintenance/` are now protected by ESLint rules:

### Rule 1: Forbid Store Access

```typescript
// ❌ This will fail ESLint
export const badGuard = () => {
  const tiles = useTileStore.getState().tiles; // ERROR
  return tiles.length > 0;
};
```

**Error Message:**
```
❌ Guards in maintenance/ must be pure. 
   getState() is forbidden. Use guards.pure.ts instead.
```

### Rule 2: Forbid React/R3F Imports

```typescript
// ❌ This will fail ESLint
import { useFrame } from '@react-three/fiber'; // ERROR
```

**Error Message:**
```
❌ FSM guards must not import React, R3F, or stores. 
   Keep guards pure and agnostic.
```

### Rule 3: Type Enforcement

```typescript
// ✅ This is required
export const myGuard: XStateV5Guard = ({ context }) => {
  return true;
};
```

---

## Node.js Testing Without Browser

### Direct Script Usage (No Interactive Menu)

```bash
node scripts/test-guards.js maintenance needsRefuel
```

Or in a custom script:

```javascript
// my-test-script.js
import {
  testGuard,
  createLowFuelContext,
} from './scripts/validate-guards/index.js';

import { needsRefuel } from './src/ai/fsm/machineX/domains/maintenance/guards.pure.js';

const result = await testGuard(
  'needsRefuel',
  needsRefuel,
  createLowFuelContext(20),
  {}
);

console.log(result); // { passed: true, result: true, ... }
```

---

## CI/CD Integration

To add validation to your CI pipeline:

### GitHub Actions Example

```yaml
name: FSM Guard Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate-guards -- --ci --maintenance
```

---

## Troubleshooting

### "Guard module not found"

```
Error: Cannot find module './guards.pure.js'
```

**Solution:** Ensure `guards.pure.ts` is in the correct path:
```
src/ai/fsm/machineX/domains/maintenance/guards.pure.ts
```

### "Context fixture missing field"

```
Error: context.vehicle is undefined
```

**Solution:** Use a fixture factory:
```javascript
import { createMockFSMContext } from './scripts/validate-guards/context-fixtures.js';
const ctx = createMockFSMContext({ vehicle: { fuel: 50 } });
```

### ESLint errors on `guards.ts`

The old `guards.ts` with logging is still used for effects. To use pure guards:
- ✅ New code → import from `guards.pure.ts`
- ⚠️ Legacy code → keep `guards.ts` with logging, mark as `@deprecated`

---

## Next Steps (Future Phases)

### Phase 2: Context Injector (Evaluation Domain)

Once maintenance guards are stable, extract pure subsets from evaluation/collection domains and add a **dependency injection layer** to pass store data at runtime (not in pure guard definitions).

### Phase 3: Full FSM Cycle Testing

Test complete state transitions:
- FSM starts in idle
- Send event → transition → verify new state
- All without browser/R3F

### Phase 4: Property-Based Testing

Use test data generators to validate guard logic across all possible context values.

---

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run validate-guards` | Interactive menu for guard testing |
| `npm run build` | TypeScript + ESLint check + Vite build |
| `npm run lint` | ESLint only (includes new rules) |
| `npm run type-check` | TypeScript only |

---

## FAQ

**Q: Why not use Vitest for testing?**

A: Per project conventions, no test files are created. Terminal-based scripts with `npm run validate-guards` provide the same visibility with simpler setup and faster iteration.

**Q: Can I test impure guards (with store access)?**

A: Not yet. The "impure" guards in `guards.ts` still use `getState()`. Once Step 2 (Context Injector) is implemented, you'll pass store data as context without calling `getState()` directly.

**Q: How do I add a new pure guard?**

A: 1. Define it in `guards.pure.ts` with type `XStateV5Guard`
   2. Import in `machine.pure.v5.ts`
   3. ESLint automatically enforces purity
   4. Test via `npm run validate-guards`

**Q: Can I run validation in CI without prompts?**

A: Yes, create a script that calls `testGuard()` or `testGuards()` directly from `scripts/validate-guards/guard-runner.js`.

---

## Contributing

When adding new guards:

1. ✅ Write pure implementation in `guards.pure.ts`
2. ✅ Add JSDoc comments with examples
3. ✅ Test via `npm run validate-guards`
4. ✅ Verify ESLint passes
5. ✅ Document the guard in this README

---

**Last Updated:** 2025-12-23  
**Status:** ✅ POC Complete for Maintenance Domain

---

## Legacy Scripts

For reference, the previous import/export checking tools are still available:

```bash
npm run check-exports      # Analyze import/export compatibility
./scripts/pre-commit.sh    # Run all pre-commit validations
```
