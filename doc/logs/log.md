⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/__tests__/botActions.test.js [ src/__tests__/botActions.test.js ]
Error: Expression expected
 ❯ getRollupError node_modules/rollup/dist/es/shared/parseAst.js:397:41
 ❯ convertProgram node_modules/rollup/dist/es/shared/parseAst.js:1085:26
 ❯ parseAstAsync node_modules/rollup/dist/es/shared/parseAst.js:2071:106
 ❯ ssrTransformScript node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:52390:11

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/__tests__/playerFactory.test.js [ src/__tests__/playerFactory.test.js ]
Error: Failed to resolve import "../factories/playerFactory.js" from "src/__tests__/playerFactory.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: /home/fanch/Documents/jff/react-three-vite/src/__tests__/playerFactory.test.js:2:31
  1  |  import { describe, it, expect } from 'vitest';
  2  |  import { createPlayer } from '../factories/playerFactory.js';
     |                                ^
  3  |  import { getMainShipId, getHumanPlayerId, VEHICLE_TYPES } from '../ai/constants/playerConstants.js';
  4  |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:64241:23
 ❯ node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:64373:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:64300:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-DbT5NFX0.js:51938:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 9 passed (11)
      Tests  172 passed (172)
   Start at  12:58:00
   Duration  3.55s (transform 1.61s, setup 0ms, collect 2.92s, tests 311ms, environment 11.97s, prepare 1.57s)

 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
Cancelling test run. Press CTRL+c again to exit forcefully.