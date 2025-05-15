 [Scene] Initializing tiles...
 [Scene] Initializing players with tiles: Object
 [Scene] Initializing bot...
 🔵 INFO [13:22:44] Initializing bot FSM
 🟢 STATE [13:22:44] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:44] Bot status: Fuel=100, At base=true
 🟠 ACTION [13:22:44] Adding action to queue: evaluateIdle Object
 🟢 STATE [13:22:44] Bot initialized in IDLE state with testQueue action
 🚀 MOUVEMENT [13:22:44] [ShipMovement] Setting initial position for player1: Object
 🚀 MOUVEMENT [13:22:44] [ShipMovement] Setting initial position for player2: Object
 [App] Starting bot processing with setInterval
 🟠 ACTION [13:22:45] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:45] Evaluating conditions from IDLE state
 🟣 CONDITION [13:22:45] Transition from IDLE to exploring (discovery)
 🟠 ACTION [13:22:45] Adding action to queue: exploreDrone Object
 🟢 STATE [13:22:45] Transition: idle → exploring
 🟢 STATE [13:22:45] Exiting IDLE state, transitioning to exploring
 🔵 INFO [13:22:45] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:22:45] Entering EXPLORING state
 🟠 ACTION [13:22:46] Adding action to queue: exploreDrone Object
 🟠 ACTION [13:22:46] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:46] Attempting to find a tile to explore
 🔵 INFO [13:22:46] Using exploring radius: 3
 🔵 INFO [13:22:46] Found 20 walkable unexplored tiles in radius
 🟠 ACTION [13:22:46] Sending drone to explore tile: D1, distance: 0.00
 [PlayerStore] Moving player2/drone3 to tile: D1
 🟠 ACTION [13:22:46] Exploration started at 13:22:46
 🚀 MOUVEMENT [13:22:46] [UnifiedDroneMovement] Bot exploration count increased to 2
 🚀 MOUVEMENT [13:22:46] [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [13:22:47] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:47] Drone has returned to ship, exploration sequence fully complete after 1.0s
 🟢 STATE [13:22:47] Transition: exploring → idle
 🟢 STATE [13:22:47] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [13:22:47] Transition: exploring → idle
 🟢 STATE [13:22:47] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:47] Bot status: Fuel=100, At base=true
 🟢 STATE [13:22:47] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:47] Bot status: Fuel=100, At base=true
 🟠 ACTION [13:22:48] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:22:48] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:22:48] Evaluating conditions from IDLE state
 🟣 CONDITION [13:22:48] Transition from IDLE to exploring (discovery)
 🟠 ACTION [13:22:48] Adding action to queue: exploreDrone Object
 🟢 STATE [13:22:48] Transition: idle → exploring
 🟢 STATE [13:22:48] Exiting IDLE state, transitioning to exploring
 🔵 INFO [13:22:48] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:22:48] Entering EXPLORING state
 🟠 ACTION [13:22:49] Adding action to queue: exploreDrone Object
 🟠 ACTION [13:22:49] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:49] Attempting to find a tile to explore
 🔵 INFO [13:22:49] Using exploring radius: 3
 🔵 INFO [13:22:49] Found 19 walkable unexplored tiles in radius
 🟠 ACTION [13:22:49] Sending drone to explore tile: C1, distance: 1.00
 [PlayerStore] Moving player2/drone3 to tile: C1
 🟠 ACTION [13:22:49] Exploration started at 13:22:49
 🚀 MOUVEMENT [13:22:50] [UnifiedDroneMovement] Bot drone discovered new resources at C1: Object
 🚀 MOUVEMENT [13:22:50] [UnifiedDroneMovement] Bot exploration count increased to 4
 🟠 ACTION [13:22:50] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🚀 MOUVEMENT [13:22:50] [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [13:22:51] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:51] Drone has returned to ship, exploration sequence fully complete after 2.0s
 🟢 STATE [13:22:51] Transition: exploring → idle
 🟢 STATE [13:22:51] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [13:22:51] Transition: exploring → idle
 🟢 STATE [13:22:51] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:51] Bot status: Fuel=100, At base=true
 🟢 STATE [13:22:51] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:51] Bot status: Fuel=100, At base=true
 🟠 ACTION [13:22:52] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:22:52] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:22:52] Evaluating conditions from IDLE state
 🟣 CONDITION [13:22:52] Transition from IDLE to exploring (discovery)
 🟠 ACTION [13:22:52] Adding action to queue: exploreDrone Object
 🟢 STATE [13:22:52] Transition: idle → exploring
 🟢 STATE [13:22:52] Exiting IDLE state, transitioning to exploring
 🔵 INFO [13:22:52] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:22:52] Entering EXPLORING state
 🟠 ACTION [13:22:53] Adding action to queue: exploreDrone Object
 🟠 ACTION [13:22:53] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:53] Attempting to find a tile to explore
 🔵 INFO [13:22:53] Using exploring radius: 3
 🔵 INFO [13:22:53] Found 18 walkable unexplored tiles in radius
 🟠 ACTION [13:22:53] Sending drone to explore tile: C2, distance: 1.00
 [PlayerStore] Moving player2/drone3 to tile: C2
 🟠 ACTION [13:22:53] Exploration started at 13:22:53
 🚀 MOUVEMENT [13:22:54] [UnifiedDroneMovement] Bot drone discovered new resources at C2: Object
 🚀 MOUVEMENT [13:22:54] [UnifiedDroneMovement] Bot exploration count increased to 6
 🟠 ACTION [13:22:54] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🚀 MOUVEMENT [13:22:55] [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [13:22:55] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:55] Drone has returned to ship, exploration sequence fully complete after 2.0s
 🟢 STATE [13:22:55] Transition: exploring → idle
 🟢 STATE [13:22:55] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [13:22:55] Transition: exploring → idle
 🟢 STATE [13:22:55] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:55] Bot status: Fuel=100, At base=true
 🟢 STATE [13:22:55] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:55] Bot status: Fuel=100, At base=true
 🟠 ACTION [13:22:56] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:22:56] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:22:56] Evaluating conditions from IDLE state
 🟣 CONDITION [13:22:56] Transition from IDLE to exploring (discovery)
 🟠 ACTION [13:22:56] Adding action to queue: exploreDrone Object
 🟢 STATE [13:22:56] Transition: idle → exploring
 🟢 STATE [13:22:56] Exiting IDLE state, transitioning to exploring
 🔵 INFO [13:22:56] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:22:56] Entering EXPLORING state
 🟠 ACTION [13:22:57] Adding action to queue: exploreDrone Object
 🟠 ACTION [13:22:57] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [13:22:57] Attempting to find a tile to explore
 🔵 INFO [13:22:57] Using exploring radius: 3
 🔵 INFO [13:22:57] Found 17 walkable unexplored tiles in radius
 🟠 ACTION [13:22:57] Sending drone to explore tile: D0, distance: 1.00
 [PlayerStore] Moving player2/drone3 to tile: D0
 🟠 ACTION [13:22:57] Exploration started at 13:22:57
 🚀 MOUVEMENT [13:22:58] [UnifiedDroneMovement] Bot drone discovered new resources at D0: Object
 🚀 MOUVEMENT [13:22:58] [UnifiedDroneMovement] Bot exploration count increased to 8
 🚀 MOUVEMENT [13:22:58] [UnifiedDroneMovement] Drone for player2 returned to ship
 🟣 CONDITION [13:22:58] Exit condition met in state exploring: transitioning to idle (resources_discovered)
 🟢 STATE [13:22:58] Transition: exploring → idle
 🟢 STATE [13:22:58] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [13:22:58] Transition: exploring → idle
 🟢 STATE [13:22:58] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:58] Bot status: Fuel=100, At base=true
 🟢 STATE [13:22:58] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:22:58] Bot status: Fuel=100, At base=true
 🟠 ACTION [13:22:59] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:22:59] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:22:59] Evaluating conditions from IDLE state
 🟣 CONDITION [13:22:59] Transition from IDLE to collecting (efficiency)
 🟠 ACTION [13:22:59] Adding action to queue: moveToResource Object
 🟢 STATE [13:22:59] Transition: idle → collecting
 🟢 STATE [13:22:59] Exiting IDLE state, transitioning to collecting
 🔵 INFO [13:22:59] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:22:59] Entering COLLECTING state
 🟠 ACTION [13:23:00] Using dynamic default action for state collecting: moveToResource (priority: 2)
 🟠 ACTION [13:23:00] Adding action to queue: moveToResource Object
 🟠 ACTION [13:23:00] Execute: Start: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [13:23:00] Moving to resource at C2, value: 12877, distance: 1.00
 [PlayerStore] Moving player2/ship to tile: C2
 🚀 MOUVEMENT [13:23:00] [ShipMovement] player2 target changed, recalculating path to: C2
 🚀 MOUVEMENT [13:23:00] [ShipMovement] Calculating path for player2 from D1 to C2
 🚀 MOUVEMENT [13:23:00] [ShipMovement] Setting isMoving=true for player2/ship
 🚀 MOUVEMENT [13:23:01] [ShipMovement] player2/ship Arrived at destination
 🚀 MOUVEMENT [13:23:01] [ShipMovement] Finalizing movement for player2/ship to C2
 🟠 ACTION [13:23:01] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [13:23:01] Bot has reached resource at C2 after 1.0s
 🟠 ACTION [13:23:01] completed action: moveToResource Object
 🟠 ACTION [13:23:02] Bot is at resource location, adding collectResource action
 🟠 ACTION [13:23:02] Using dynamic default action for state collecting: collectResource (priority: 3)
 🟠 ACTION [13:23:02] Adding action to queue: collectResource Object
 🟠 ACTION [13:23:02] Execute: Start: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:02] Debug: collectResource called at position C2, state: false
 🟠 ACTION [13:23:02] Debug: Target resource coord: C2, Bot coord: C2
 🟠 ACTION [13:23:02] Starting resource collection at C2: {"food":83,"debris":6392,"special":1}
 🟠 ACTION [13:23:03] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:04] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:05] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:05] Resources collected: {"food":83,"debris":1000,"special":1}, remaining: {"food":0,"debris":5392,"special":0}
 🟠 ACTION [13:23:05] Collection completed. Returning to IDLE for next action decision.
 🟢 STATE [13:23:05] Transition: collecting → idle
 🟢 STATE [13:23:05] Exiting COLLECTING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:05] Transition: collecting → idle
 🟢 STATE [13:23:05] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:05] Bot status: Fuel=95, At base=false
 🟢 STATE [13:23:05] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:05] Bot status: Fuel=95, At base=false
 🟠 ACTION [13:23:05] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:05] completed action: evaluateIdle Object
 🟠 ACTION [13:23:06] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:06] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:06] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:06] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:06] Transition: idle → returning
 🟢 STATE [13:23:06] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:06] Transition details: Fuel=95, Resources={"food":83,"debris":1000,"special":1}
 🟢 STATE [13:23:06] Entering RETURNING state
 🟠 ACTION [13:23:07] Adding action to queue: returnToBase Object
 🟠 ACTION [13:23:07] Execute: Start: returnToBase (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:07] Moving bot to base at D1
 [PlayerStore] Moving player2/ship to tile: D1
 🚀 MOUVEMENT [13:23:07] [ShipMovement] player2 target changed, recalculating path to: D1
 🚀 MOUVEMENT [13:23:07] [ShipMovement] Calculating path for player2 from C2 to D1
 🚀 MOUVEMENT [13:23:07] [ShipMovement] Setting isMoving=true for player2/ship
 🚀 MOUVEMENT [13:23:08] [ShipMovement] player2/ship Arrived at destination
 🚀 MOUVEMENT [13:23:08] [ShipMovement] Finalizing movement for player2/ship to D1
 🟣 CONDITION [13:23:08] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:08] Adding action to queue: refuel Object
 🟢 STATE [13:23:08] Transition: returning → idle
 🟢 STATE [13:23:08] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:08] Transition: returning → idle
 🟢 STATE [13:23:08] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:08] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:08] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:08] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:09] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:09] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:09] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:09] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:09] Transition: idle → returning
 🟢 STATE [13:23:09] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:09] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:09] Entering RETURNING state
 🟣 CONDITION [13:23:10] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:10] Adding action to queue: refuel Object
 🟢 STATE [13:23:10] Transition: returning → idle
 🟢 STATE [13:23:10] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:10] Transition: returning → idle
 🟢 STATE [13:23:10] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:10] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:10] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:10] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:11] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:11] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:11] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:11] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:11] Transition: idle → returning
 🟢 STATE [13:23:11] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:11] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:11] Entering RETURNING state
 🟣 CONDITION [13:23:12] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:12] Adding action to queue: refuel Object
 🟢 STATE [13:23:12] Transition: returning → idle
 🟢 STATE [13:23:12] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:12] Transition: returning → idle
 🟢 STATE [13:23:12] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:12] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:12] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:12] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:13] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:13] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:13] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:13] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:13] Transition: idle → returning
 🟢 STATE [13:23:13] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:13] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:13] Entering RETURNING state
 🟣 CONDITION [13:23:14] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:14] Adding action to queue: refuel Object
 🟢 STATE [13:23:14] Transition: returning → idle
 🟢 STATE [13:23:14] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:14] Transition: returning → idle
 🟢 STATE [13:23:14] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:14] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:14] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:14] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:15] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:15] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:15] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:15] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:15] Transition: idle → returning
 🟢 STATE [13:23:15] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:15] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:15] Entering RETURNING state
 🟣 CONDITION [13:23:16] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:16] Adding action to queue: refuel Object
 🟢 STATE [13:23:16] Transition: returning → idle
 🟢 STATE [13:23:16] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:16] Transition: returning → idle
 🟢 STATE [13:23:16] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:16] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:16] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:16] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:17] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:17] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:17] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:17] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:17] Transition: idle → returning
 🟢 STATE [13:23:17] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:17] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:17] Entering RETURNING state
 🟣 CONDITION [13:23:18] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:18] Adding action to queue: refuel Object
 🟢 STATE [13:23:18] Transition: returning → idle
 🟢 STATE [13:23:18] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:18] Transition: returning → idle
 🟢 STATE [13:23:18] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:18] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:18] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:18] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:19] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:19] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:19] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:19] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:19] Transition: idle → returning
 🟢 STATE [13:23:19] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:19] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:19] Entering RETURNING state
 🟣 CONDITION [13:23:20] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:20] Adding action to queue: refuel Object
 🟢 STATE [13:23:20] Transition: returning → idle
 🟢 STATE [13:23:20] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:20] Transition: returning → idle
 🟢 STATE [13:23:20] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:20] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:20] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:20] Bot status: Fuel=90, At base=true
 🟠 ACTION [13:23:21] Adding action to queue: evaluateIdle Object
 🟠 ACTION [13:23:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [13:23:21] Evaluating conditions from IDLE state
 🟣 CONDITION [13:23:21] Transition from IDLE to returning (safety_critical)
 🟢 STATE [13:23:21] Transition: idle → returning
 🟢 STATE [13:23:21] Exiting IDLE state, transitioning to returning
 🔵 INFO [13:23:21] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [13:23:21] Entering RETURNING state
 🟣 CONDITION [13:23:22] Exit condition met in state returning: transitioning to idle (refueling)
 🟠 ACTION [13:23:22] Adding action to queue: refuel Object
 🟢 STATE [13:23:22] Transition: returning → idle
 🟢 STATE [13:23:22] Exiting RETURNING state - Returning to IDLE for evaluation
 🟢 STATE [13:23:22] Transition: returning → idle
 🟢 STATE [13:23:22] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:22] Bot status: Fuel=90, At base=true
 🟢 STATE [13:23:22] Entering IDLE state - Evaluating conditions
 🔵 INFO [13:23:22] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:23] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:23] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:23] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:23] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:23] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:23] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:23] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:23] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:24] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:24] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:24] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:24] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:24] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:24] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:24] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:25] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:25] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:25] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:25] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:25] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:25] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:25] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:25] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:26] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:26] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:26] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:26] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:26] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:26] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:26] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:27] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:27] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:27] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:27] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:27] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:27] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:27] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:27] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:28] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:28] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:28] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:28] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:28] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:28] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:28] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:28] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:28] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:29] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:29] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:29] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:29] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:29] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:29] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:29] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:29] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:30] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:30] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:30] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:30] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:30] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:30] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:30] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:31] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:31] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:31] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:31] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:31] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:31] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:31] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:31] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:32] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:32] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:32] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:32] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:32] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:32] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:32] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:33] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:33] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:33] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:33] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:33] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:33] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:33] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:33] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:34] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:34] Adding action to queue: refuel Object
