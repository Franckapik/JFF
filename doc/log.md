Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:40 [Scene] Initializing bot...
fsmLogger.js:100 🔵 INFO [13:24:00] Initializing bot FSM
fsmLogger.js:100 🟢 STATE [13:24:00] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:00] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [13:24:00] Adding action to queue: testQueue {priority: 4}
fsmLogger.js:93 🟠 ACTION [13:24:00] Adding action to queue: exploreDrone {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:00] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [13:24:00] Bot initialized in IDLE state with testQueue action
fsmLogger.js:93 🚀 MOUVEMENT [13:24:00] [ShipMovement] Setting initial position for player1: {x: 0.9, y: 0, z: 1.5588457268119895}
fsmLogger.js:93 🚀 MOUVEMENT [13:24:00] [ShipMovement] Setting initial position for player2: {x: 2.7, y: 0, z: -1.5588457268119895}
App.jsx:24 [App] Starting bot processing with setInterval
fsmLogger.js:100 🟠 ACTION [13:24:01] Execute: Start: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:01] Starting test queue action - Will complete in 5 seconds
fsmLogger.js:100 🟠 ACTION [13:24:02] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:03] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:03] Test queue action completed after 2.0 seconds
fsmLogger.js:93 🟠 ACTION [13:24:03] completed action: testQueue {elapsed: 3012}
fsmLogger.js:100 🟠 ACTION [13:24:04] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:04] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [13:24:04] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [13:24:04] Found 22 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [13:24:04] Sending drone to explore tile: F2, distance: 0.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: F2
fsmLogger.js:100 🟠 ACTION [13:24:04] Exploration started at 13:24:04
fsmLogger.js:100 🚀 MOUVEMENT [13:24:04] [UnifiedDroneMovement] Bot exploration count increased to 2
fsmLogger.js:100 🚀 MOUVEMENT [13:24:04] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [13:24:05] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:05] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:93 🟠 ACTION [13:24:05] completed action: exploreDrone {elapsed: 5012}
fsmLogger.js:100 🟠 ACTION [13:24:06] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:06] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:24:06] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [13:24:06] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [13:24:06] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [13:24:06] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [13:24:06] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:24:06] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [13:24:07] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [13:24:07] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:07] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [13:24:07] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [13:24:07] Found 21 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [13:24:07] Sending drone to explore tile: E2, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: E2
fsmLogger.js:100 🟠 ACTION [13:24:07] Exploration started at 13:24:07
fsmLogger.js:93 🚀 MOUVEMENT [13:24:07] [UnifiedDroneMovement] Bot drone discovered new resources at E2: {food: 50, debris: 3405, special: 0}
fsmLogger.js:100 🚀 MOUVEMENT [13:24:07] [UnifiedDroneMovement] Bot exploration count increased to 4
fsmLogger.js:100 🟠 ACTION [13:24:08] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [13:24:08] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [13:24:09] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:09] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [13:24:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:09] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:24:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:09] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [13:24:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:09] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [13:24:10] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [13:24:10] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:10] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:24:10] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [13:24:10] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [13:24:10] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [13:24:10] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [13:24:10] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:24:10] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [13:24:11] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [13:24:11] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:11] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [13:24:11] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [13:24:11] Found 20 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [13:24:11] Sending drone to explore tile: E3, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: E3
fsmLogger.js:100 🟠 ACTION [13:24:11] Exploration started at 13:24:11
fsmLogger.js:93 🚀 MOUVEMENT [13:24:12] [UnifiedDroneMovement] Bot drone discovered new resources at E3: {food: 49, debris: 9062, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [13:24:12] [UnifiedDroneMovement] Bot exploration count increased to 6
fsmLogger.js:100 🟠 ACTION [13:24:12] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [13:24:13] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [13:24:13] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:13] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [13:24:13] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:13] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:24:13] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:13] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:13] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [13:24:13] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:13] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [13:24:14] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [13:24:14] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:14] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:24:14] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [13:24:14] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [13:24:14] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [13:24:14] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [13:24:14] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:24:14] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [13:24:15] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [13:24:15] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:15] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [13:24:15] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [13:24:15] Found 19 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [13:24:15] Sending drone to explore tile: F1, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:100 🟠 ACTION [13:24:15] Exploration started at 13:24:15
fsmLogger.js:93 🚀 MOUVEMENT [13:24:15] [UnifiedDroneMovement] Bot drone discovered new resources at F1: {food: 17, debris: 9067, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [13:24:15] [UnifiedDroneMovement] Bot exploration count increased to 8
fsmLogger.js:100 🚀 MOUVEMENT [13:24:16] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟣 CONDITION [13:24:16] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [13:24:16] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:16] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:24:16] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [13:24:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:16] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [13:24:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:24:16] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [13:24:17] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [13:24:17] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:17] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:24:17] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [13:24:17] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [13:24:17] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [13:24:17] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [13:24:17] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:24:17] Entering COLLECTING state
fsmLogger.js:93 🟠 ACTION [13:24:18] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [13:24:18] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:18] Moving to resource at E3, value: 18193, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: E3
fsmLogger.js:93 🚀 MOUVEMENT [13:24:18] [ShipMovement] player2 target changed, recalculating path to: E3
fsmLogger.js:100 🚀 MOUVEMENT [13:24:18] [ShipMovement] Calculating path for player2 from F2 to E3
fsmLogger.js:100 🚀 MOUVEMENT [13:24:18] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [13:24:19] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [13:24:19] [ShipMovement] Finalizing movement for player2/ship to E3
fsmLogger.js:100 🟠 ACTION [13:24:19] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:19] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:19] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:19] completed action: collectResource {elapsed: 1}
fsmLogger.js:100 🟠 ACTION [13:24:20] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:20] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:20] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:20] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:21] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:21] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:21] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:21] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:22] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:22] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:22] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:22] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:23] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:23] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:23] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:23] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:24] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:24] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:24] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:24] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:25] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:25] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:25] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:25] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:26] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:26] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:26] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:26] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:27] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:27] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:27] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:27] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:28] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:28] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:28] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:28] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:29] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:29] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:29] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:29] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:30] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:30] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:30] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:30] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:31] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:31] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:31] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:31] completed action: collectResource {elapsed: 1}
fsmLogger.js:100 🟠 ACTION [13:24:32] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:32] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:32] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:32] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:33] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:33] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:33] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:33] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:34] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:34] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:34] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:34] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:35] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:35] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:35] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:35] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:36] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:36] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:36] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:36] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:37] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:37] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:37] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:37] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:38] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:38] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:38] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:38] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:39] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:39] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:39] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:39] completed action: collectResource {elapsed: 0}
fsmLogger.js:100 🟠 ACTION [13:24:40] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:24:40] Bot already at resource location E3, adding collectResource action
fsmLogger.js:93 🟠 ACTION [13:24:40] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:93 🟠 ACTION [13:24:40] completed action: collectResource {elapsed: 0}
