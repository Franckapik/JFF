Scene.jsx:26 [Scene] Initializing tiles...
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:38 [Scene] Initializing bot...
fsmLogger.js:96 🔵 INFO [22:51:14] Initializing bot FSM
fsmLogger.js:96 🟢 STATE [22:51:14] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:14] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:51:14] Adding action to queue: testQueue {priority: 4}
fsmLogger.js:89 🟠 ACTION [22:51:14] Adding action to queue: exploreDrone {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:51:14] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:96 🟢 STATE [22:51:14] Bot initialized in IDLE state with testQueue action
ShipMovement.jsx:117 Setting initial position: {x: -2.7, y: 0, z: -1.5588457268119895}
ShipMovement.jsx:117 Setting initial position: {x: -1.8, y: 0, z: 0}
App.jsx:24 [App] Starting bot processing with setInterval
fsmLogger.js:96 🟠 ACTION [22:51:15] Execute: Start: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:15] Starting test queue action - Will complete in 5 seconds
fsmLogger.js:96 🟠 ACTION [22:51:16] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:16] Test queue action in progress: 1.0s / 5s
fsmLogger.js:96 🟠 ACTION [22:51:17] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:18] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:19] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:20] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:21] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:21] Test queue action completed after 6.0 seconds
fsmLogger.js:89 🟠 ACTION [22:51:21] completed action: testQueue {elapsed: 7013}
fsmLogger.js:96 🟠 ACTION [22:51:22] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:22] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:51:22] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:51:22] Found 24 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:51:22] Sending drone to explore tile: C3, distance: 0.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: C3
fsmLogger.js:96 🟠 ACTION [22:51:22] Exploration started at 22:51:22
fsmLogger.js:96 🟠 ACTION [22:51:23] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:23] Exploration in progress: 1.0s elapsed
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:51:24] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:24] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:89 🟠 ACTION [22:51:24] completed action: exploreDrone {elapsed: 10013}
fsmLogger.js:96 🟠 ACTION [22:51:25] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:25] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:51:25] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:51:25] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:51:25] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:51:25] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:51:25] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:51:25] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:51:25] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:51:26] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:51:26] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:26] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:51:26] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:51:26] Found 23 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:51:26] Sending drone to explore tile: B3, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: B3
fsmLogger.js:96 🟠 ACTION [22:51:26] Exploration started at 22:51:26
fsmLogger.js:96 🟠 ACTION [22:51:27] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:27] Exploration in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:28] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:28] Exploration in progress: 2.0s elapsed
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at B3: {food: 36, debris: 3546, special: 1}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 4
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [22:51:29] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:30] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:51:31] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:31] Drone has returned to ship, exploration sequence fully complete after 5.0s
fsmLogger.js:96 🟢 STATE [22:51:31] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:31] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:51:31] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:31] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:31] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:51:31] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:31] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:51:32] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:51:32] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:32] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:51:32] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:51:32] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:51:32] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:51:32] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:51:32] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:51:32] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:51:32] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:51:33] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:51:33] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:33] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:51:33] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:51:33] Found 22 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:51:33] Sending drone to explore tile: B4, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: B4
fsmLogger.js:96 🟠 ACTION [22:51:33] Exploration started at 22:51:33
fsmLogger.js:96 🟠 ACTION [22:51:34] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:34] Exploration in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:35] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:35] Exploration in progress: 2.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:36] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at B4: {food: 66, debris: 2867, special: 2}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [22:51:37] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:38] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:39] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:40] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:51:41] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:41] Drone has returned to ship, exploration sequence fully complete after 8.0s
fsmLogger.js:96 🟢 STATE [22:51:41] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:41] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:51:41] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:41] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:41] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:51:41] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:41] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:51:42] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:51:42] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:42] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:51:42] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:51:42] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:51:42] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:51:42] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:51:42] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:51:42] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:51:42] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:51:43] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:51:43] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:43] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:51:43] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:51:43] Found 21 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:51:43] Sending drone to explore tile: C2, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: C2
fsmLogger.js:96 🟠 ACTION [22:51:43] Exploration started at 22:51:43
fsmLogger.js:96 🟠 ACTION [22:51:44] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:44] Exploration in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:45] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:45] Exploration in progress: 2.0s elapsed
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [22:51:46] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:51:47] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:47] Exploration in progress: 4.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:47] Drone has returned to ship, exploration sequence fully complete after 4.0s
fsmLogger.js:96 🟢 STATE [22:51:47] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:47] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:51:47] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:47] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:47] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:51:47] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:47] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:51:48] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:51:48] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:48] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:51:48] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:51:48] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:51:48] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:51:48] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:51:48] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:51:48] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:51:48] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:51:49] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:51:49] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:49] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:51:49] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:51:49] Found 20 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:51:49] Sending drone to explore tile: C4, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: C4
fsmLogger.js:96 🟠 ACTION [22:51:49] Exploration started at 22:51:49
fsmLogger.js:96 🟠 ACTION [22:51:50] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:51] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:52] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:52] Exploration in progress: 3.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:53] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:53] Exploration in progress: 4.0s elapsed
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at C4: {food: 61, debris: 268, special: 1}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 10
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [22:51:54] Exit condition met in state exploring: transitioning to idle
fsmLogger.js:96 🟢 STATE [22:51:54] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:54] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:51:54] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:51:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:54] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:51:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:51:54] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:51:55] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:51:55] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:55] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:51:55] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [22:51:55] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [22:51:55] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [22:51:55] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:51:55] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [22:51:55] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:51:55] completed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:51:56] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:51:56] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:56] Moving to resource at B3, value: 7138, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/ship to tile: B3
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: B3
ShipMovement.jsx:102 Calculating path for player2 from C3 to B3
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:96 🟠 ACTION [22:51:57] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:57] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:51:58] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:58] Moving to resource in progress: 2.0s elapsed
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:51:59] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:51:59] Moving to resource in progress: 3.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:52:00] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:00] Moving to resource in progress: 4.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:52:01] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:01] Moving to resource in progress: 5.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:52:02] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:02] Moving to resource in progress: 6.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:52:03] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:03] Moving to resource in progress: 7.0s elapsed
fsmLogger.js:96 🟠 ACTION [22:52:04] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:04] Moving to resource in progress: 8.0s elapsed
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to B3
fsmLogger.js:96 🟠 ACTION [22:52:05] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:05] Bot has reached resource at B3 after 9.0s
fsmLogger.js:89 🟠 ACTION [22:52:05] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:05] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:06] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:06] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:06] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:06] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:07] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:07] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:07] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:07] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:08] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:08] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:08] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:08] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:09] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:09] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:09] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:09] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:10] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:10] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:10] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:10] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:11] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:11] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:11] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:11] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:12] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:12] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:12] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:12] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:13] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:13] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:13] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:13] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:14] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:14] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:14] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:14] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:15] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:15] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:15] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:15] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:16] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:16] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:16] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:16] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:17] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:17] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:17] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:17] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:18] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:18] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:18] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:18] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:19] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:19] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:19] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:19] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:20] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:20] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:20] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:20] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:21] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:21] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:21] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:21] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:22] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:22] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:22] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:22] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:23] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:23] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:23] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:23] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:24] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:24] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:24] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:24] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:25] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:25] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:25] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:25] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:26] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:26] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:26] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:26] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:27] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:27] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:27] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:27] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:28] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:28] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:28] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:28] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:29] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:29] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:29] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:29] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:30] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:30] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:30] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:30] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:31] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:31] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:31] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:31] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:32] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:32] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:32] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:32] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:33] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:33] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:33] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:33] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:34] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:34] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:34] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:34] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:35] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:35] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:35] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:35] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:36] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:36] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:36] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:36] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:37] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:37] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:37] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:37] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:38] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:38] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:38] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:38] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:39] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:39] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:39] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:39] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:40] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:40] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:40] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:40] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:41] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:41] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:41] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:41] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:42] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:42] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:42] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:42] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:43] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:43] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:43] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:43] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:44] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:44] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:44] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:44] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:45] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:45] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:45] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:45] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:46] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:46] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:46] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:46] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:47] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:47] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:47] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:47] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:48] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:48] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:48] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:48] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:49] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:49] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:49] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:49] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:50] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:50] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:50] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:50] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:51] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:51] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:51] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:51] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:52] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:52] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:52] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:52] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:53] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:53] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:53] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:53] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:54] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:54] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:54] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:54] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:55] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:55] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:55] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:55] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:56] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:56] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:56] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:56] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:57] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:57] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:57] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:57] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:52:58] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:58] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:58] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:58] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:52:59] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:52:59] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:52:59] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:52:59] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:00] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:00] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:00] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:00] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:01] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:01] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:01] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:01] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:02] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:02] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:02] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:02] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:03] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:03] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:03] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:03] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:04] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:04] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:04] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:04] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:05] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:05] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:05] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:05] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:06] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:06] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:06] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:06] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:07] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:07] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:07] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:07] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:08] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:08] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:08] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:08] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:09] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:09] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:09] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:09] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:10] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:10] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:10] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:10] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:11] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:11] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:11] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:11] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:12] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:12] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:12] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:12] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:13] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:13] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:13] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:13] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:14] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:14] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:14] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:14] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:15] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:15] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:15] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:15] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:16] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:16] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:16] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:16] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:17] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:17] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:17] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:17] completed action: collectResource {elapsed: 0}
fsmLogger.js:96 🟠 ACTION [22:53:18] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:18] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:18] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:18] completed action: collectResource {elapsed: 1}
fsmLogger.js:96 🟠 ACTION [22:53:19] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:53:19] Bot already at resource location B3, proceeding to collection
fsmLogger.js:89 🟠 ACTION [22:53:19] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:53:19] completed action: collectResource {elapsed: 0}