fsmLogger.js:100 🟢 STATE [13:23:34] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:34] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:34] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:34] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:34] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:35] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [13:23:35] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:35] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:35] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:35] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:35] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:35] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:35] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:36] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:36] Adding action to queue: refuel {priority: 3}
fsmLogger.js:100 🟢 STATE [13:23:36] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:36] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:36] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:36] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:36] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:36] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:36] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:37] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [13:23:37] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:37] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:37] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:37] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:37] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:37] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:37] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:38] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:38] Adding action to queue: refuel {priority: 3}
fsmLogger.js:100 🟢 STATE [13:23:38] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:38] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:38] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:38] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:38] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:38] Bot status: Fuel=90, At base=true
fsmLogger.js:93 🟠 ACTION [13:23:39] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [13:23:39] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [13:23:39] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [13:23:39] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [13:23:39] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [13:23:39] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [13:23:39] Transition details: Fuel=90, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [13:23:39] Entering RETURNING state
fsmLogger.js:100 🟣 CONDITION [13:23:40] Exit condition met in state returning: transitioning to idle (refueling)
fsmLogger.js:93 🟠 ACTION [13:23:40] Adding action to queue: refuel {priority: 3}
fsmLogger.js:100 🟢 STATE [13:23:40] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:40] Exiting RETURNING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [13:23:40] Transition: returning → idle
fsmLogger.js:100 🟢 STATE [13:23:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:40] Bot status: Fuel=90, At base=true
fsmLogger.js:100 🟢 STATE [13:23:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [13:23:40] Bot status: Fuel=90, At base=true
