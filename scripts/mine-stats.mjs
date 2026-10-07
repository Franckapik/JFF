import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { createServer } from "vite";

const { values } = parseArgs({ options: {
  games: { type: "string", default: "100" },
  start: { type: "string", default: "0" },
  "max-logical-ms": { type: "string", default: "1000000" },
  output: { type: "string" },
  help: { type: "boolean", default: false },
} });

if (values.help) {
  console.log("Usage: npm run mines -- [--games=100] [--start=0] [--max-logical-ms=1000000] [--output=report.mines.json]");
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

function analyzeGame(snapshot, seed) {
  const active = new Map();
  const result = {
    seed,
    phase: snapshot.phase,
    elapsedMs: snapshot.elapsed,
    placed: 0,
    armed: 0,
    spotted: 0,
    forgottenWhileActive: 0,
    scans: 0,
    neutralized: 0,
    neutralizedBeforeArming: 0,
    neutralizedWithin2s: 0,
    neutralizedWithin5s: 0,
    explodedOnShip: 0,
    explodedOnDrone: 0,
    mineDamageHits: 0,
    mineDamagePoints: 0,
    mineDamageAfterForget: 0,
    mineDamageWhileRemembered: 0,
    mineDamageWithoutSpotting: 0,
    activeAtEnd: 0,
    neutralizationDelaysMs: [],
    forgottenHitDelaysMs: [],
  };

  for (const event of snapshot.events) {
    switch (event.type) {
      case "mine.placed":
        assert.ok(!active.has(event.coord), `Seed ${seed}: duplicate mine on ${event.coord}`);
        active.set(event.coord, { placedAt: event.time, armed: false,
          memoryByBot: new Map([[event.botId, { state: "remembered", at: event.time }]]) });
        result.placed++;
        break;
      case "mine.armed": {
        const mine = active.get(event.coord);
        assert.ok(mine, `Seed ${seed}: armed mine without placement on ${event.coord}`);
        mine.armed = true;
        result.armed++;
        break;
      }
      case "mine.neutralized": {
        const mine = active.get(event.coord);
        assert.ok(mine, `Seed ${seed}: neutralized mine without placement on ${event.coord}`);
        const delay = event.time - mine.placedAt;
        result.neutralizationDelaysMs.push(delay);
        result.neutralized++;
        result.neutralizedBeforeArming += Number(!mine.armed);
        result.neutralizedWithin2s += Number(delay <= 2000);
        result.neutralizedWithin5s += Number(delay <= 5000);
        active.delete(event.coord);
        break;
      }
      case "mine.exploded":
        assert.ok(active.has(event.coord), `Seed ${seed}: exploded mine without placement on ${event.coord}`);
        if (event.reason?.startsWith("Drone")) result.explodedOnDrone++;
        else result.explodedOnShip++;
        active.delete(event.coord);
        break;
      case "danger.impact":
        if (event.reason === "mine") {
          const mine = active.get(event.coord);
          assert.ok(mine, `Seed ${seed}: mine impact without active mine on ${event.coord}`);
          const memory = mine.memoryByBot.get(event.botId);
          result.mineDamageHits++;
          result.mineDamagePoints += event.delta?.damage ?? 0;
          if (memory?.state === "remembered") result.mineDamageWhileRemembered++;
          else if (memory?.state === "forgotten") {
            result.mineDamageAfterForget++;
            result.forgottenHitDelaysMs.push(event.time - memory.at);
          } else result.mineDamageWithoutSpotting++;
        }
        break;
      case "mine.spotted": {
        const mine = active.get(event.coord);
        assert.ok(mine, `Seed ${seed}: spotted mine without placement on ${event.coord}`);
        mine.memoryByBot.set(event.botId, { state: "remembered", at: event.time });
        result.spotted++;
        break;
      }
      case "mine.forgotten": {
        const mine = active.get(event.coord);
        if (mine?.memoryByBot.get(event.botId)?.state === "remembered") {
          mine.memoryByBot.set(event.botId, { state: "forgotten", at: event.time });
          result.forgottenWhileActive++;
        }
        break;
      }
      case "mine.scan.completed":
        result.scans++;
        break;
    }
  }
  result.activeAtEnd = active.size;
  assert.equal(result.placed, result.neutralized + result.explodedOnShip + result.explodedOnDrone + result.activeAtEnd,
    `Seed ${seed}: mine lifecycle does not balance`);
  assert.equal(result.mineDamageHits, result.explodedOnShip,
    `Seed ${seed}: ship contact and mine damage events differ`);
  assert.equal(result.mineDamageHits,
    result.mineDamageAfterForget + result.mineDamageWhileRemembered + result.mineDamageWithoutSpotting,
    `Seed ${seed}: mine damage memory categories do not balance`);
  return result;
}

function summarize(results) {
  const keys = ["placed", "armed", "spotted", "forgottenWhileActive", "scans", "neutralized", "neutralizedBeforeArming",
    "neutralizedWithin2s", "neutralizedWithin5s", "explodedOnShip", "explodedOnDrone",
    "mineDamageHits", "mineDamagePoints", "mineDamageAfterForget", "mineDamageWhileRemembered",
    "mineDamageWithoutSpotting", "activeAtEnd"];
  const totals = Object.fromEntries(keys.map(key => [key, results.reduce((sum, result) => sum + result[key], 0)]));
  const delays = results.flatMap(result => result.neutralizationDelaysMs).sort((a, b) => a - b);
  const percentile = fraction => delays.length ? delays[Math.floor((delays.length - 1) * fraction)] : null;
  return {
    games: results.length,
    finishedGames: results.filter(result => result.phase === "finished").length,
    gamesWithPlacement: results.filter(result => result.placed > 0).length,
    gamesWithNeutralization: results.filter(result => result.neutralized > 0).length,
    gamesWithMineDamage: results.filter(result => result.mineDamageHits > 0).length,
    gamesWithMineDamageAfterForget: results.filter(result => result.mineDamageAfterForget > 0).length,
    totals,
    neutralizationDelayMs: { median: percentile(0.5), p90: percentile(0.9) },
  };
}

const server = await createServer({
  configFile: false,
  cacheDir: "node_modules/.vite-mine-stats",
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: "custom",
  logLevel: "error",
});

try {
  const { GameSession } = await server.ssrLoadModule("/src/engine/session.ts");
  const results = [];
  const progressEvery = Math.max(1, Math.ceil(games / 10));
  for (let index = 0; index < games; index++) {
    const seed = start + index;
    const session = new GameSession(seed);
    try {
      session.advance(maxLogicalMs);
      session.assertInvariants();
      results.push(analyzeGame(session.getSnapshot(), seed));
    } finally {
      session.stop();
    }
    if ((index + 1) % progressEvery === 0 || index + 1 === games)
      process.stderr.write(`Simulated ${index + 1}/${games} seeds\n`);
  }

  const summary = summarize(results);
  const totals = summary.totals;
  const percent = (count, total) => total ? `${(100 * count / total).toFixed(1)} %` : "—";
  console.log(`Graines ${start} à ${start + games - 1} : ${games} parties (${summary.finishedGames} terminées)`);
  console.log(`Mines posées : ${totals.placed} dans ${summary.gamesWithPlacement} parties ; armées : ${totals.armed}`);
  console.log(`Neutralisées : ${totals.neutralized} (${percent(totals.neutralized, totals.placed)} des poses), dont ${totals.neutralizedBeforeArming} avant armement`);
  console.log(`Neutralisées sous 2 s : ${totals.neutralizedWithin2s} ; sous 5 s : ${totals.neutralizedWithin5s}`);
  console.log(`Délai pose → neutralisation : médiane ${summary.neutralizationDelayMs.median ?? "—"} ms ; p90 ${summary.neutralizationDelayMs.p90 ?? "—"} ms`);
  console.log(`Explosions au contact : ${totals.explodedOnShip} vaisseau(x), ${totals.explodedOnDrone} drone(s)`);
  console.log(`Dégâts liés aux mines : ${totals.mineDamageHits} impact(s), ${totals.mineDamagePoints} points dans ${summary.gamesWithMineDamage} partie(s)`);
  console.log(`Mémoire lors des impacts : ${totals.mineDamageAfterForget} après oubli, ${totals.mineDamageWhileRemembered} malgré le souvenir, ${totals.mineDamageWithoutSpotting} sans repérage de cette pose`);
  console.log(`Oublis alors que la mine existe encore : ${totals.forgottenWhileActive} ; parties avec impact après oubli : ${summary.gamesWithMineDamageAfterForget}`);
  console.log(`Mines encore présentes en fin de simulation : ${totals.activeAtEnd} ; repérages : ${totals.spotted} ; scans offensifs : ${totals.scans}`);
  const examples = results.filter(result => result.mineDamageHits > 0).slice(0, 10).map(result => result.seed);
  console.log(`Graines avec dégâts à rejouer : ${examples.length ? examples.join(", ") : "aucune dans cet échantillon"}`);

  if (values.output) {
    const report = { reportVersion: 1, measuredAt: new Date().toISOString(), config: { games, start, maxLogicalMs }, summary, results };
    writeFileSync(values.output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
    console.log(`Rapport JSON : ${values.output}`);
  }
} finally {
  await server.close();
}
