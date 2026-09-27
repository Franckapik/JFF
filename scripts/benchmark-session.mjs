import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { Session } from "node:inspector";
import os from "node:os";
import { parseArgs } from "node:util";
import { createServer } from "vite";

const { values } = parseArgs({ options: {
  games: { type: "string", default: "40" },
  output: { type: "string", default: "report.session-performance.json" },
} });
const games = Number(values.games);
assert.ok(Number.isInteger(games) && games >= 10 && games <= 500, "--games must be between 10 and 500");
assert.equal(typeof global.gc, "function", "Run with node --expose-gc");
const server = await createServer({ configFile: false, cacheDir: "node_modules/.vite-benchmark", optimizeDeps: { noDiscovery: true, entries: [] }, server: { middlewareMode: true, watch: null }, appType: "custom", logLevel: "error" });
const inspector = new Session();
const post = (method, params = {}) => new Promise((resolve, reject) => inspector.post(method, params, (error, result) => error ? reject(error) : resolve(result)));

try {
  const { GameSession } = await server.ssrLoadModule("/src/engine/session.ts");
  const { generateWorld } = await server.ssrLoadModule("/src/engine/world.ts");
  const play = seed => {
    const session = new GameSession(seed);
    try {
      session.advance(1000000);
      session.assertInvariants();
      assert.equal(session.getSnapshot().phase, "finished", `Unfinished seed ${seed}`);
    } finally { session.stop(); }
  };
  for (let seed = 0; seed < 5; seed++) play(seed);
  const timings = [];
  for (const radius of [3, 8]) {
    const session = new GameSession(42, { world: generateWorld(42, radius) });
    const durations = [];
    let maxBytes = 0;
    let snapshot;
    let eventSequence = 0;
    try {
      for (let tick = 0; tick < 20000; tick++) {
        const started = performance.now();
        session.advance(100);
        session.assertInvariants();
        snapshot = session.getSnapshot(eventSequence);
        eventSequence = snapshot.eventSequence;
        maxBytes = Math.max(maxBytes, Buffer.byteLength(JSON.stringify(snapshot)));
        durations.push(performance.now() - started);
        if (snapshot.phase === "finished") break;
      }
      assert.equal(snapshot.phase, "finished");
      durations.sort((left, right) => left - right);
      const percentile = fraction => durations[Math.min(durations.length - 1, Math.floor(durations.length * fraction))];
      timings.push({ tiles: Object.keys(snapshot.world).length, ticks: durations.length, logicalMs: snapshot.elapsed,
        maxSnapshotBytes: maxBytes, tickP50Ms: percentile(0.5), tickP95Ms: percentile(0.95), tickMaxMs: percentile(1),
        budget: { snapshotLimitBytes: radius === 3 ? 32768 : 65536, p95LimitMs: radius === 3 ? 5 : 10,
          passed: maxBytes < (radius === 3 ? 32768 : 65536) && percentile(0.95) < (radius === 3 ? 5 : 10) } });
    } finally { session.stop(); }
  }
  global.gc();
  const heapSamples = [{ games: 0, heapUsed: process.memoryUsage().heapUsed }];
  const memoryStart = performance.now();
  for (let index = 0; index < games; index++) {
    play(index);
    if ((index + 1) % 10 === 0 || index + 1 === games) {
      global.gc();
      heapSamples.push({ games: index + 1, heapUsed: process.memoryUsage().heapUsed });
    }
  }
  const memoryWallMs = performance.now() - memoryStart;
  inspector.connect();
  await post("HeapProfiler.enable");
  await post("HeapProfiler.startSampling", { samplingInterval: 32768, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  for (let seed = 0; seed < 10; seed++) play(seed);
  const { profile } = await post("HeapProfiler.stopSampling");
  const allocations = new Map();
  const visit = node => {
    const frame = node.callFrame;
    const location = `${frame.functionName || "(anonymous)"} ${frame.url.replace(process.cwd(), "<workspace>")}:${frame.lineNumber + 1}`;
    allocations.set(location, (allocations.get(location) ?? 0) + node.selfSize);
    for (const child of node.children) visit(child);
  };
  visit(profile.head);
  const report = {
    measuredAt: new Date().toISOString(), node: process.version, platform: `${os.platform()} ${os.arch()}`, cpu: os.cpus()[0]?.model,
    methodology: { tick: "100 logical ms + invariants + incremental-event snapshot clone + JSON serialization; seed 42; sampling disabled",
      memory: "Sequential complete games, actors stopped, GC after each batch; retained heap, not total allocation rate",
      allocation: "Separate run of 10 games; V8 sampling at 32 KiB including collected objects; statistical estimate, not exact byte accounting; locations are transformed SSR frames, not source lines" },
    timings, memory: { games, wallMs: memoryWallMs, samples: heapSamples,
      retainedDeltaBytes: heapSamples[heapSamples.length - 1].heapUsed - heapSamples[0].heapUsed },
    allocation: { sampledBytes: [...allocations.values()].reduce((total, bytes) => total + bytes, 0),
      top: [...allocations].sort((left, right) => right[1] - left[1]).slice(0, 15).map(([location, bytes]) => ({ location, bytes })) },
  };
  writeFileSync(values.output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${values.output}`);
} finally {
  inspector.disconnect();
  await server.close();
}