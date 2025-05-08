[Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:39 [Scene] Initializing bot...
fsmLogger.js:96 🔵 INFO [08:29:42] Initializing bot FSM
fsmLogger.js:96 🟢 STATE [08:29:42] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:42] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:42] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:42] Bot initialized in IDLE state
ShipMovement.jsx:116 Setting initial position: {x: -3.6, y: 0, z: 0}
ShipMovement.jsx:116 Setting initial position: {x: 1.8, y: 0, z: -3.117691453623979}
fsmLogger.js:96 🟠 ACTION [08:29:42] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:42] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:42] No specific conditions met in IDLE evaluation, changing to EXPLORING state
fsmLogger.js:89 🟢 STATE [08:29:43] Transition: idle → exploring {targetState: null, timestamp: '2025-05-08T06:29:43.000Z'}
fsmLogger.js:96 🟢 STATE [08:29:43] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [08:29:43] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:43] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [08:29:43] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:43] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:43] Completed action: evaluateIdle {priority: 3, elapsed: 978}
fsmLogger.js:96 🟣 CONDITION [08:29:44] Checking conditions in state: exploring
fsmLogger.js:96 🟠 ACTION [08:29:44] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:44] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:44] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:44] Found 20 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:44] Sending drone to explore tile: F1, distance: 0.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:96 🟠 ACTION [08:29:44] Exploration action complete, returning to IDLE for re-evaluation
fsmLogger.js:89 🟢 STATE [08:29:44] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T06:29:44.011Z'}
fsmLogger.js:96 🟢 STATE [08:29:44] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:44] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T06:29:44.011Z'}
fsmLogger.js:96 🟢 STATE [08:29:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:44] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:44] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:44] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:44] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:44] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:29:45] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:45] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:45] No specific conditions met in IDLE evaluation, changing to EXPLORING state
fsmLogger.js:89 🟢 STATE [08:29:45] Transition: idle → exploring {targetState: null, timestamp: '2025-05-08T06:29:45.015Z'}
fsmLogger.js:96 🟢 STATE [08:29:45] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [08:29:45] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:45] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [08:29:45] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:45] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:45] Completed action: evaluateIdle {priority: 3, elapsed: 1006}
fsmLogger.js:96 🟣 CONDITION [08:29:46] Checking conditions in state: exploring
fsmLogger.js:96 🟠 ACTION [08:29:46] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:46] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:46] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:46] Found 19 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:46] Sending drone to explore tile: E1, distance: 1.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: E1
fsmLogger.js:96 🟠 ACTION [08:29:46] Exploration action complete, returning to IDLE for re-evaluation
fsmLogger.js:89 🟢 STATE [08:29:46] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T06:29:46.026Z'}
fsmLogger.js:96 🟢 STATE [08:29:46] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:46] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T06:29:46.026Z'}
fsmLogger.js:96 🟢 STATE [08:29:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:46] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:46] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:46] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:46] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:46] Completed action: evaluateIdle {priority: 3, elapsed: 1}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at E1: {food: 73, debris: 742, special: 1}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 4
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [08:29:47] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:47] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:47] 1 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:47] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:47.031Z'}
fsmLogger.js:96 🟢 STATE [08:29:47] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:47] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:47] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:47] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:47] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:47] Completed action: evaluateIdle {priority: 3, elapsed: 1007}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [08:29:48] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:48] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:48] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:48] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:48] Found 18 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:48] Sending drone to explore tile: F0, distance: 1.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: F0
fsmLogger.js:96 🟣 CONDITION [08:29:48] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:48] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:48.042Z'}
fsmLogger.js:96 🟢 STATE [08:29:48] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:48] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:48.042Z'}
fsmLogger.js:96 🟢 STATE [08:29:48] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:48] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:48] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:48] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:48] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:48] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:48] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at F0: {food: 41, debris: 3878, special: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:29:49] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:49] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:49] 2 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:49] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:49.049Z'}
fsmLogger.js:96 🟢 STATE [08:29:49] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:49] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:49] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:49] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:49] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:49] Completed action: evaluateIdle {priority: 3, elapsed: 1007}
fsmLogger.js:96 🟣 CONDITION [08:29:50] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:50] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:50] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:50] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:50] Found 17 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:50] Sending drone to explore tile: F2, distance: 1.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: F2
fsmLogger.js:96 🟣 CONDITION [08:29:50] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:50] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:50.059Z'}
fsmLogger.js:96 🟢 STATE [08:29:50] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:50] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:50.059Z'}
fsmLogger.js:96 🟢 STATE [08:29:50] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:50] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:50] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:50] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:50] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:50] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:50] Completed action: evaluateIdle {priority: 3, elapsed: 0}
fsmLogger.js:96 🟠 ACTION [08:29:51] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:51] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:51] 2 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:51] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:51.057Z'}
fsmLogger.js:96 🟢 STATE [08:29:51] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:51] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:51] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:51] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:51] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:51] Completed action: evaluateIdle {priority: 3, elapsed: 999}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at F2: {food: 33, debris: 7187, special: 1}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:29:52] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:52] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:52] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:52] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:52] Found 16 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:52] Sending drone to explore tile: G0, distance: 1.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: G0
fsmLogger.js:96 🟣 CONDITION [08:29:52] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:52] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:52.067Z'}
fsmLogger.js:96 🟢 STATE [08:29:52] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:52] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:52.067Z'}
fsmLogger.js:96 🟢 STATE [08:29:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:52] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:52] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:52] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:52] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:52] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:29:53] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:53] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:53] 3 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:53] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:53.065Z'}
fsmLogger.js:96 🟢 STATE [08:29:53] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:53] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:53] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:53] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:53] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:53] Completed action: evaluateIdle {priority: 3, elapsed: 999}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at G0: {food: 39, debris: 1242, special: 2}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 10
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:29:54] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:54] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:54] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:54] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:54] Found 15 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:54] Sending drone to explore tile: G1, distance: 1.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: G1
fsmLogger.js:96 🟣 CONDITION [08:29:54] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:54] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:54.075Z'}
fsmLogger.js:96 🟢 STATE [08:29:54] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:54] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:54.075Z'}
fsmLogger.js:96 🟢 STATE [08:29:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:54] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:54] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:54] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:54] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:54] Completed action: evaluateIdle {priority: 3, elapsed: 1}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:29:55] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:55] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:55] 4 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:55] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:55.081Z'}
fsmLogger.js:96 🟢 STATE [08:29:55] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:55] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:55] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:55] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:55] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:55] Completed action: evaluateIdle {priority: 3, elapsed: 1007}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at G1: {food: 47, debris: 9765, special: 1}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 12
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:29:56] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:56] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:56] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:56] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:56] Found 14 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:56] Sending drone to explore tile: D1, distance: 2.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: D1
fsmLogger.js:96 🟣 CONDITION [08:29:56] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:56] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:56.093Z'}
fsmLogger.js:96 🟢 STATE [08:29:56] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:56] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:56.093Z'}
fsmLogger.js:96 🟢 STATE [08:29:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:56] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:56] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:56] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:56] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:56] Completed action: evaluateIdle {priority: 3, elapsed: 1}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:29:57] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:29:57] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:29:57] 5 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:29:57] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:29:57.098Z'}
fsmLogger.js:96 🟢 STATE [08:29:57] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:29:57] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:29:57] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:29:57] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:57] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:57] Completed action: evaluateIdle {priority: 3, elapsed: 1006}
fsmLogger.js:96 🟣 CONDITION [08:29:58] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:58] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:58] Drone is already moving or not available
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at D1: {food: 66, debris: 5165, special: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 14
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:29:59] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:29:59] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:29:59] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:29:59] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:29:59] Found 13 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:29:59] Sending drone to explore tile: D2, distance: 2.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: D2
fsmLogger.js:96 🟣 CONDITION [08:29:59] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:29:59] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:59.117Z'}
fsmLogger.js:96 🟢 STATE [08:29:59] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:29:59] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:29:59.117Z'}
fsmLogger.js:96 🟢 STATE [08:29:59] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:59] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:59] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:29:59] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:29:59] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:29:59] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:29:59] Completed action: evaluateIdle {priority: 3, elapsed: 1}
fsmLogger.js:96 🟠 ACTION [08:30:00] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:30:00] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:30:00] 6 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:30:00] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:30:00.123Z'}
fsmLogger.js:96 🟢 STATE [08:30:00] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:30:00] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:30:00] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:30:00] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:00] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:00] Completed action: evaluateIdle {priority: 3, elapsed: 1006}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [08:30:01] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:01] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:01] Drone is already moving or not available
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at D2: {food: 14, debris: 2970, special: 2}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 16
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:30:02] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:02] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:02] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:30:02] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:30:02] Found 12 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:30:02] Sending drone to explore tile: E0, distance: 2.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: E0
fsmLogger.js:96 🟣 CONDITION [08:30:02] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:30:02] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:02.134Z'}
fsmLogger.js:96 🟢 STATE [08:30:02] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:30:02] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:02.134Z'}
fsmLogger.js:96 🟢 STATE [08:30:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:02] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:02] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:30:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:02] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:02] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:02] Completed action: evaluateIdle {priority: 3, elapsed: 1}
fsmLogger.js:96 🟠 ACTION [08:30:03] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:30:03] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:30:03] 7 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:30:03] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:30:03.140Z'}
fsmLogger.js:96 🟢 STATE [08:30:03] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:30:03] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:30:03] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:30:03] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:03] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:03] Completed action: evaluateIdle {priority: 3, elapsed: 1006}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟣 CONDITION [08:30:04] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:04] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:04] Drone is already moving or not available
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at E0: {food: 62, debris: 4812, special: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 18
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:30:05] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:05] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:05] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:30:05] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:30:05] Found 11 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:30:05] Sending drone to explore tile: E3, distance: 2.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: E3
fsmLogger.js:96 🟣 CONDITION [08:30:05] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:30:05] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:05.157Z'}
fsmLogger.js:96 🟢 STATE [08:30:05] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:30:05] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:05.157Z'}
fsmLogger.js:96 🟢 STATE [08:30:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:05] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:05] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:30:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:05] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:05] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:05] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [08:30:06] Execute: evaluateIdle (priority: 3)
fsmLogger.js:96 🟠 ACTION [08:30:06] Evaluating conditions from IDLE state
fsmLogger.js:96 🟣 CONDITION [08:30:06] 8 resources available, changing to COLLECTING state
fsmLogger.js:89 🟢 STATE [08:30:06] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T06:30:06.156Z'}
fsmLogger.js:96 🟢 STATE [08:30:06] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [08:30:06] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [08:30:06] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [08:30:06] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:06] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:06] Completed action: evaluateIdle {priority: 3, elapsed: 1000}
fsmLogger.js:96 🟣 CONDITION [08:30:07] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:07] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:07] Drone is already moving or not available
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at E3: {food: 56, debris: 8785, special: 2}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 20
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [08:30:08] Checking conditions in state: collecting
fsmLogger.js:96 🟠 ACTION [08:30:08] Execute: exploreDrone (priority: 2)
fsmLogger.js:96 🟠 ACTION [08:30:08] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [08:30:08] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [08:30:08] Found 10 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [08:30:08] Sending drone to explore tile: F3, distance: 2.00
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: F3
fsmLogger.js:96 🟣 CONDITION [08:30:08] Exploration count reached threshold and resources found, returning to IDLE
fsmLogger.js:89 🟢 STATE [08:30:08] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:08.175Z'}
fsmLogger.js:96 🟢 STATE [08:30:08] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:89 🟢 STATE [08:30:08] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T06:30:08.175Z'}
fsmLogger.js:96 🟢 STATE [08:30:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:08] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:08] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:96 🟢 STATE [08:30:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [08:30:08] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [08:30:08] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:89 🟠 ACTION [08:30:08] Completed action: evaluateIdle {priority: 3, elapsed: 0}