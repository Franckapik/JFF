Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:40 [Scene] Initializing bot...
fsmLogger.js:100 🔵 INFO [14:12:57] Initializing bot FSM
fsmLogger.js:100 🟢 STATE [14:12:57] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:12:57] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:12:57] Adding action to queue: testQueue {priority: 4}
fsmLogger.js:93 🟠 ACTION [14:12:57] Adding action to queue: exploreDrone {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:12:57] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [14:12:57] Bot initialized in IDLE state with testQueue action
fsmLogger.js:93 🚀 MOUVEMENT [14:12:57] [ShipMovement] Setting initial position for player1: {x: -3.6, y: 0, z: 0}
fsmLogger.js:93 🚀 MOUVEMENT [14:12:57] [ShipMovement] Setting initial position for player2: {x: -2.7, y: 0, z: -1.5588457268119895}
App.jsx:24 [App] Starting bot processing with setInterval
fsmLogger.js:100 🟠 ACTION [14:12:58] Execute: Start: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:12:58] Starting test queue action - Will complete in 5 seconds
fsmLogger.js:100 🟠 ACTION [14:12:59] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:12:59] Test queue action completed after 1.0 seconds
fsmLogger.js:93 🟠 ACTION [14:12:59] completed action: testQueue {elapsed: 2013}
fsmLogger.js:100 🟠 ACTION [14:13:00] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:00] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:00] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:00] Found 18 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:00] Sending drone to explore tile: C2, distance: 0.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: C2
fsmLogger.js:100 🟠 ACTION [14:13:00] Exploration started at 14:13:00
fsmLogger.js:100 🚀 MOUVEMENT [14:13:00] [UnifiedDroneMovement] Bot exploration count increased to 2
fsmLogger.js:100 🚀 MOUVEMENT [14:13:01] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:13:01] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:01] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:93 🟠 ACTION [14:13:01] completed action: exploreDrone {elapsed: 4011}
fsmLogger.js:100 🟠 ACTION [14:13:02] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:02] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:02] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:02] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:02] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:02] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:02] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:02] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:03] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:03] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:03] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:03] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:03] Found 17 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:03] Sending drone to explore tile: B2, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: B2
fsmLogger.js:100 🟠 ACTION [14:13:03] Exploration started at 14:13:03
fsmLogger.js:93 🚀 MOUVEMENT [14:13:04] [UnifiedDroneMovement] Bot drone discovered new resources at B2: {food: 33, debris: 6182, special: 1}
fsmLogger.js:100 🚀 MOUVEMENT [14:13:04] [UnifiedDroneMovement] Bot exploration count increased to 4
fsmLogger.js:100 🟠 ACTION [14:13:04] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:13:04] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:13:05] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:05] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [14:13:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:05] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:05] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:13:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:05] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:13:06] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:06] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:06] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:06] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:06] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:06] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:06] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:06] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:06] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:07] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:07] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:07] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:07] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:07] Found 16 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:07] Sending drone to explore tile: B3, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: B3
fsmLogger.js:100 🟠 ACTION [14:13:07] Exploration started at 14:13:07
fsmLogger.js:100 🚀 MOUVEMENT [14:13:08] [UnifiedDroneMovement] Bot exploration count increased to 6
fsmLogger.js:100 🟠 ACTION [14:13:08] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:13:09] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:13:09] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:09] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [14:13:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:09] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:09] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:13:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:09] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:13:10] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:10] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:10] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:10] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:10] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:10] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:10] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:10] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:10] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:11] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:11] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:11] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:11] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:11] Found 15 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:11] Sending drone to explore tile: C1, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: C1
fsmLogger.js:100 🟠 ACTION [14:13:11] Exploration started at 14:13:11
fsmLogger.js:100 🚀 MOUVEMENT [14:13:12] [UnifiedDroneMovement] Bot exploration count increased to 8
fsmLogger.js:100 🚀 MOUVEMENT [14:13:12] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:13:12] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:12] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:100 🟢 STATE [14:13:12] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:12] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:12] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:12] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:13:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:12] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:13:13] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:13] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:13] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:13] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:13] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:13] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:13] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:13] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:13] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:14] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:14] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:14] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:14] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:14] Found 14 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:14] Sending drone to explore tile: C3, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: C3
fsmLogger.js:100 🟠 ACTION [14:13:14] Exploration started at 14:13:14
fsmLogger.js:100 🟠 ACTION [14:13:15] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:15] Exploration in progress: 1.0s elapsed
fsmLogger.js:93 🚀 MOUVEMENT [14:13:15] [UnifiedDroneMovement] Bot drone discovered new resources at C3: {food: 41, debris: 9028, special: 1}
fsmLogger.js:100 🚀 MOUVEMENT [14:13:15] [UnifiedDroneMovement] Bot exploration count increased to 10
fsmLogger.js:100 🟠 ACTION [14:13:16] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:13:16] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:13:17] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:17] Drone has returned to ship, exploration sequence fully complete after 3.0s
fsmLogger.js:100 🟢 STATE [14:13:17] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:17] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:17] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:17] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:17] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:13:17] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:17] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:13:18] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:18] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:18] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:18] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:18] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:18] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:18] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:18] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:18] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:19] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:19] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:19] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:19] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:19] Found 13 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:19] Sending drone to explore tile: D1, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: D1
fsmLogger.js:100 🟠 ACTION [14:13:19] Exploration started at 14:13:19
fsmLogger.js:93 🚀 MOUVEMENT [14:13:20] [UnifiedDroneMovement] Bot drone discovered new resources at D1: {food: 75, debris: 3593, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:13:20] [UnifiedDroneMovement] Bot exploration count increased to 12
fsmLogger.js:100 🟣 CONDITION [14:13:20] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:13:20] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:20] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:20] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:20] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:13:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:20] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🚀 MOUVEMENT [14:13:21] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:13:21] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:21] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:21] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:13:21] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:21] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:13:21] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:13:21] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:13:21] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:13:22] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:13:22] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:22] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:22] Moving to resource at C3, value: 18107, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: C3
fsmLogger.js:93 🚀 MOUVEMENT [14:13:22] [ShipMovement] player2 target changed, recalculating path to: C3
fsmLogger.js:100 🚀 MOUVEMENT [14:13:22] [ShipMovement] Calculating path for player2 from C2 to C3
fsmLogger.js:100 🚀 MOUVEMENT [14:13:22] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [14:13:23] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:13:23] [ShipMovement] Finalizing movement for player2/ship to C3
fsmLogger.js:100 🟠 ACTION [14:13:23] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:23] Bot has reached resource at C3 after 1.0s
fsmLogger.js:93 🟠 ACTION [14:13:23] completed action: moveToResource {elapsed: 1001}
fsmLogger.js:100 🟠 ACTION [14:13:24] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:13:24] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:13:24] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:24] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:24] Debug: collectResource called at position C3, state: false
fsmLogger.js:100 🟠 ACTION [14:13:24] Debug: Target resource coord: C3, Bot coord: C3
fsmLogger.js:100 🟠 ACTION [14:13:24] Starting resource collection at C3: {"food":41,"debris":9028,"special":1}
fsmLogger.js:100 🟠 ACTION [14:13:25] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:26] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:27] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:28] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:29] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:30] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:30] Resources collected successfully: {"food":41,"debris":9028,"special":1}
fsmLogger.js:100 🟠 ACTION [14:13:30] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:13:30] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:13:30] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:30] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:13:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:30] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [14:13:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:30] Bot status: Fuel=95, At base=false
fsmLogger.js:93 🟠 ACTION [14:13:30] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:13:30] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:13:31] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:31] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:31] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:31] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:31] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:31] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:31] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:31] Transition details: Fuel=95, Resources={"food":41,"debris":9028,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:31] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:32] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:32] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:32] Drone has returned to ship, exploration sequence fully complete after 13.0s
fsmLogger.js:100 🟢 STATE [14:13:32] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:32] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:32] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:32] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [14:13:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:32] Bot status: Fuel=95, At base=false
fsmLogger.js:93 🟠 ACTION [14:13:33] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:33] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:33] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:33] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:33] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:33] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:33] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:33] Transition details: Fuel=95, Resources={"food":41,"debris":9028,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:33] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:34] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:34] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:34] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:34] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:34] Found 17 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:34] Sending drone to explore tile: B4, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: B4
fsmLogger.js:100 🟠 ACTION [14:13:34] Exploration started at 14:13:34
fsmLogger.js:93 🚀 MOUVEMENT [14:13:35] [UnifiedDroneMovement] Bot drone discovered new resources at B4: {food: 25, debris: 4540, special: 0}
fsmLogger.js:100 🚀 MOUVEMENT [14:13:35] [UnifiedDroneMovement] Bot exploration count increased to 14
fsmLogger.js:100 🟣 CONDITION [14:13:35] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:13:35] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:35] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:35] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:35] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:35] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [14:13:35] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:35] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:13:36] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:13:36] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:36] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:36] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:36] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:13:36] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:36] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:13:36] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:13:36] Transition details: Fuel=95, Resources={"food":41,"debris":9028,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:36] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:13:37] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:13:37] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:37] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:37] Moving to resource at B4, value: 9105, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: B4
fsmLogger.js:93 🚀 MOUVEMENT [14:13:37] [ShipMovement] player2 target changed, recalculating path to: B4
fsmLogger.js:100 🚀 MOUVEMENT [14:13:37] [ShipMovement] Calculating path for player2 from C3 to B4
fsmLogger.js:100 🚀 MOUVEMENT [14:13:37] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [14:13:38] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:13:38] [ShipMovement] Finalizing movement for player2/ship to B4
fsmLogger.js:100 🟠 ACTION [14:13:38] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:38] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:100 🟠 ACTION [14:13:38] Bot has reached resource at B4 after 1.0s
fsmLogger.js:93 🟠 ACTION [14:13:38] completed action: moveToResource {elapsed: 1004}
fsmLogger.js:100 🟠 ACTION [14:13:39] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:13:39] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:13:39] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:39] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:39] Debug: collectResource called at position B4, state: false
fsmLogger.js:100 🟠 ACTION [14:13:39] Debug: Target resource coord: B4, Bot coord: B4
fsmLogger.js:100 🟠 ACTION [14:13:39] Starting resource collection at B4: {"food":25,"debris":4540,"special":0}
fsmLogger.js:100 🟠 ACTION [14:13:40] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:41] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:42] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:43] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:44] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:44] Resources collected successfully: {"food":25,"debris":4540,"special":0}
fsmLogger.js:100 🟠 ACTION [14:13:44] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:13:44] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:13:44] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:44] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:13:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:44] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🟢 STATE [14:13:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:44] Bot status: Fuel=90, At base=false
fsmLogger.js:93 🟠 ACTION [14:13:44] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:13:44] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:13:45] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:45] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:45] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:45] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:45] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:45] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:45] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:45] Transition details: Fuel=90, Resources={"food":66,"debris":13568,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:45] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:46] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:46] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:46] Drone has returned to ship, exploration sequence fully complete after 12.0s
fsmLogger.js:100 🟢 STATE [14:13:46] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:46] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:46] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:46] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🟢 STATE [14:13:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:46] Bot status: Fuel=90, At base=false
fsmLogger.js:93 🟠 ACTION [14:13:47] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:47] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:47] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:47] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:13:47] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:47] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:13:47] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:13:47] Transition details: Fuel=90, Resources={"food":66,"debris":13568,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:47] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:13:48] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:48] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:48] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:13:48] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:13:48] Found 11 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:13:48] Sending drone to explore tile: B5, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: B5
fsmLogger.js:100 🟠 ACTION [14:13:48] Exploration started at 14:13:48
fsmLogger.js:100 🟠 ACTION [14:13:49] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [14:13:49] [UnifiedDroneMovement] Bot drone discovered new resources at B5: {food: 23, debris: 7841, special: 0}
fsmLogger.js:100 🚀 MOUVEMENT [14:13:49] [UnifiedDroneMovement] Bot exploration count increased to 16
fsmLogger.js:100 🟣 CONDITION [14:13:50] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:13:50] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:50] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:13:50] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:13:50] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:50] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🟢 STATE [14:13:50] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:13:50] Bot status: Fuel=90, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:13:50] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:13:51] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:51] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:51] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:13:51] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:13:51] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:13:51] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:13:51] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:13:51] Transition details: Fuel=90, Resources={"food":66,"debris":13568,"special":1}
fsmLogger.js:100 🟢 STATE [14:13:51] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:13:52] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:13:52] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:13:52] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:52] Moving to resource at B5, value: 15705, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: B5
fsmLogger.js:93 🚀 MOUVEMENT [14:13:52] [ShipMovement] player2 target changed, recalculating path to: B5
fsmLogger.js:100 🚀 MOUVEMENT [14:13:52] [ShipMovement] Calculating path for player2 from B4 to B5
fsmLogger.js:100 🚀 MOUVEMENT [14:13:52] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [14:13:53] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:13:53] [ShipMovement] Finalizing movement for player2/ship to B5
fsmLogger.js:100 🟠 ACTION [14:13:53] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:53] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:100 🟠 ACTION [14:13:53] Bot has reached resource at B5 after 1.0s
fsmLogger.js:93 🟠 ACTION [14:13:53] completed action: moveToResource {elapsed: 1003}
fsmLogger.js:100 🟠 ACTION [14:13:54] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:13:54] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:13:54] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:13:54] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:54] Debug: collectResource called at position B5, state: false
fsmLogger.js:100 🟠 ACTION [14:13:54] Debug: Target resource coord: B5, Bot coord: B5
fsmLogger.js:100 🟠 ACTION [14:13:54] Starting resource collection at B5: {"food":23,"debris":7841,"special":0}
fsmLogger.js:100 🟠 ACTION [14:13:55] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:56] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:57] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:58] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:13:59] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:00] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:00] Resources collected successfully: {"food":23,"debris":7841,"special":0}
fsmLogger.js:100 🟠 ACTION [14:14:00] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:14:00] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:00] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:00] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:00] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:00] Bot status: Fuel=85, At base=false
fsmLogger.js:100 🟢 STATE [14:14:00] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:00] Bot status: Fuel=85, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:00] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:14:00] completed action: evaluateIdle {elapsed: 1}
fsmLogger.js:93 🟠 ACTION [14:14:01] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:01] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:01] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:01] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:01] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:01] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:01] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:01] Transition details: Fuel=85, Resources={"food":89,"debris":21409,"special":1}
fsmLogger.js:100 🟢 STATE [14:14:01] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:02] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:02] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:02] Drone has returned to ship, exploration sequence fully complete after 14.0s
fsmLogger.js:100 🟢 STATE [14:14:02] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:02] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:02] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:02] Bot status: Fuel=85, At base=false
fsmLogger.js:100 🟢 STATE [14:14:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:02] Bot status: Fuel=85, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:03] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:03] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:03] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:03] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:03] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:03] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:03] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:03] Transition details: Fuel=85, Resources={"food":89,"debris":21409,"special":1}
fsmLogger.js:100 🟢 STATE [14:14:03] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:04] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:04] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:04] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:14:04] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:14:04] Found 12 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:14:04] Sending drone to explore tile: A6, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: A6
fsmLogger.js:100 🟠 ACTION [14:14:04] Exploration started at 14:14:04
fsmLogger.js:93 🚀 MOUVEMENT [14:14:05] [UnifiedDroneMovement] Bot drone discovered new resources at A6: {food: 5, debris: 60, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:14:05] [UnifiedDroneMovement] Bot exploration count increased to 18
fsmLogger.js:100 🟣 CONDITION [14:14:05] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:14:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:05] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:05] Bot status: Fuel=85, At base=false
fsmLogger.js:100 🟢 STATE [14:14:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:05] Bot status: Fuel=85, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:14:06] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:14:06] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:06] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:06] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:06] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:14:06] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:06] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:14:06] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:14:06] Transition details: Fuel=85, Resources={"food":89,"debris":21409,"special":1}
fsmLogger.js:100 🟢 STATE [14:14:06] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:14:07] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:14:07] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:07] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:07] Moving to resource at B2, value: 12407, distance: 3.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: B2
fsmLogger.js:93 🚀 MOUVEMENT [14:14:07] [ShipMovement] player2 target changed, recalculating path to: B2
fsmLogger.js:100 🚀 MOUVEMENT [14:14:07] [ShipMovement] Calculating path for player2 from B5 to B2
fsmLogger.js:100 🚀 MOUVEMENT [14:14:07] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🟠 ACTION [14:14:08] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:08] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:100 🟠 ACTION [14:14:09] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:09] Moving to resource in progress: 2.0s elapsed
fsmLogger.js:100 🚀 MOUVEMENT [14:14:10] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:14:10] [ShipMovement] Finalizing movement for player2/ship to B2
fsmLogger.js:100 🟠 ACTION [14:14:10] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:10] Bot has reached resource at B2 after 3.0s
fsmLogger.js:93 🟠 ACTION [14:14:10] completed action: moveToResource {elapsed: 3001}
fsmLogger.js:100 🟠 ACTION [14:14:11] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:14:11] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:14:11] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:11] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:11] Debug: collectResource called at position B2, state: false
fsmLogger.js:100 🟠 ACTION [14:14:11] Debug: Target resource coord: B2, Bot coord: B2
fsmLogger.js:100 🟠 ACTION [14:14:11] Starting resource collection at B2: {"food":33,"debris":6182,"special":1}
fsmLogger.js:100 🟠 ACTION [14:14:12] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:13] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:14] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:15] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:16] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:17] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:17] Resources collected successfully: {"food":33,"debris":6182,"special":1}
fsmLogger.js:100 🟠 ACTION [14:14:17] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:14:17] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:17] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:17] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:17] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:17] Bot status: Fuel=70, At base=false
fsmLogger.js:100 🟢 STATE [14:14:17] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:17] Bot status: Fuel=70, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:17] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:14:17] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:14:18] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:18] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:18] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:18] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:18] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:18] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:18] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:18] Transition details: Fuel=70, Resources={"food":122,"debris":27591,"special":2}
fsmLogger.js:100 🟢 STATE [14:14:18] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:19] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:19] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:19] Drone has returned to ship, exploration sequence fully complete after 15.0s
fsmLogger.js:100 🟢 STATE [14:14:19] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:19] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:19] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:19] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:19] Bot status: Fuel=70, At base=false
fsmLogger.js:100 🟢 STATE [14:14:19] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:19] Bot status: Fuel=70, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:20] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:20] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:20] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:20] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:20] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:20] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:20] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:20] Transition details: Fuel=70, Resources={"food":122,"debris":27591,"special":2}
fsmLogger.js:100 🟢 STATE [14:14:20] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:21] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:21] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:21] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:14:21] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:14:21] Found 5 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:14:21] Sending drone to explore tile: D0, distance: 2.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: D0
fsmLogger.js:100 🟠 ACTION [14:14:21] Exploration started at 14:14:21
fsmLogger.js:100 🟠 ACTION [14:14:22] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [14:14:23] [UnifiedDroneMovement] Bot drone discovered new resources at D0: {food: 30, debris: 1793, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:14:23] [UnifiedDroneMovement] Bot exploration count increased to 20
fsmLogger.js:100 🟣 CONDITION [14:14:23] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:14:23] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:23] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:23] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:23] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:23] Bot status: Fuel=70, At base=false
fsmLogger.js:100 🟢 STATE [14:14:23] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:23] Bot status: Fuel=70, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:24] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:24] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:24] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:24] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:14:24] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:24] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:14:24] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:14:24] Transition details: Fuel=70, Resources={"food":122,"debris":27591,"special":2}
fsmLogger.js:100 🟢 STATE [14:14:24] Entering COLLECTING state
fsmLogger.js:100 🚀 MOUVEMENT [14:14:24] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:14:25] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:14:25] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:25] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:25] Moving to resource at D1, value: 7281, distance: 2.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: D1
fsmLogger.js:93 🚀 MOUVEMENT [14:14:25] [ShipMovement] player2 target changed, recalculating path to: D1
fsmLogger.js:100 🚀 MOUVEMENT [14:14:25] [ShipMovement] Calculating path for player2 from B2 to D1
fsmLogger.js:100 🚀 MOUVEMENT [14:14:25] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🟣 CONDITION [14:14:26] Exit condition met in state collecting: transitioning to idle (refueling)
fsmLogger.js:100 🔴 ERROR [14:14:26] Unknown action type: refuelAtBase
fsmLogger.js:100 🟢 STATE [14:14:26] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:26] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:26] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:26] Bot status: Fuel=60, At base=true
fsmLogger.js:100 🟢 STATE [14:14:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:26] Bot status: Fuel=60, At base=true
fsmLogger.js:100 🚀 MOUVEMENT [14:14:27] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:14:27] [ShipMovement] Finalizing movement for player2/ship to D1
fsmLogger.js:93 🟠 ACTION [14:14:27] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:27] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:27] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:27] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:14:27] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:27] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:14:27] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:14:27] Transition details: Fuel=60, Resources={"food":122,"debris":27591,"special":2}
fsmLogger.js:100 🟢 STATE [14:14:27] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:14:27] Bot already at resource location D1, preparing collection
fsmLogger.js:100 🟠 ACTION [14:14:28] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:14:28] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:14:28] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:28] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:28] Debug: collectResource called at position D1, state: false
fsmLogger.js:100 🟠 ACTION [14:14:28] Debug: Target resource coord: D1, Bot coord: D1
fsmLogger.js:100 🟠 ACTION [14:14:28] Starting resource collection at D1: {"food":75,"debris":3593,"special":2}
fsmLogger.js:100 🟠 ACTION [14:14:29] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:30] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:31] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:32] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:32] Resources collected successfully: {"food":75,"debris":3593,"special":2}
fsmLogger.js:100 🟠 ACTION [14:14:32] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:14:32] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:32] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:32] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:32] Bot status: Fuel=60, At base=false
fsmLogger.js:100 🟢 STATE [14:14:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:32] Bot status: Fuel=60, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:32] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:14:32] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:14:33] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:33] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:33] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:33] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:33] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:33] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:33] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:33] Transition details: Fuel=60, Resources={"food":197,"debris":31184,"special":4}
fsmLogger.js:100 🟢 STATE [14:14:33] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:34] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:34] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:34] Drone has returned to ship, exploration sequence fully complete after 13.0s
fsmLogger.js:100 🟢 STATE [14:14:34] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:34] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:34] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:34] Bot status: Fuel=60, At base=false
fsmLogger.js:100 🟢 STATE [14:14:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:34] Bot status: Fuel=60, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:35] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:35] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:35] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:35] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:35] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:35] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:35] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:35] Transition details: Fuel=60, Resources={"food":197,"debris":31184,"special":4}
fsmLogger.js:100 🟢 STATE [14:14:35] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:36] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:36] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:36] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:14:36] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:14:36] Found 10 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:14:36] Sending drone to explore tile: D2, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: D2
fsmLogger.js:100 🟠 ACTION [14:14:36] Exploration started at 14:14:36
fsmLogger.js:100 🟠 ACTION [14:14:37] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [14:14:37] [UnifiedDroneMovement] Bot drone discovered new resources at D2: {food: 38, debris: 2400, special: 1}
fsmLogger.js:100 🚀 MOUVEMENT [14:14:37] [UnifiedDroneMovement] Bot exploration count increased to 22
fsmLogger.js:100 🟣 CONDITION [14:14:38] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:14:38] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:38] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:38] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:38] Bot status: Fuel=60, At base=false
fsmLogger.js:100 🟢 STATE [14:14:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:38] Bot status: Fuel=60, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:14:38] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:14:39] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:39] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:39] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:39] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:14:39] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:39] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:14:39] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:14:39] Transition details: Fuel=60, Resources={"food":197,"debris":31184,"special":4}
fsmLogger.js:100 🟢 STATE [14:14:39] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:14:40] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:14:40] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:40] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:40] Moving to resource in progress: 15.0s elapsed
fsmLogger.js:100 🟠 ACTION [14:14:40] Bot has reached resource at D1 after 15.0s
fsmLogger.js:93 🟠 ACTION [14:14:40] completed action: moveToResource {elapsed: 1}
fsmLogger.js:100 🟠 ACTION [14:14:41] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:14:41] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:41] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:41] Moving to resource at D2, value: 4848, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: D2
fsmLogger.js:93 🚀 MOUVEMENT [14:14:41] [ShipMovement] player2 target changed, recalculating path to: D2
fsmLogger.js:100 🚀 MOUVEMENT [14:14:41] [ShipMovement] Calculating path for player2 from D1 to D2
fsmLogger.js:100 🚀 MOUVEMENT [14:14:41] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [14:14:42] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:14:42] [ShipMovement] Finalizing movement for player2/ship to D2
fsmLogger.js:100 🟠 ACTION [14:14:42] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:42] Bot has reached resource at D2 after 1.0s
fsmLogger.js:93 🟠 ACTION [14:14:42] completed action: moveToResource {elapsed: 1001}
fsmLogger.js:100 🟠 ACTION [14:14:43] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:14:43] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:14:43] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:43] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:43] Debug: collectResource called at position D2, state: false
fsmLogger.js:100 🟠 ACTION [14:14:43] Debug: Target resource coord: D2, Bot coord: D2
fsmLogger.js:100 🟠 ACTION [14:14:43] Starting resource collection at D2: {"food":38,"debris":2400,"special":1}
fsmLogger.js:100 🟠 ACTION [14:14:44] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:45] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:46] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:46] Resources collected successfully: {"food":38,"debris":2400,"special":1}
fsmLogger.js:100 🟠 ACTION [14:14:46] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:14:46] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:46] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:46] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:14:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:46] Bot status: Fuel=55, At base=false
fsmLogger.js:100 🟢 STATE [14:14:46] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:46] Bot status: Fuel=55, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:46] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:14:46] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:14:47] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:47] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:47] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:47] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:47] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:47] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:47] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:47] Transition details: Fuel=55, Resources={"food":235,"debris":33584,"special":5}
fsmLogger.js:100 🟢 STATE [14:14:47] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:48] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:48] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:48] Drone has returned to ship, exploration sequence fully complete after 12.0s
fsmLogger.js:100 🟢 STATE [14:14:48] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:48] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:48] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:48] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:48] Bot status: Fuel=55, At base=false
fsmLogger.js:100 🟢 STATE [14:14:48] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:48] Bot status: Fuel=55, At base=false
fsmLogger.js:93 🟠 ACTION [14:14:49] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:49] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:49] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:49] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:14:49] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:49] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:14:49] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:14:49] Transition details: Fuel=55, Resources={"food":235,"debris":33584,"special":5}
fsmLogger.js:100 🟢 STATE [14:14:49] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:14:50] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:50] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:50] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:14:50] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:14:50] Found 15 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:14:50] Sending drone to explore tile: D3, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: D3
fsmLogger.js:100 🟠 ACTION [14:14:50] Exploration started at 14:14:50
fsmLogger.js:100 🟠 ACTION [14:14:51] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [14:14:51] [UnifiedDroneMovement] Bot drone discovered new resources at D3: {food: 13, debris: 8612, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:14:51] [UnifiedDroneMovement] Bot exploration count increased to 24
fsmLogger.js:100 🟣 CONDITION [14:14:52] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:14:52] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:52] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:14:52] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:14:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:52] Bot status: Fuel=55, At base=false
fsmLogger.js:100 🟢 STATE [14:14:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:14:52] Bot status: Fuel=55, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:14:52] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:14:53] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:53] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:53] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:14:53] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:14:53] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:14:53] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:14:53] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:14:53] Transition details: Fuel=55, Resources={"food":235,"debris":33584,"special":5}
fsmLogger.js:100 🟢 STATE [14:14:53] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:14:54] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:14:54] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:14:54] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:54] Moving to resource at D3, value: 17257, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: D3
fsmLogger.js:93 🚀 MOUVEMENT [14:14:54] [ShipMovement] player2 target changed, recalculating path to: D3
fsmLogger.js:100 🚀 MOUVEMENT [14:14:54] [ShipMovement] Calculating path for player2 from D2 to D3
fsmLogger.js:100 🚀 MOUVEMENT [14:14:54] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🟠 ACTION [14:14:55] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:14:55] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:14:55] [ShipMovement] Finalizing movement for player2/ship to D3
fsmLogger.js:100 🟠 ACTION [14:14:56] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:56] Bot has reached resource at D3 after 2.0s
fsmLogger.js:93 🟠 ACTION [14:14:56] completed action: moveToResource {elapsed: 2001}
fsmLogger.js:100 🟠 ACTION [14:14:57] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:14:57] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:14:57] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:14:57] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:57] Debug: collectResource called at position D3, state: false
fsmLogger.js:100 🟠 ACTION [14:14:57] Debug: Target resource coord: D3, Bot coord: D3
fsmLogger.js:100 🟠 ACTION [14:14:57] Starting resource collection at D3: {"food":13,"debris":8612,"special":2}
fsmLogger.js:100 🟠 ACTION [14:14:58] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:14:59] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:00] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:01] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:02] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:03] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:03] Resources collected successfully: {"food":13,"debris":8612,"special":2}
fsmLogger.js:100 🟠 ACTION [14:15:03] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:15:03] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:15:03] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:15:03] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:15:03] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:03] Bot status: Fuel=50, At base=false
fsmLogger.js:100 🟢 STATE [14:15:03] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:03] Bot status: Fuel=50, At base=false
fsmLogger.js:93 🟠 ACTION [14:15:03] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:15:03] completed action: evaluateIdle {elapsed: 1}
fsmLogger.js:93 🟠 ACTION [14:15:04] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:15:04] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:04] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:15:04] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:15:04] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:15:04] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:15:04] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:15:04] Transition details: Fuel=50, Resources={"food":248,"debris":42196,"special":7}
fsmLogger.js:100 🟢 STATE [14:15:04] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:15:05] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:15:05] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:05] Drone has returned to ship, exploration sequence fully complete after 15.0s
fsmLogger.js:100 🟢 STATE [14:15:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:15:05] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:15:05] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:15:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:05] Bot status: Fuel=50, At base=false
fsmLogger.js:100 🟢 STATE [14:15:05] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:05] Bot status: Fuel=50, At base=false
fsmLogger.js:93 🟠 ACTION [14:15:06] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:15:06] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:06] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:15:06] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:15:06] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:15:06] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:15:06] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:15:06] Transition details: Fuel=50, Resources={"food":248,"debris":42196,"special":7}
fsmLogger.js:100 🟢 STATE [14:15:06] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:15:07] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:15:07] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:07] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:15:07] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:15:07] Found 20 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:15:07] Sending drone to explore tile: D4, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: D4
fsmLogger.js:100 🟠 ACTION [14:15:07] Exploration started at 14:15:07
fsmLogger.js:100 🟠 ACTION [14:15:08] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:93 🚀 MOUVEMENT [14:15:08] [UnifiedDroneMovement] Bot drone discovered new resources at D4: {food: 1, debris: 2792, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:15:08] [UnifiedDroneMovement] Bot exploration count increased to 26
fsmLogger.js:100 🟣 CONDITION [14:15:09] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:15:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:15:09] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:15:09] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:15:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:09] Bot status: Fuel=50, At base=false
fsmLogger.js:100 🟢 STATE [14:15:09] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:09] Bot status: Fuel=50, At base=false
fsmLogger.js:100 🚀 MOUVEMENT [14:15:09] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:93 🟠 ACTION [14:15:10] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:15:10] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:10] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:15:10] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:15:10] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:15:10] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:15:10] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:15:10] Transition details: Fuel=50, Resources={"food":248,"debris":42196,"special":7}
fsmLogger.js:100 🟢 STATE [14:15:10] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:15:11] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:15:11] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:15:11] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:15:11] Moving to resource at D4, value: 5605, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: D4
fsmLogger.js:93 🚀 MOUVEMENT [14:15:11] [ShipMovement] player2 target changed, recalculating path to: D4
fsmLogger.js:100 🚀 MOUVEMENT [14:15:11] [ShipMovement] Calculating path for player2 from D3 to D4
fsmLogger.js:100 🚀 MOUVEMENT [14:15:11] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🟣 CONDITION [14:15:12] Exit condition met in state collecting: transitioning to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [14:15:12] Transition: collecting → returning
fsmLogger.js:100 🟢 STATE [14:15:12] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:15:12] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:15:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:15:12] Bot status: Fuel=45, At base=false
fsmLogger.js:100 🟢 STATE [14:15:12] Entering RETURNING state
fsmLogger.js:100 🚀 MOUVEMENT [14:15:12] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:15:12] [ShipMovement] Finalizing movement for player2/ship to D4
fsmLogger.js:100 🟣 CONDITION [14:15:13] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:14] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:15] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:16] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:17] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:18] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:19] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:20] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:21] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:22] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:23] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:24] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:25] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:26] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:27] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:28] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:29] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:30] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:31] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:32] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:33] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:34] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:35] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:36] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:37] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:38] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:39] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:40] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:41] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:42] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:43] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:44] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:45] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:46] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:47] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:48] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:49] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:50] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:51] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:52] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:53] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:54] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:55] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:56] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:57] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:58] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:15:59] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:00] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:01] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:02] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:03] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:04] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:05] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:06] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:07] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:08] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:09] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:10] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:11] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:12] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:13] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:14] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:15] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:16] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:17] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:18] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:19] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:20] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:21] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:22] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:23] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:24] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:25] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:26] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:27] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:28] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:29] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:30] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:31] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:32] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:33] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:34] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:35] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:36] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:37] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:38] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:39] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:40] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:41] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:42] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:43] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:44] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:45] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:46] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:47] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:48] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:49] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:50] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:51] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:52] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:53] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:54] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:55] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:56] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:57] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:58] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:16:59] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:00] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:01] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:02] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:03] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:04] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:05] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:06] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:07] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:08] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:09] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:10] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:11] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:12] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:13] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:14] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:15] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:16] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:17] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:18] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:19] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:20] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:21] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:22] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:23] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:24] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:25] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:26] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:27] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:28] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:29] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:30] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:31] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:32] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:33] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:34] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:35] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:36] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:37] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:38] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:39] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:40] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:41] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:42] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:43] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:44] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:45] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:46] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:47] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:48] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:49] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:50] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:51] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:52] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:53] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:54] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:55] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:56] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:57] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:58] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:17:59] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:00] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:01] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:02] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:03] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:04] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:05] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:06] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:07] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:08] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:09] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:10] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:11] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:13] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:14] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:15] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:16] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:17] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:18] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:19] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:20] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:21] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:22] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:23] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:24] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:25] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:26] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:27] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:28] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:29] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:30] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:31] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:32] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:33] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:34] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:35] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:36] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:37] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:38] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:39] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:40] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:41] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:42] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:43] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:44] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:45] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:46] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:47] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:48] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:49] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:50] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:51] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:52] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:53] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:54] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:55] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:56] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:57] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:58] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:18:59] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:00] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:01] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:02] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:03] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:04] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:05] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:06] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:07] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:08] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:09] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:10] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:11] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:12] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:19:59] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:28] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:29] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:30] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:31] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:32] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:33] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:34] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:35] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:36] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:37] Exit condition met in state returning: transitioning to returning (safety_critical)
fsmLogger.js:100 🟣 CONDITION [14:20:38] Exit condition met in state returning: transitioning to returning (safety_critical)
App.jsx:33 [App] Stopping bot processing interval
Scene.jsx:27 [Scene] Initializing tiles...
