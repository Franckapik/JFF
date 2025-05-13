 [Scene] Initializing tiles...
 [Scene] Initializing players with tiles: Object
 [Scene] Initializing bot...
 🔵 INFO [12:22:07] Initializing bot FSM
 🟢 STATE [12:22:07] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:22:07] Bot status: Fuel=100, At base=true
 🟠 ACTION [12:22:07] Adding action to queue: testQueue Object
 🟠 ACTION [12:22:07] Adding action to queue: exploreDrone Object
 🟠 ACTION [12:22:07] Adding action to queue: evaluateIdle Object
 🟢 STATE [12:22:07] Bot initialized in IDLE state with testQueue action
 Setting initial position: Object
 Setting initial position: Object
 [App] Starting bot processing with setInterval
:5173/favicon.ico:1  Failed to load resource: the server responded with a status of 404 (Not Found)
 🟠 ACTION [12:22:08] Execute: Start: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:08] Starting test queue action - Will complete in 5 seconds
 🟠 ACTION [12:22:09] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:09] Test queue action in progress: 1.0s / 5s
 🟠 ACTION [12:22:10] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:11] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:12] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:13] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:14] Execute: Continue: testQueue (priority: 4) (priority: undefined)
 🟠 ACTION [12:22:14] Test queue action completed after 6.0 seconds
 🟠 ACTION [12:22:14] completed action: testQueue Object
 🟠 ACTION [12:22:15] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
 🟠 ACTION [12:22:15] Attempting to find a tile to explore
 🔵 INFO [12:22:15] Using exploring radius: 3
 🔵 INFO [12:22:15] Found 20 walkable unexplored tiles in radius
 🟠 ACTION [12:22:15] Sending drone to explore tile: E1, distance: 0.00
 [PlayerStore] Moving player2/drone3 to tile: E1
 🟠 ACTION [12:22:15] Exploration started at 12:22:15
 [UnifiedDroneMovement] Bot exploration count increased to 2
 [Scene] Initializing players with tiles: Object
 [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [12:22:16] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
 🟠 ACTION [12:22:16] Drone has returned to ship, exploration sequence fully complete after 1.0s
 🟠 ACTION [12:22:16] completed action: exploreDrone Object
 🟠 ACTION [12:22:17] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [12:22:17] Evaluating conditions from IDLE state using centralized conditions
 🟣 CONDITION [12:22:17] Condition centrale satisfaite: transition vers exploring
 🟢 STATE [12:22:17] Transition: idle → exploring
 🟢 STATE [12:22:17] Exiting IDLE state, transitioning to exploring
 🔵 INFO [12:22:17] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [12:22:17] Entering EXPLORING state
 🟠 ACTION [12:22:17] Adding action to queue: exploreDrone Object
 🟠 ACTION [12:22:17] completed action: exploreDrone Object
 🟠 ACTION [12:22:18] Adding action to queue: exploreDrone Object
 🟠 ACTION [12:22:18] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [12:22:18] Attempting to find a tile to explore
 🔵 INFO [12:22:18] Using exploring radius: 3
 🔵 INFO [12:22:18] Found 19 walkable unexplored tiles in radius
 🟠 ACTION [12:22:18] Sending drone to explore tile: D1, distance: 1.00
 [PlayerStore] Moving player2/drone3 to tile: D1
 🟠 ACTION [12:22:18] Exploration started at 12:22:18
 [UnifiedDroneMovement] Bot drone discovered new resources at D1: Object
 [UnifiedDroneMovement] Bot exploration count increased to 4
 [Scene] Initializing players with tiles: Object
 🟠 ACTION [12:22:19] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [12:22:20] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [12:22:20] Drone has returned to ship, exploration sequence fully complete after 2.0s
 🟢 STATE [12:22:20] Transition: exploring → idle
 🟢 STATE [12:22:20] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [12:22:20] Transition: exploring → idle
 🟢 STATE [12:22:20] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:22:20] Bot status: Fuel=100, At base=true
 🟢 STATE [12:22:20] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:22:20] Bot status: Fuel=100, At base=true
 🟠 ACTION [12:22:21] Adding action to queue: evaluateIdle Object
 🟠 ACTION [12:22:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [12:22:21] Evaluating conditions from IDLE state using centralized conditions
 🟣 CONDITION [12:22:21] Condition centrale satisfaite: transition vers exploring
 🟢 STATE [12:22:21] Transition: idle → exploring
 🟢 STATE [12:22:21] Exiting IDLE state, transitioning to exploring
 🔵 INFO [12:22:21] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [12:22:21] Entering EXPLORING state
 🟠 ACTION [12:22:21] Adding action to queue: exploreDrone Object
 🟠 ACTION [12:22:21] completed action: exploreDrone Object
 🟠 ACTION [12:22:22] Adding action to queue: exploreDrone Object
 🟠 ACTION [12:22:22] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [12:22:22] Attempting to find a tile to explore
 🔵 INFO [12:22:22] Using exploring radius: 3
 🔵 INFO [12:22:22] Found 18 walkable unexplored tiles in radius
 🟠 ACTION [12:22:22] Sending drone to explore tile: D2, distance: 1.00
 [PlayerStore] Moving player2/drone3 to tile: D2
 🟠 ACTION [12:22:22] Exploration started at 12:22:22
 [UnifiedDroneMovement] Bot exploration count increased to 6
 [Scene] Initializing players with tiles: Object
 🟠 ACTION [12:22:23] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 [UnifiedDroneMovement] Drone for player2 returned to ship
 🟠 ACTION [12:22:24] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [12:22:24] Drone has returned to ship, exploration sequence fully complete after 2.0s
 🟢 STATE [12:22:24] Transition: exploring → idle
 🟢 STATE [12:22:24] Exiting EXPLORING state - Returning to IDLE for evaluation
 🟢 STATE [12:22:24] Transition: exploring → idle
 🟢 STATE [12:22:24] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:22:24] Bot status: Fuel=100, At base=true
 🟢 STATE [12:22:24] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:22:24] Bot status: Fuel=100, At base=true
 🟠 ACTION [12:22:25] Adding action to queue: evaluateIdle Object
 🟠 ACTION [12:22:25] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [12:22:25] Evaluating conditions from IDLE state using centralized conditions
 🟣 CONDITION [12:22:25] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:22:25] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:22:25] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:22:25] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:25] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:22:25] Adding action to queue: exploreDrone Object
