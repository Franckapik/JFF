Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:40 [Scene] Initializing bot...
fsmLogger.js:100 🔵 INFO [22:30:17] Initializing bot FSM
fsmLogger.js:100 🟢 STATE [22:30:17] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:17] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [22:30:17] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:17] Bot initialized in IDLE state with testQueue action
fsmLogger.js:93 🚀 MOUVEMENT [22:30:17] [ShipMovement] Setting initial position for player1: {x: 0.9, y: 0, z: 1.5588457268119895}
fsmLogger.js:93 🚀 MOUVEMENT [22:30:17] [ShipMovement] Setting initial position for player2: {x: 2.7, y: 0, z: -1.5588457268119895}
App.jsx:25 [App] Starting bot processing with setInterval
fsmLogger.js:100 🟠 ACTION [22:30:18] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:18] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:18] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:18] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:18] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:18] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:18] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:18] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:19] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:19] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:19] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [22:30:19] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [22:30:19] Found 20 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [22:30:19] Sending drone to explore tile: F2, distance: 0.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: F2
fsmLogger.js:100 🟠 ACTION [22:30:19] Exploration started at 22:30:19
fsmLogger.js:100 🚀 MOUVEMENT [22:30:20] [UnifiedDroneMovement] Bot exploration count increased to 2
fsmLogger.js:100 🚀 MOUVEMENT [22:30:20] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [22:30:20] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:20] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:100 🟢 STATE [22:30:20] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:20] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:20] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:20] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [22:30:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:20] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [22:30:21] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:21] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:21] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:21] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:21] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:21] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:21] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:21] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:22] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:22] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:22] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [22:30:22] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [22:30:22] Found 19 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [22:30:22] Sending drone to explore tile: E2, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: E2
fsmLogger.js:100 🟠 ACTION [22:30:22] Exploration started at 22:30:22
fsmLogger.js:93 🚀 MOUVEMENT [22:30:23] [UnifiedDroneMovement] Bot drone discovered new resources at E2: {food: 88, debris: 3993, special: 0}
fsmLogger.js:100 🚀 MOUVEMENT [22:30:23] [UnifiedDroneMovement] Bot exploration count increased to 4
fsmLogger.js:100 🟠 ACTION [22:30:23] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [22:30:24] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [22:30:24] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:24] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [22:30:24] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:24] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:24] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:24] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [22:30:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:24] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [22:30:25] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:25] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:25] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:25] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:25] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:25] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:25] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:25] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:25] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:26] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:26] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:26] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [22:30:26] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [22:30:26] Found 18 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [22:30:26] Sending drone to explore tile: F1, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:100 🟠 ACTION [22:30:26] Exploration started at 22:30:26
fsmLogger.js:93 🚀 MOUVEMENT [22:30:27] [UnifiedDroneMovement] Bot drone discovered new resources at F1: {food: 46, debris: 4236, special: 1}
fsmLogger.js:100 🚀 MOUVEMENT [22:30:27] [UnifiedDroneMovement] Bot exploration count increased to 6
fsmLogger.js:100 🚀 MOUVEMENT [22:30:27] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [22:30:27] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:27] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:100 🟢 STATE [22:30:27] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:27] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:27] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:27] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:27] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [22:30:27] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:27] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [22:30:28] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:28] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:28] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:28] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:28] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:28] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:28] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:28] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:28] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:29] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:29] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:29] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [22:30:29] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [22:30:29] Found 17 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [22:30:29] Sending drone to explore tile: F3, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: F3
fsmLogger.js:100 🟠 ACTION [22:30:29] Exploration started at 22:30:29
fsmLogger.js:100 🟠 ACTION [22:30:30] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [22:30:31] [UnifiedDroneMovement] Bot drone discovered new resources at F3: {food: 78, debris: 8896, special: 0}
fsmLogger.js:100 🚀 MOUVEMENT [22:30:31] [UnifiedDroneMovement] Bot exploration count increased to 8
fsmLogger.js:100 🟣 CONDITION [22:30:31] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [22:30:31] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:31] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:31] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:31] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:31] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [22:30:31] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:31] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🚀 MOUVEMENT [22:30:32] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [22:30:32] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:32] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:32] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:32] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [22:30:32] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:32] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [22:30:32] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [22:30:32] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:32] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [22:30:33] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [22:30:33] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:33] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:33] Moving to resource at F3, value: 17870, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/ship to tile: F3
fsmLogger.js:93 🚀 MOUVEMENT [22:30:33] [ShipMovement] player2 target changed, recalculating path to: F3
fsmLogger.js:100 🚀 MOUVEMENT [22:30:34] [ShipMovement] Calculating path for player2 from F2 to F3
fsmLogger.js:100 🚀 MOUVEMENT [22:30:34] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [22:30:34] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [22:30:34] [ShipMovement] Finalizing movement for player2/ship to F3
fsmLogger.js:100 🟠 ACTION [22:30:34] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:34] Bot has reached resource at F3 after 1.0s
fsmLogger.js:93 🟠 ACTION [22:30:34] completed action: moveToResource {elapsed: 1000}
fsmLogger.js:100 🟠 ACTION [22:30:35] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [22:30:35] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [22:30:35] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:35] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:35] Debug: collectResource called at position F3, state: false
fsmLogger.js:100 🟠 ACTION [22:30:35] Debug: Target resource coord: F3, Bot coord: F3
fsmLogger.js:100 🟠 ACTION [22:30:35] Starting resource collection at F3: {"food":78,"debris":8896,"special":0}
fsmLogger.js:100 🟠 ACTION [22:30:36] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:37] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:38] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:38] Resources collected successfully: {"food":78,"debris":8896,"special":0}
fsmLogger.js:100 🟠 ACTION [22:30:38] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [22:30:38] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [22:30:38] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:38] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [22:30:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:38] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [22:30:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:38] Bot status: Fuel=95, At base=false
fsmLogger.js:93 🟠 ACTION [22:30:38] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [22:30:38] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [22:30:39] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:39] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:39] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:39] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:39] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:39] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:39] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:39] Transition details: Fuel=95, Resources={"food":78,"debris":8896,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:39] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:40] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:40] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:40] Drone has returned to ship, exploration sequence fully complete after 11.0s
fsmLogger.js:100 🟢 STATE [22:30:40] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:40] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:40] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:40] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [22:30:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:40] Bot status: Fuel=95, At base=false
fsmLogger.js:93 🟠 ACTION [22:30:41] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:41] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:41] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:41] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:41] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:41] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:41] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:41] Transition details: Fuel=95, Resources={"food":78,"debris":8896,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:41] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:42] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:42] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:42] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [22:30:42] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [22:30:42] Found 12 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [22:30:42] Sending drone to explore tile: F4, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: F4
fsmLogger.js:100 🟠 ACTION [22:30:42] Exploration started at 22:30:42
fsmLogger.js:100 🟠 ACTION [22:30:43] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [22:30:44] [UnifiedDroneMovement] Bot drone discovered new resources at F4: {food: 38, debris: 2146, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [22:30:44] [UnifiedDroneMovement] Bot exploration count increased to 10
fsmLogger.js:100 🟣 CONDITION [22:30:44] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [22:30:44] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:44] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:44] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:44] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [22:30:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:44] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [22:30:45] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [22:30:45] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:45] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:45] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:45] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [22:30:45] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:45] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [22:30:45] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [22:30:45] Transition details: Fuel=95, Resources={"food":78,"debris":8896,"special":0}
fsmLogger.js:100 🟢 STATE [22:30:45] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [22:30:46] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [22:30:46] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:46] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:46] Moving to resource at F4, value: 4350, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/ship to tile: F4
fsmLogger.js:93 🚀 MOUVEMENT [22:30:46] [ShipMovement] player2 target changed, recalculating path to: F4
fsmLogger.js:100 🚀 MOUVEMENT [22:30:47] [ShipMovement] Calculating path for player2 from F3 to F4
fsmLogger.js:100 🚀 MOUVEMENT [22:30:47] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🟠 ACTION [22:30:47] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:47] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:100 🚀 MOUVEMENT [22:30:47] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [22:30:47] [ShipMovement] Finalizing movement for player2/ship to F4
fsmLogger.js:100 🟠 ACTION [22:30:48] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:48] Moving to resource in progress: 2.0s elapsed
fsmLogger.js:100 🟠 ACTION [22:30:48] Bot has reached resource at F4 after 2.0s
fsmLogger.js:93 🟠 ACTION [22:30:48] completed action: moveToResource {elapsed: 2000}
fsmLogger.js:100 🟠 ACTION [22:30:49] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [22:30:49] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [22:30:49] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:49] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:49] Debug: collectResource called at position F4, state: false
fsmLogger.js:100 🟠 ACTION [22:30:49] Debug: Target resource coord: F4, Bot coord: F4
fsmLogger.js:100 🟠 ACTION [22:30:49] Starting resource collection at F4: {"food":38,"debris":2146,"special":2}
fsmLogger.js:100 🟠 ACTION [22:30:50] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:51] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:51] Resources collected successfully: {"food":38,"debris":2146,"special":2}
fsmLogger.js:100 🟠 ACTION [22:30:51] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [22:30:51] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [22:30:51] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:51] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [22:30:51] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:51] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🟢 STATE [22:30:51] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:51] Bot status: Fuel=90, At base=false
fsmLogger.js:93 🟠 ACTION [22:30:51] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [22:30:51] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [22:30:52] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [22:30:52] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:52] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [22:30:52] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [22:30:52] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [22:30:52] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [22:30:52] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [22:30:52] Transition details: Fuel=90, Resources={"food":116,"debris":11042,"special":2}
fsmLogger.js:100 🟢 STATE [22:30:52] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [22:30:53] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [22:30:53] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [22:30:53] Drone has returned to ship, exploration sequence fully complete after 11.0s
fsmLogger.js:100 🟢 STATE [22:30:53] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:53] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [22:30:53] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [22:30:53] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:53] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🟢 STATE [22:30:53] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [22:30:53] Bot status: Fuel=90, At base=false
