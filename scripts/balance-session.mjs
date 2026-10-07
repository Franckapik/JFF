import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { createServer } from "vite";

const REPORT_VERSION = 1;
const INCIDENT_TYPES = ["fuel.stranded", "rescue.completed", "drone.lost", "danger.impact", "cloud.impact", "ship.repaired", "ship.disabled"];
const OUTCOMES = ["success", "blocked", "noWinner", "timeout"];

const { values } = parseArgs({ options: {
  games: { type: "string", default: "1000" },
  start: { type: "string", default: "0" },
  "max-logical-ms": { type: "string", default: "1000000" },
  output: { type: "string", default: "report.balance.json" },
  compare: { type: "string" },
  label: { type: "string", default: "" },
  help: { type: "boolean", default: false },
} });

if (values.help) {
  console.log("Usage: npm run balance -- [--games=1000] [--start=0] [--max-logical-ms=1000000] [--output=report.balance.json] [--compare=report.previous.json] [--label=name]");
  process.exit(0);
}

function integerOption(value, name, minimum, maximum) {
  const parsed = Number(value);
  assert.ok(/^\d+$/.test(value) && Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum,
    `${name} must be an integer between ${minimum} and ${maximum}`);
  return parsed;
}

const games = integerOption(values.games, "--games", 1, 100000);
const start = integerOption(values.start, "--start", 0, 0xffffffff);
const maxLogicalMs = integerOption(values["max-logical-ms"], "--max-logical-ms", 1, Number.MAX_SAFE_INTEGER);
assert.ok(start + games - 1 <= 0xffffffff, "Seed range must fit in unsigned 32-bit integers");
assert.notEqual(values.output, values.compare, "--output and --compare must be different files");

function failureInterval(failures, total) {
  const z = 1.959963984540054;
  const rate = failures / total;
  const denominator = 1 + z * z / total;
  const center = (rate + z * z / (2 * total)) / denominator;
  const margin = z * Math.sqrt(rate * (1 - rate) / total + z * z / (4 * total * total)) / denominator;
  return { rate, low95: failures === 0 ? 0 : Math.max(0, center - margin), high95: failures === total ? 1 : Math.min(1, center + margin) };
}

function summarize(results) {
  const counts = Object.fromEntries(OUTCOMES.map(outcome => [outcome, 0]));
  const incidentGames = Object.fromEntries(INCIDENT_TYPES.map(type => [type, 0]));
  const incidentEvents = Object.fromEntries(INCIDENT_TYPES.map(type => [type, 0]));
  const damageThresholdSeeds = { 50: 0, 70: 0, 100: 0 };
  const damageThresholdBots = { 50: 0, 70: 0, 100: 0 };
  const servicePlacements = { fuel: {}, repair: {} };
  const serviceMaxPathDifference = { fuel: 0, repair: 0 };
  let remainingResources = 0;
  let actionsPlayed = 0;
  for (const result of results) {
    counts[result.outcome]++;
    remainingResources += result.remainingResources;
    actionsPlayed += Object.values(result.bots).reduce((total, bot) => total + bot.actionsSpent, 0);
    for (const type of INCIDENT_TYPES) {
      incidentEvents[type] += result.incidents[type];
      if (result.incidents[type] > 0) incidentGames[type]++;
    }
    for (const threshold of [50, 70, 100]) {
      const reached = Object.values(result.damagePeaks).filter(damage => damage >= threshold).length;
      if (reached > 0) damageThresholdSeeds[threshold]++;
      damageThresholdBots[threshold] += reached;
    }
    for (const kind of ["fuel", "repair"]) {
      const service = result.services[kind];
      servicePlacements[kind][service.coord] = (servicePlacements[kind][service.coord] ?? 0) + 1;
      serviceMaxPathDifference[kind] = Math.max(serviceMaxPathDifference[kind], Math.abs(service.baseSteps[0] - service.baseSteps[1]));
    }
  }
  const failures = results.length - counts.success;
  return {
    games: results.length,
    outcomes: counts,
    failure: { count: failures, ...failureInterval(failures, results.length) },
    incidentGames,
    incidentEvents,
    damageThresholdSeeds,
    damageThresholdBots,
    servicePlacements,
    serviceMaxPathDifference,
    gamesWithRemainingResources: results.filter(result => result.remainingResources > 0).length,
    totalRemainingResources: remainingResources,
    actionsPlayed,
  };
}

