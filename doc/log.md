Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:39 [Scene] Initializing bot...
fsmLogger.js:96 🔵 INFO [23:05:38] Initializing bot FSM
fsmLogger.js:96 🟢 STATE [23:05:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:05:38] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:05:38] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [23:05:38] Bot initialized in IDLE state
ShipMovement.jsx:117 Setting initial position: {x: -1.8, y: 0, z: -3.117691453623979}
ShipMovement.jsx:117 Setting initial position: {x: 0.9, y: 0, z: 1.5588457268119895}
fsmLogger.js:96 🟠 ACTION [23:05:39] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:05:39] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:05:39] No specific conditions met in IDLE evaluation, changing to EXPLORING state
fsmLogger.js:89 🟢 STATE [23:05:39] Transition: idle → exploring {targetState: null, timestamp: '2025-05-08T21:05:39.044Z'}
fsmLogger.js:96 🟢 STATE [23:05:39] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [23:05:39] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:05:39] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [23:05:39] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:05:39] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:05:39] Completed action: evaluateIdle {priority: 3, elapsed: 971}
fsmLogger.js:96 🟣 CONDITION [23:05:40] Checking conditions in state: exploring
fsmLogger.js:96 🟠 ACTION [23:05:40] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:40] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:05:40] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:05:40] Found 24 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:05:40] Sending drone to explore tile: D4, distance: 0.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: D4
fsmLogger.js:89 🟠 ACTION [23:05:40] Completed action: exploreDrone {priority: 2, elapsed: 1010}
fsmLogger.js:96 🟣 CONDITION [23:05:41] Checking conditions in state: exploring
fsmLogger.js:96 🟠 ACTION [23:05:41] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:41] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:41] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:41] Completed action: exploreDrone {priority: 2, elapsed: 2015}
UnifiedDroneMovement.jsx:315 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:191 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [23:05:42] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:42] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:42] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:42] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:05:42] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:05:42] Found 23 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:05:42] Sending drone to explore tile: C4, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: C4
fsmLogger.js:89 🟠 ACTION [23:05:42] Completed action: exploreDrone {priority: 2, elapsed: 2}
fsmLogger.js:96 🟣 CONDITION [23:05:43] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:43] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:43] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:43] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:43] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:43] Completed action: exploreDrone {priority: 2, elapsed: 1}
fsmLogger.js:96 🟣 CONDITION [23:05:44] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:44] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:44] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:44] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:44] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:44] Completed action: exploreDrone {priority: 2, elapsed: 1}
UnifiedDroneMovement.jsx:245 [UnifiedDroneMovement] Bot drone discovered new resources at C4: {food: 71, debris: 9397, special: 0}
UnifiedDroneMovement.jsx:266 [UnifiedDroneMovement] Resources found, checking conditions for state transition
UnifiedDroneMovement.jsx:315 [UnifiedDroneMovement] Bot exploration count increased to 4
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:269 [UnifiedDroneMovement] Executing checkConditions after finding resources
UnifiedDroneMovement.jsx:272 [UnifiedDroneMovement] Current bot state before check: exploring
UnifiedDroneMovement.jsx:279 [UnifiedDroneMovement] hasDiscoveredResources result: {result: false, priority: 2, state: null, action: null}
fsmLogger.js:96 🟣 CONDITION [23:05:44] Checking conditions in state: exploring
fsmLogger.js:96 🟣 CONDITION [23:05:45] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:45] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:45] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:45] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:05:45] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:05:45] Found 22 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:05:45] Sending drone to explore tile: C5, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: C5
fsmLogger.js:89 🟠 ACTION [23:05:45] Completed action: exploreDrone {priority: 2, elapsed: 2}
fsmLogger.js:96 🟣 CONDITION [23:05:46] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:46] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:46] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:46] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:46] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:46] Completed action: exploreDrone {priority: 2, elapsed: 0}
UnifiedDroneMovement.jsx:191 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [23:05:47] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:47] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:47] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:47] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:47] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:47] Completed action: exploreDrone {priority: 2, elapsed: 1}
fsmLogger.js:96 🟣 CONDITION [23:05:48] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:48] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:48] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:48] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:48] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:48] Completed action: exploreDrone {priority: 2, elapsed: 0}
fsmLogger.js:96 🟣 CONDITION [23:05:49] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:49] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:49] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:49] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:49] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:49] Completed action: exploreDrone {priority: 2, elapsed: 1}
fsmLogger.js:96 🟣 CONDITION [23:05:50] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:50] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:50] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:50] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:50] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:50] Completed action: exploreDrone {priority: 2, elapsed: 1}
UnifiedDroneMovement.jsx:245 [UnifiedDroneMovement] Bot drone discovered new resources at C5: {food: 47, debris: 2866, special: 2}
UnifiedDroneMovement.jsx:266 [UnifiedDroneMovement] Resources found, checking conditions for state transition
UnifiedDroneMovement.jsx:315 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:269 [UnifiedDroneMovement] Executing checkConditions after finding resources
UnifiedDroneMovement.jsx:272 [UnifiedDroneMovement] Current bot state before check: exploring
UnifiedDroneMovement.jsx:279 [UnifiedDroneMovement] hasDiscoveredResources result: {result: false, priority: 2, state: null, action: null}
fsmLogger.js:96 🟣 CONDITION [23:05:50] Checking conditions in state: exploring
fsmLogger.js:96 🟣 CONDITION [23:05:51] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:51] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:51] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:51] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:05:51] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:05:51] Found 21 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:05:51] Sending drone to explore tile: D3, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: D3
fsmLogger.js:89 🟠 ACTION [23:05:51] Completed action: exploreDrone {priority: 2, elapsed: 2}
fsmLogger.js:96 🟣 CONDITION [23:05:52] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:52] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:52] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:52] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:52] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:52] Completed action: exploreDrone {priority: 2, elapsed: 1}
fsmLogger.js:96 🟣 CONDITION [23:05:53] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:53] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:53] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:53] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:53] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:53] Completed action: exploreDrone {priority: 2, elapsed: 1}
UnifiedDroneMovement.jsx:191 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [23:05:54] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:54] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:54] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:54] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:54] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:54] Completed action: exploreDrone {priority: 2, elapsed: 1}
fsmLogger.js:96 🟣 CONDITION [23:05:55] Checking conditions in state: exploring
fsmLogger.js:89 🟠 ACTION [23:05:55] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:55] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:55] Drone is already moving or not available, skipping exploration
fsmLogger.js:96 🟠 ACTION [23:05:55] Drone is currently moving, waiting for it to reach target
fsmLogger.js:89 🟠 ACTION [23:05:55] Completed action: exploreDrone {priority: 2, elapsed: 0}
UnifiedDroneMovement.jsx:245 [UnifiedDroneMovement] Bot drone discovered new resources at D3: {food: 24, debris: 1954, special: 2}
UnifiedDroneMovement.jsx:266 [UnifiedDroneMovement] Resources found, checking conditions for state transition
UnifiedDroneMovement.jsx:315 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [23:05:56] Checking conditions in state: exploring
botConditions.js:225 [BotConditions] Enough resources discovered, returning to IDLE
fsmLogger.js:89 🟣 CONDITION [23:05:56] Evaluate: checkAllConditions = TRUE {currentState: 'exploring', targetState: 'idle', botStats: {…}}
fsmLogger.js:96 🟢 STATE [23:05:56] Returning to IDLE state: Condition met: {"result":true,"state":"idle"}
fsmLogger.js:89 🟢 STATE [23:05:56] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T21:05:56.160Z'}
fsmLogger.js:96 🟢 STATE [23:05:56] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [23:05:56] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T21:05:56.160Z'}
fsmLogger.js:96 🟢 STATE [23:05:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:05:56] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:05:56] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [23:05:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:05:56] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:05:56] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:05:56] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:05:56] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:05:56] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [23:05:56] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T21:05:56.161Z'}
fsmLogger.js:96 🟢 STATE [23:05:56] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:05:56] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:05:56] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:05:56] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:05:56] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:05:56] Completed action: evaluateIdle {priority: 3, elapsed: 1}
UnifiedDroneMovement.jsx:269 [UnifiedDroneMovement] Executing checkConditions after finding resources
UnifiedDroneMovement.jsx:272 [UnifiedDroneMovement] Current bot state before check: collecting
UnifiedDroneMovement.jsx:279 [UnifiedDroneMovement] hasDiscoveredResources result: {result: true, priority: 2, state: 'collecting', action: {…}}
UnifiedDroneMovement.jsx:283 [UnifiedDroneMovement] Forcing state change to collecting
UnifiedDroneMovement.jsx:288 [UnifiedDroneMovement] Adding action collect
fsmLogger.js:89 🟠 ACTION [23:05:56] Adding action to queue: collect {priority: 3, params: {…}}
fsmLogger.js:96 🟣 CONDITION [23:05:57] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:05:57] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:05:57] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:05:57] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:05:57] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:05:57] Completed action: evaluateIdle {priority: 3, elapsed: 1008}
UnifiedDroneMovement.jsx:191 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [23:05:58] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:05:58] Execute: collect (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:05:58] Starting moveToKnownResource with vehicle at D4, moving: false
fsmLogger.js:96 🔵 INFO [23:05:58] Examining 3 known resources
fsmLogger.js:96 🔵 INFO [23:05:58] Found 3 valid resources
fsmLogger.js:96 🔵 INFO [23:05:58] Resource at C4 has value: 11347.40
fsmLogger.js:96 🔵 INFO [23:05:58] Resource at C5 has value: 3496.20
fsmLogger.js:96 🔵 INFO [23:05:58] Resource at D3 has value: 2378.80
fsmLogger.js:96 🟠 ACTION [23:05:58] Moving to best resource at: C4 with value: 11347.40
fsmLogger.js:96 🔵 INFO [23:05:58] Calling moveToTile with target: C4
fsmLogger.js:89 🟠 ACTION [23:05:58] Completed action: collect {priority: 3, elapsed: 1833}
fsmLogger.js:96 🟠 ACTION [23:05:58] Now executing delayed moveToTile to C4
usePlayerStore.js:285 [PlayerStore] Moving player2/ship to tile: C4
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: C4
ShipMovement.jsx:102 Calculating path for player2 from D4 to C4
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:96 🟣 CONDITION [23:05:59] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:05:59] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:05:59] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:00] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:00] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:00] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:01] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:01] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:01] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:02] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:02] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:02] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:03] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:03] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:03] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:04] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:04] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:04] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:05] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:05] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:05] Bot vehicle is moving, cannot proceed with collection
fsmLogger.js:96 🟣 CONDITION [23:06:06] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:06] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:06] Bot vehicle is moving, cannot proceed with collection
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to C4
fsmLogger.js:96 🟣 CONDITION [23:06:07] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:07] Execute: collect (priority: 2)
fsmLogger.js:96 🟠 ACTION [23:06:07] Starting moveToKnownResource with vehicle at C4, moving: false
fsmLogger.js:96 🟠 ACTION [23:06:07] Collecting resources at current tile: C4
fsmLogger.js:96 🔵 INFO [23:06:07] Added collected resource at C4 to memory
fsmLogger.js:89 🟠 ACTION [23:06:07] Completed action: collect {priority: 2, elapsed: 11064}
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
usePlayerStore.js:374 player2/ship est à sa capacité maximale.
fsmLogger.js:96 🟣 CONDITION [23:06:08] Checking conditions in state: collecting
botConditions.js:243 [BotConditions] Maximum capacity reached in COLLECTING state, returning to IDLE
fsmLogger.js:89 🟣 CONDITION [23:06:08] Evaluate: checkAllConditions = TRUE {currentState: 'collecting', targetState: 'idle', botStats: {…}}
fsmLogger.js:96 🟢 STATE [23:06:08] Returning to IDLE state: Condition met: {"result":true,"state":"idle"}
fsmLogger.js:89 🟢 STATE [23:06:08] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T21:06:08.235Z'}
fsmLogger.js:96 🟢 STATE [23:06:08] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [23:06:08] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T21:06:08.236Z'}
fsmLogger.js:96 🟢 STATE [23:06:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:06:08] Bot status: Fuel=95, At base=true
fsmLogger.js:89 🟠 ACTION [23:06:08] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [23:06:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:06:08] Bot status: Fuel=95, At base=true
fsmLogger.js:89 🟠 ACTION [23:06:08] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:06:08] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:08] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:06:08] Maximum capacity reached in IDLE evaluation, returning to base
fsmLogger.js:89 🟢 STATE [23:06:08] Transition: idle → returning {targetState: null, timestamp: '2025-05-08T21:06:08.237Z'}
fsmLogger.js:96 🟢 STATE [23:06:08] Exiting IDLE state, transitioning to returning
fsmLogger.js:96 🔵 INFO [23:06:08] Transition details: Fuel=95, Resources={"food":71,"debris":1000,"special":0}
fsmLogger.js:96 🟢 STATE [23:06:08] Entering RETURNING state
fsmLogger.js:89 🟠 ACTION [23:06:08] Adding action to queue: returnToBase {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:08] Adding action to queue: returnToBase {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:08] Completed action: evaluateIdle {priority: 3, elapsed: 2}
fsmLogger.js:96 🟣 CONDITION [23:06:09] Checking conditions in state: returning
botConditions.js:261 [BotConditions] Reached base in RETURNING state, returning to IDLE
fsmLogger.js:89 🟣 CONDITION [23:06:09] Evaluate: checkAllConditions = TRUE {currentState: 'returning', targetState: 'idle', botStats: {…}}
fsmLogger.js:96 🟢 STATE [23:06:09] Returning to IDLE state: Condition met: {"result":true,"state":"idle"}
fsmLogger.js:89 🟢 STATE [23:06:09] Transition: returning → idle {targetState: null, timestamp: '2025-05-08T21:06:09.242Z'}
fsmLogger.js:96 🟢 STATE [23:06:09] Transferring resources to score before exiting RETURNING state
fsmLogger.js:96 🟢 STATE [23:06:09] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [23:06:09] Transition: returning → idle {targetState: null, timestamp: '2025-05-08T21:06:09.243Z'}
fsmLogger.js:96 🟢 STATE [23:06:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:06:09] Bot status: Fuel=95, At base=true
fsmLogger.js:89 🟠 ACTION [23:06:09] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [23:06:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:06:09] Bot status: Fuel=95, At base=true
fsmLogger.js:89 🟠 ACTION [23:06:09] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟠 ACTION [23:06:09] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:09] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:06:09] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [23:06:09] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T21:06:09.244Z'}
fsmLogger.js:96 🟢 STATE [23:06:09] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:06:09] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:06:09] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:06:09] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:09] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:09] Completed action: evaluateIdle {priority: 3, elapsed: 1007}
fsmLogger.js:96 🟣 CONDITION [23:06:10] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:10] Execute: returnToBase (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:10] Already at base
fsmLogger.js:89 🟠 ACTION [23:06:10] Adding action to queue: refuel {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:10] Completed action: returnToBase {priority: 3, elapsed: 2014}
fsmLogger.js:96 🟣 CONDITION [23:06:11] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:11] Execute: returnToBase (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:11] Already at base
fsmLogger.js:89 🟠 ACTION [23:06:11] Adding action to queue: refuel {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:11] Completed action: returnToBase {priority: 3, elapsed: 3022}
fsmLogger.js:96 🟣 CONDITION [23:06:12] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:12] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:12] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:06:12] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:06:12] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:12] Completed action: evaluateIdle {priority: 3, elapsed: 3024}
fsmLogger.js:96 🟣 CONDITION [23:06:13] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [23:06:13] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [23:06:13] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [23:06:13] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:06:13] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [23:06:13] Completed action: evaluateIdle {priority: 3, elapsed: 4033}