fsmLogger.js:89 🟠 ACTION [12:22:25] completed action: exploreDrone Object
fsmLogger.js:89 🟠 ACTION [12:22:26] Adding action to queue: exploreDrone Object
fsmLogger.js:96 🟠 ACTION [12:22:26] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:26] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [12:22:26] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [12:22:26] Found 17 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [12:22:26] Sending drone to explore tile: E0, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: E0
fsmLogger.js:96 🟠 ACTION [12:22:26] Exploration started at 12:22:26
UnifiedDroneMovement.jsx:237 [UnifiedDroneMovement] Bot drone discovered new resources at E0: Object
UnifiedDroneMovement.jsx:281 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:33 [Scene] Initializing players with tiles: Object
UnifiedDroneMovement.jsx:178 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [12:22:27] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:27] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:96 🟢 STATE [12:22:27] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:22:27] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:22:27] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:22:27] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:27] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [12:22:27] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:27] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [12:22:28] Adding action to queue: evaluateIdle Object
fsmLogger.js:96 🟠 ACTION [12:22:28] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:28] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:22:28] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:22:28] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:22:28] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:22:28] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:28] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:22:28] Adding action to queue: exploreDrone Object
fsmLogger.js:89 🟠 ACTION [12:22:28] completed action: exploreDrone Object
fsmLogger.js:89 🟠 ACTION [12:22:29] Adding action to queue: exploreDrone Object
fsmLogger.js:96 🟠 ACTION [12:22:29] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:29] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [12:22:29] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [12:22:29] Found 16 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [12:22:29] Sending drone to explore tile: F0, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: F0
fsmLogger.js:96 🟠 ACTION [12:22:29] Exploration started at 12:22:29
UnifiedDroneMovement.jsx:237 [UnifiedDroneMovement] Bot drone discovered new resources at F0: Object
UnifiedDroneMovement.jsx:281 [UnifiedDroneMovement] Bot exploration count increased to 10
Scene.jsx:33 [Scene] Initializing players with tiles: Object
fsmLogger.js:96 🟣 CONDITION [12:22:30] Exit condition met in state exploring: transitioning to idle
fsmLogger.js:96 🟢 STATE [12:22:30] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:22:30] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:22:30] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:22:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:30] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [12:22:30] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:30] Bot status: Fuel=100, At base=true
UnifiedDroneMovement.jsx:178 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:89 🟠 ACTION [12:22:31] Adding action to queue: evaluateIdle Object
fsmLogger.js:96 🟠 ACTION [12:22:31] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:31] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:22:31] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [12:22:31] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [12:22:31] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [12:22:31] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:31] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [12:22:31] Adding action to queue: moveToResource Object
fsmLogger.js:89 🟠 ACTION [12:22:31] completed action: moveToResource Object
fsmLogger.js:89 🟠 ACTION [12:22:32] Adding action to queue: moveToResource Object
fsmLogger.js:96 🟠 ACTION [12:22:32] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:32] Moving to resource at D1, value: 18692, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: D1
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: D1
ShipMovement.jsx:102 Calculating path for player2 from E1 to D1
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to D1
fsmLogger.js:96 🟠 ACTION [12:22:33] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:33] Bot has reached resource at D1 after 1.0s
fsmLogger.js:96 🟢 STATE [12:22:33] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:33] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:22:33] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:33] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:33] Bot status: Fuel=95, At base=false
fsmLogger.js:96 🟢 STATE [12:22:33] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:33] Bot status: Fuel=95, At base=false
fsmLogger.js:89 🟠 ACTION [12:22:34] Adding action to queue: evaluateIdle Object
fsmLogger.js:96 🟠 ACTION [12:22:34] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:34] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:22:34] Bot est déjà sur une tuile ressource à D1, collecte directe sans changer d'état
fsmLogger.js:89 🟠 ACTION [12:22:34] Adding action to queue: collectResource Object
fsmLogger.js:89 🟠 ACTION [12:22:34] completed action: evaluateIdle Object
fsmLogger.js:96 🟠 ACTION [12:22:35] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:35] Debug: collectResource called at position D1, state: false
fsmLogger.js:96 🟠 ACTION [12:22:35] Debug: Target resource coord: D1, Bot coord: D1
fsmLogger.js:96 🟠 ACTION [12:22:35] Starting resource collection at D1: {"food":60,"debris":9316,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:36] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:37] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:38] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:39] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:40] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:41] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:41] Resources collected successfully: {"food":60,"debris":9316,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:41] More resources available, continuing collection
fsmLogger.js:96 🟢 STATE [12:22:41] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [12:22:41] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [12:22:41] Transition details: Fuel=95, Resources={"food":60,"debris":9316,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:41] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [12:22:41] Adding action to queue: moveToResource Object
fsmLogger.js:89 🟠 ACTION [12:22:41] completed action: moveToResource Object
Scene.jsx:33 [Scene] Initializing players with tiles: Object
fsmLogger.js:89 🟠 ACTION [12:22:42] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:22:42] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:42] Moving to resource at F0, value: 17450, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: F0
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: F0
ShipMovement.jsx:102 Calculating path for player2 from E1 to F0
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:96 🟠 ACTION [12:22:43] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to F0
fsmLogger.js:96 🟠 ACTION [12:22:44] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:44] Bot has reached resource at F0 after 2.0s
fsmLogger.js:96 🟢 STATE [12:22:44] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:44] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:22:44] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:44] Bot status: Fuel=85, At base=false
fsmLogger.js:96 🟢 STATE [12:22:44] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:44] Bot status: Fuel=85, At base=false
fsmLogger.js:89 🟠 ACTION [12:22:45] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:22:45] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:45] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:22:45] Bot est déjà sur une tuile ressource à F0, collecte directe sans changer d'état
fsmLogger.js:89 🟠 ACTION [12:22:45] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [12:22:45] completed action: evaluateIdle {elapsed: 2}
fsmLogger.js:96 🟠 ACTION [12:22:46] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:46] Debug: collectResource called at position F0, state: false
fsmLogger.js:96 🟠 ACTION [12:22:46] Debug: Target resource coord: F0, Bot coord: F0
fsmLogger.js:96 🟠 ACTION [12:22:46] Starting resource collection at F0: {"food":10,"debris":8720,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:47] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:48] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:49] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:50] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:51] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:52] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:52] Resources collected successfully: {"food":10,"debris":8720,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:52] More resources available, continuing collection
fsmLogger.js:96 🟢 STATE [12:22:52] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [12:22:52] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [12:22:52] Transition details: Fuel=85, Resources={"food":70,"debris":18036,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:52] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [12:22:52] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:22:52] completed action: moveToResource {elapsed: 1}
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:89 🟠 ACTION [12:22:53] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:22:53] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:53] Moving to resource at E0, value: 616, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: E0
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: E0
ShipMovement.jsx:102 Calculating path for player2 from E1 to E0
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to E0
fsmLogger.js:96 🟠 ACTION [12:22:54] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:54] Bot has reached resource at E0 after 1.0s
fsmLogger.js:96 🟢 STATE [12:22:54] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:54] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:22:54] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:22:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:54] Bot status: Fuel=80, At base=false
fsmLogger.js:96 🟢 STATE [12:22:54] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:22:54] Bot status: Fuel=80, At base=false
fsmLogger.js:89 🟠 ACTION [12:22:55] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:22:55] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:55] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:22:55] Bot est déjà sur une tuile ressource à E0, collecte directe sans changer d'état
fsmLogger.js:89 🟠 ACTION [12:22:55] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [12:22:55] completed action: evaluateIdle {elapsed: 2}
fsmLogger.js:96 🟠 ACTION [12:22:56] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:56] Debug: collectResource called at position E0, state: false
fsmLogger.js:96 🟠 ACTION [12:22:56] Debug: Target resource coord: E0, Bot coord: E0
fsmLogger.js:96 🟠 ACTION [12:22:56] Starting resource collection at E0: {"food":84,"debris":266,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:57] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:58] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:59] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:22:59] Resources collected successfully: {"food":84,"debris":266,"special":0}
fsmLogger.js:96 🟠 ACTION [12:22:59] More resources available, continuing collection
fsmLogger.js:96 🟢 STATE [12:22:59] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [12:22:59] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [12:22:59] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:22:59] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [12:22:59] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:22:59] completed action: moveToResource {elapsed: 0}
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [12:23:00] Exit condition met in state collecting: transitioning to idle
fsmLogger.js:96 🟢 STATE [12:23:00] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:23:00] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:00] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:23:00] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:00] Bot status: Fuel=80, At base=true
fsmLogger.js:96 🟢 STATE [12:23:00] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:00] Bot status: Fuel=80, At base=true
fsmLogger.js:89 🟠 ACTION [12:23:01] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:01] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:01] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:01] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:23:01] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:23:01] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:23:01] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:23:01] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:23:01] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:23:01] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [12:23:02] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:23:02] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:02] Drone has returned to ship, exploration sequence fully complete after 33.0s
fsmLogger.js:96 🟢 STATE [12:23:02] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:02] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:02] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:02] Bot status: Fuel=80, At base=true
fsmLogger.js:96 🟢 STATE [12:23:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:02] Bot status: Fuel=80, At base=true
fsmLogger.js:89 🟠 ACTION [12:23:03] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:03] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:03] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:03] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:23:03] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:23:03] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:23:03] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:23:03] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:23:03] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:23:03] completed action: exploreDrone {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [12:23:04] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:23:04] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:04] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [12:23:04] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [12:23:04] Found 15 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [12:23:04] Sending drone to explore tile: F1, distance: 1.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:96 🟠 ACTION [12:23:04] Exploration started at 12:23:04
fsmLogger.js:96 🟠 ACTION [12:23:05] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:237 [UnifiedDroneMovement] Bot drone discovered new resources at F1: {food: 3, debris: 2308, special: 2}
UnifiedDroneMovement.jsx:281 [UnifiedDroneMovement] Bot exploration count increased to 12
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [12:23:06] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:178 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [12:23:07] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:07] Drone has returned to ship, exploration sequence fully complete after 3.0s
fsmLogger.js:96 🟢 STATE [12:23:07] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:07] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:07] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:07] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:07] Bot status: Fuel=80, At base=true
fsmLogger.js:96 🟢 STATE [12:23:07] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:07] Bot status: Fuel=80, At base=true
fsmLogger.js:89 🟠 ACTION [12:23:08] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:08] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:08] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:08] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:23:08] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:23:08] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:23:08] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:23:08] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:23:08] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:23:08] completed action: exploreDrone {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [12:23:09] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:23:09] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:09] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [12:23:09] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [12:23:09] Found 14 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [12:23:09] Sending drone to explore tile: C1, distance: 2.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: C1
fsmLogger.js:96 🟠 ACTION [12:23:09] Exploration started at 12:23:09
fsmLogger.js:96 🟠 ACTION [12:23:10] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:237 [UnifiedDroneMovement] Bot drone discovered new resources at C1: {food: 54, debris: 1737, special: 1}
UnifiedDroneMovement.jsx:281 [UnifiedDroneMovement] Bot exploration count increased to 14
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [12:23:11] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:178 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [12:23:12] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:12] Drone has returned to ship, exploration sequence fully complete after 3.0s
fsmLogger.js:96 🟢 STATE [12:23:12] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:12] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:12] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:12] Bot status: Fuel=80, At base=true
fsmLogger.js:96 🟢 STATE [12:23:12] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:12] Bot status: Fuel=80, At base=true
fsmLogger.js:89 🟠 ACTION [12:23:13] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:13] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:13] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:13] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [12:23:13] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [12:23:13] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [12:23:13] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:23:13] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [12:23:13] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:23:13] completed action: exploreDrone {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [12:23:14] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:23:14] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:14] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [12:23:14] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [12:23:14] Found 13 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [12:23:14] Sending drone to explore tile: C2, distance: 2.00
usePlayerStore.js:278 [PlayerStore] Moving player2/drone3 to tile: C2
fsmLogger.js:96 🟠 ACTION [12:23:14] Exploration started at 12:23:14
fsmLogger.js:96 🟠 ACTION [12:23:15] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:237 [UnifiedDroneMovement] Bot drone discovered new resources at C2: {food: 10, debris: 7360, special: 2}
UnifiedDroneMovement.jsx:281 [UnifiedDroneMovement] Bot exploration count increased to 16
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [12:23:16] Exit condition met in state exploring: transitioning to idle
fsmLogger.js:96 🟢 STATE [12:23:16] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:16] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:16] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [12:23:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:16] Bot status: Fuel=80, At base=true
fsmLogger.js:96 🟢 STATE [12:23:16] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:16] Bot status: Fuel=80, At base=true
UnifiedDroneMovement.jsx:178 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:89 🟠 ACTION [12:23:17] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:17] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:17] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:17] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [12:23:17] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [12:23:17] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [12:23:17] Transition details: Fuel=80, Resources={"food":154,"debris":18302,"special":0}
fsmLogger.js:96 🟢 STATE [12:23:17] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [12:23:17] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [12:23:17] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [12:23:18] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [12:23:18] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:18] Moving to resource at C2, value: 14750, distance: 2.00
usePlayerStore.js:278 [PlayerStore] Moving player2/ship to tile: C2
ShipMovement.jsx:131 [player2] Target changed, recalculating path to: C2
ShipMovement.jsx:102 Calculating path for player2 from E1 to C2
ShipMovement.jsx:79 [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:96 🟠 ACTION [12:23:19] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
ShipMovement.jsx:207 [player2/ship] Arrived at destination
ShipMovement.jsx:53 [ShipMovement] Finalizing movement for player2/ship to C2
fsmLogger.js:96 🟠 ACTION [12:23:20] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:20] Bot has reached resource at C2 after 2.0s
fsmLogger.js:96 🟢 STATE [12:23:20] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:23:20] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [12:23:20] Transition: collecting → idle
fsmLogger.js:96 🟢 STATE [12:23:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:20] Bot status: Fuel=70, At base=false
fsmLogger.js:96 🟢 STATE [12:23:20] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [12:23:20] Bot status: Fuel=70, At base=false
fsmLogger.js:89 🟠 ACTION [12:23:21] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [12:23:21] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:21] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [12:23:21] Bot est déjà sur une tuile ressource à C2, collecte directe sans changer d'état
fsmLogger.js:89 🟠 ACTION [12:23:21] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:89 🟠 ACTION [12:23:21] completed action: evaluateIdle {elapsed: 2}
fsmLogger.js:96 🟠 ACTION [12:23:22] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:22] Debug: collectResource called at position C2, state: false
fsmLogger.js:96 🟠 ACTION [12:23:22] Debug: Target resource coord: C2, Bot coord: C2
fsmLogger.js:96 🟠 ACTION [12:23:22] Starting resource collection at C2: {"food":10,"debris":7360,"special":2}
fsmLogger.js:96 🟠 ACTION [12:23:23] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:23] Resource collection in progress: 20% (1.0s/5.0s)
fsmLogger.js:96 🟠 ACTION [12:23:24] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:25] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [12:23:25] Resource collection in progress: 60% (3.0s/5.0s)
 🟠 ACTION [12:23:26] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:26] Resource collection in progress: 80% (4.0s/5.0s)
 🟠 ACTION [12:23:27] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:27] Resource collection in progress: 100% (5.0s/5.0s)
 🟠 ACTION [12:23:27] Resources collected successfully: {"food":10,"debris":7360,"special":2}
 🟠 ACTION [12:23:27] More resources available, continuing collection
 🟢 STATE [12:23:27] Transition: idle → collecting
 🟢 STATE [12:23:27] Exiting IDLE state, transitioning to collecting
 🔵 INFO [12:23:27] Transition details: Fuel=70, Resources={"food":164,"debris":25662,"special":2}
 🟢 STATE [12:23:27] Entering COLLECTING state
 🟠 ACTION [12:23:27] Adding action to queue: moveToResource {priority: 2}
 🟠 ACTION [12:23:27] completed action: moveToResource {elapsed: 0}
 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
 🟠 ACTION [12:23:28] Adding action to queue: moveToResource {priority: 2}
 🟠 ACTION [12:23:28] Execute: Start: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [12:23:28] Moving to resource at F1, value: 4639, distance: 1.00
 [PlayerStore] Moving player2/ship to tile: F1
 [player2] Target changed, recalculating path to: F1
 Calculating path for player2 from E1 to F1
 [ShipMovement] Setting isMoving=true for player2/ship
 🟠 ACTION [12:23:29] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [12:23:29] Moving to resource in progress: 1.0s elapsed
 🟠 ACTION [12:23:30] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [12:23:30] Moving to resource in progress: 2.0s elapsed
 [player2/ship] Arrived at destination
 [ShipMovement] Finalizing movement for player2/ship to F1
 🟠 ACTION [12:23:31] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [12:23:31] Bot has reached resource at F1 after 3.0s
 🟢 STATE [12:23:31] Transition: collecting → idle
 🟢 STATE [12:23:31] Exiting COLLECTING state - Returning to IDLE for evaluation
 🟢 STATE [12:23:31] Transition: collecting → idle
 🟢 STATE [12:23:31] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:23:31] Bot status: Fuel=55, At base=false
 🟢 STATE [12:23:31] Entering IDLE state - Evaluating conditions
 🔵 INFO [12:23:31] Bot status: Fuel=55, At base=false
 🟠 ACTION [12:23:32] Adding action to queue: evaluateIdle {priority: 3}
 🟠 ACTION [12:23:32] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:32] Evaluating conditions from IDLE state using centralized conditions
 🟣 CONDITION [12:23:32] Bot est déjà sur une tuile ressource à F1, collecte directe sans changer d'état
 🟠 ACTION [12:23:32] Adding action to queue: collectResource {priority: 3}
 🟠 ACTION [12:23:32] completed action: evaluateIdle {elapsed: 1}
 🟠 ACTION [12:23:33] Execute: Start: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:33] Debug: collectResource called at position F1, state: false
 🟠 ACTION [12:23:33] Debug: Target resource coord: F1, Bot coord: F1
 🟠 ACTION [12:23:33] Starting resource collection at F1: {"food":3,"debris":2308,"special":2}
 🟠 ACTION [12:23:34] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:34] Resource collection in progress: 43% (1.0s/2.3s)
 🟠 ACTION [12:23:35] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:35] Resource collection in progress: 86% (2.0s/2.3s)
 🟠 ACTION [12:23:36] Execute: Continue: collectResource (priority: 3) (priority: undefined)
 🟠 ACTION [12:23:36] Resource collection in progress: 100% (3.0s/2.3s)
 🟠 ACTION [12:23:36] Resources collected successfully: {"food":3,"debris":2308,"special":2}
 🟠 ACTION [12:23:36] More resources available, continuing collection
 🟢 STATE [12:23:36] Transition: idle → collecting
 🟢 STATE [12:23:36] Exiting IDLE state, transitioning to collecting
 🔵 INFO [12:23:36] Transition details: Fuel=55, Resources={"food":167,"debris":27970,"special":4}
 🟢 STATE [12:23:36] Entering COLLECTING state
 🟠 ACTION [12:23:36] Adding action to queue: moveToResource {priority: 2}
 🟠 ACTION [12:23:36] completed action: moveToResource {elapsed: 0}
 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
 🟠 ACTION [12:23:37] Adding action to queue: moveToResource {priority: 2}
 🟠 ACTION [12:23:37] Execute: Start: moveToResource (priority: 2) (priority: undefined)
 🟠 ACTION [12:23:37] Moving to resource at C1, value: 3538, distance: 2.00
 [PlayerStore] Moving player2/ship to tile: C1
 [player2] Target changed, recalculating path to: C1
 Calculating path for player2 from E1 to C1
 [ShipMovement] Setting isMoving=true for player2/ship