function compareReports(previous, current) {
  assert.equal(previous.reportVersion, REPORT_VERSION, "Incompatible comparison report version");
  assert.equal(previous.config.start, current.config.start, "Comparison seed range starts differ");
  assert.equal(previous.config.games, current.config.games, "Comparison game counts differ");
  assert.equal(previous.config.maxLogicalMs, current.config.maxLogicalMs, "Comparison time limits differ");
  assert.equal(previous.results.length, current.results.length, "Comparison result counts differ");
  const gained = [];
  const regressed = [];
  for (let index = 0; index < current.results.length; index++) {
    const before = previous.results[index];
    const after = current.results[index];
    assert.equal(before.seed, after.seed, `Comparison seed mismatch at index ${index}`);
    if (before.outcome !== "success" && after.outcome === "success") gained.push(after.seed);
    if (before.outcome === "success" && after.outcome !== "success") regressed.push(after.seed);
  }
  return {
    previousLabel: previous.config.label,
    previousFailureRate: previous.summary.failure.rate,
    currentFailureRate: current.summary.failure.rate,
    failureDeltaPercentagePoints: 100 * (current.summary.failure.rate - previous.summary.failure.rate),
    gainedSeeds: gained,
    regressedSeeds: regressed,
  };
}

const previous = values.compare ? JSON.parse(readFileSync(values.compare, "utf8")) : null;
if (previous) {
  assert.equal(previous.reportVersion, REPORT_VERSION, "Incompatible comparison report version");
  assert.equal(previous.config.start, start, "Comparison seed range starts differ");
  assert.equal(previous.config.games, games, "Comparison game counts differ");
  assert.equal(previous.config.maxLogicalMs, maxLogicalMs, "Comparison time limits differ");
  assert.equal(previous.results.length, games, "Comparison result counts differ");
}
const server = await createServer({
  configFile: false,
  cacheDir: "node_modules/.vite-balance",
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: "custom",
  logLevel: "error",
});

try {
  const { GameSession } = await server.ssrLoadModule("/src/engine/session.ts");
  const { RULES } = await server.ssrLoadModule("/src/engine/rules.ts");
  const { pathBetween } = await server.ssrLoadModule("/src/engine/world.ts");
  const results = [];
  const started = performance.now();
  const progressEvery = Math.max(1, Math.ceil(games / 10));
  for (let index = 0; index < games; index++) {
    const seed = start + index;
    const session = new GameSession(seed);
    try {
      session.advance(maxLogicalMs);
      session.assertInvariants();
      const snapshot = session.getSnapshot();
      const outcome = snapshot.phase === "blocked" ? "blocked"
        : snapshot.phase !== "finished" ? "timeout"
          : snapshot.winners.length === 0 ? "noWinner" : "success";
      const incidents = Object.fromEntries(INCIDENT_TYPES.map(type => [type, 0]));
      for (const event of snapshot.events) if (event.type in incidents) incidents[event.type]++;
      const damagePeaks = Object.fromEntries(["bot-0", "bot-1"].map(id => [id, Math.max(snapshot.bots[id].damage,
        ...snapshot.events.filter(event => event.botId === id).map(event => event.after?.damage ?? 0))]));
      const bases = [snapshot.bots["bot-0"].base, snapshot.bots["bot-1"].base];
      const services = Object.fromEntries(["fuel", "repair"].map(kind => {
        const coord = Object.values(snapshot.world).find(tile => tile.kind === kind)?.coord;
        assert.ok(coord, `Missing ${kind} station for seed ${seed}`);
        return [kind, { coord, baseSteps: bases.map(base => pathBetween(snapshot.world, base, coord).length - 1) }];
      }));
      results.push({
        seed,
        outcome,
        phase: snapshot.phase,
        elapsedMs: snapshot.elapsed,
        endReason: snapshot.endReason,
        winners: snapshot.winners,
        remainingResources: Object.values(snapshot.remainingResources).reduce((total, amount) => total + amount, 0),
        initialSpecial: snapshot.initialResources.special,
        remainingSpecial: snapshot.remainingResources.special,
        services,
        incidents,
        damagePeaks,
        bots: Object.fromEntries(Object.values(snapshot.bots).map(bot => [bot.id, {
          state: bot.state,
          score: bot.score,
          budget: bot.budget,
          actions: bot.actions,
          actionsSpent: bot.actionsSpent,
          fuel: bot.fuel,
          damage: bot.damage,
          explored: bot.explored.length,
          fuelStationSeen: Object.values(snapshot.world).some(tile => tile.kind === "fuel" && bot.explored.includes(tile.coord)),
          ...bot.statistics,
        }])),
      });
    } finally {
      session.stop();
    }
    if ((index + 1) % progressEvery === 0 || index + 1 === games) {
      process.stderr.write(`Simulated ${index + 1}/${games} seeds\n`);
    }
  }
  const report = {
    reportVersion: REPORT_VERSION,
    measuredAt: new Date().toISOString(),
    node: process.version,
    config: { games, start, maxLogicalMs, label: values.label, rules: RULES },
    summary: summarize(results),
    wallMs: performance.now() - started,
    results,
  };
  if (previous) report.comparison = compareReports(previous, report);
  writeFileSync(values.output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({ output: values.output, summary: report.summary, comparison: report.comparison ?? null }, null, 2));
} finally {
  await server.close();
}
