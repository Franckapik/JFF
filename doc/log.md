Scene.jsx:26 [Scene] Initializing tiles...
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:38 [Scene] Initializing bot...
fsmLogger.js:96 🔵 INFO [23:20:26] Initializing bot FSM
fsmLogger.js:96 🟢 STATE [23:20:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:26] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:20:26] Adding action to queue: testQueue {priority: 4}
fsmLogger.js:89 🟠 ACTION [23:20:26] Adding action to queue: exploreDrone {priority: 3}
fsmLogger.js:89 🟠 ACTION [23:20:26] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:96 🟢 STATE [23:20:26] Bot initialized in IDLE state with testQueue action
ShipMovement.jsx:117 Setting initial position: {x: -2.7, y: 0, z: 1.5588457268119895}
ShipMovement.jsx:117 Setting initial position: {x: 2.7, y: 0, z: -1.5588457268119895}
App.jsx:24 [App] Starting bot processing with setInterval
fsmLogger.js:96 🟠 ACTION [23:20:27] Execute: Start: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:27] Starting test queue action - Will complete in 5 seconds
fsmLogger.js:96 🟠 ACTION [23:20:28] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:28] Test queue action in progress: 1.0s / 5s
fsmLogger.js:96 🟠 ACTION [23:20:29] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:29] Test queue action in progress: 2.0s / 5s
fsmLogger.js:96 🟠 ACTION [23:20:30] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:30] Test queue action in progress: 3.0s / 5s
fsmLogger.js:96 🟠 ACTION [23:20:31] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:31] Test queue action in progress: 4.0s / 5s
fsmLogger.js:96 🟠 ACTION [23:20:32] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:32] Test queue action completed after 5.0 seconds
fsmLogger.js:89 🟠 ACTION [23:20:32] completed action: testQueue {elapsed: 6014}
fsmLogger.js:96 🟠 ACTION [23:20:33] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:33] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:20:33] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:20:33] Found 22 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:20:33] Sending drone to explore tile: F2, distance: 0.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: F2
fsmLogger.js:96 🟠 ACTION [23:20:33] Exploration started at 23:20:33
fsmLogger.js:96 🟠 ACTION [23:20:34] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [23:20:35] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:35] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:89 🟠 ACTION [23:20:35] completed action: exploreDrone {elapsed: 9014}
fsmLogger.js:96 🟠 ACTION [23:20:36] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:36] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:20:36] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [23:20:36] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [23:20:36] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [23:20:36] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:20:36] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [23:20:36] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:20:36] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:20:37] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:20:37] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:37] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:20:37] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:20:37] Found 21 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:20:37] Sending drone to explore tile: E2, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: E2
fsmLogger.js:96 🟠 ACTION [23:20:37] Exploration started at 23:20:37
fsmLogger.js:96 🟠 ACTION [23:20:38] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:39] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:39] Exploration in progress: 2.0s elapsed
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at E2: {food: 74, debris: 1513, special: 2}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 4
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [23:20:40] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:41] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [23:20:42] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:42] Drone has returned to ship, exploration sequence fully complete after 5.0s
fsmLogger.js:96 🟢 STATE [23:20:42] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:42] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:20:42] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:42] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:42] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [23:20:42] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:42] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:20:43] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:20:43] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:43] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:20:43] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [23:20:43] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [23:20:43] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [23:20:43] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:20:43] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [23:20:43] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:20:43] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:20:44] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:20:44] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:44] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:20:44] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:20:44] Found 20 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:20:44] Sending drone to explore tile: E3, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: E3
fsmLogger.js:96 🟠 ACTION [23:20:44] Exploration started at 23:20:44
fsmLogger.js:96 🟠 ACTION [23:20:45] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:46] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:47] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at E3: {food: 32, debris: 8877, special: 0}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [23:20:48] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:49] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:50] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:51] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [23:20:52] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:52] Drone has returned to ship, exploration sequence fully complete after 8.0s
fsmLogger.js:96 🟢 STATE [23:20:52] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:52] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:20:52] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:52] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [23:20:52] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:52] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [23:20:53] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:20:53] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:53] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:20:53] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [23:20:53] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [23:20:53] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [23:20:53] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:20:53] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [23:20:53] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:20:53] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:20:54] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:20:54] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:54] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [23:20:54] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [23:20:54] Found 19 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [23:20:54] Sending drone to explore tile: F1, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:96 🟠 ACTION [23:20:54] Exploration started at 23:20:54
fsmLogger.js:96 🟠 ACTION [23:20:55] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:55] Exploration in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:20:56] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:56] Exploration in progress: 2.0s elapsed
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at F1: {food: 78, debris: 2685, special: 1}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [23:20:57] Exit condition met in state exploring: transitioning to idle
fsmLogger.js:96 🟢 STATE [23:20:57] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:57] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:20:57] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [23:20:57] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:57] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [23:20:57] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:20:57] Bot status: Fuel=100, At base=true
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:89 🟠 ACTION [23:20:58] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:20:58] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:58] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:20:58] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:20:58] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:20:58] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:20:58] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:20:58] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:20:58] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:20:58] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:20:59] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:20:59] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:20:59] Moving to resource at E3, value: 17786, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/ship to tile: E3
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: E3
ShipMovement.jsx:102 Calculating path for player2 from F2 to E3
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:96 🟠 ACTION [23:21:00] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:00] Moving to resource in progress: 1.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:01] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:01] Moving to resource in progress: 2.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:02] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:02] Moving to resource in progress: 3.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:03] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:03] Moving to resource in progress: 4.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:04] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:04] Moving to resource in progress: 5.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:05] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:05] Moving to resource in progress: 6.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:06] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:06] Moving to resource in progress: 7.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:07] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:07] Moving to resource in progress: 8.0s elapsed
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to E3
fsmLogger.js:96 🟠 ACTION [23:21:08] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:08] Moving to resource in progress: 9.0s elapsed
fsmLogger.js:96 🟠 ACTION [23:21:08] Bot has reached resource at E3 after 9.0s
fsmLogger.js:96 🟢 STATE [23:21:08] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:08] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:08] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:08] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:08] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:09] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:09] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:09] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:09] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:09] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:09] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:09] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:09] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:09] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:09] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:10] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:10] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:10] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:10] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:10] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:10] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:10] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:10] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:10] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:10] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:11] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:11] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:11] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:11] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:11] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:11] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:11] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:11] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:11] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:11] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:12] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:12] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:12] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:12] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:12] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:12] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:12] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:12] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:13] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:13] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:13] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:13] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:13] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:13] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:13] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:13] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:13] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:13] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:14] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:14] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:14] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:14] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:14] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:14] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:14] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:14] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:14] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:14] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:15] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:15] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:15] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:15] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:15] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:15] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:15] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:15] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:15] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:15] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:16] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:16] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:16] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:16] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:16] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:16] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:16] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:16] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:17] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:17] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:17] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:17] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:17] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:17] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:17] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:17] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:17] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:17] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:18] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:18] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:18] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:18] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:18] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:18] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:18] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:18] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:18] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:18] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:19] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:19] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:19] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:19] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:19] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:19] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:19] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:19] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:19] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:19] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:20] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:20] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:20] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:20] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:20] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:20] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:20] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:20] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:21] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:21] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:21] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:21] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:21] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:21] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:21] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:21] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:21] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:22] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:22] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:22] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:22] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:22] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:22] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:22] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:22] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:22] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:22] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:23] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:23] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:23] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:23] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:23] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:23] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:23] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:23] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:23] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:23] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:24] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:24] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:24] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:24] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:24] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:24] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:24] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:24] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:24] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:25] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:25] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:25] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:25] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:25] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:25] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:25] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:25] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:25] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:25] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:26] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:26] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:26] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:26] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:26] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:26] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:26] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:26] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:26] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:27] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:27] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:27] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:27] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:27] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:27] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:27] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:27] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:27] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:27] completed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [23:21:28] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:28] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:28] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:28] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:28] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:28] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:28] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:28] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:28] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:28] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:29] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:29] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:29] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:29] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:29] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:29] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:29] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:29] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:29] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:29] completed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [23:21:30] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:30] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:30] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:30] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:30] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:30] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:30] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:30] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:31] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:31] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:31] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:31] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:31] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:31] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:31] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:31] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:31] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:31] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [23:21:32] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:32] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:32] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:32] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:32] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:32] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:32] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:32] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:32] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:33] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:33] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:33] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:33] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:33] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:33] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:33] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:33] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:33] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:33] completed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [23:21:34] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [23:21:34] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:34] Bot already at resource location E3, transitioning to IDLE
fsmLogger.js:96 🟢 STATE [23:21:34] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:34] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [23:21:34] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [23:21:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:34] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [23:21:34] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [23:21:34] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [23:21:35] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [23:21:35] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [23:21:35] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [23:21:35] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [23:21:35] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [23:21:35] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [23:21:35] Transition details: Fuel=95, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [23:21:35] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [23:21:35] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [23:21:35] completed action: moveToResource {elapsed: 0}
