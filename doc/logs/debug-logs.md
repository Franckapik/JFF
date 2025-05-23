Scene.jsx:42 [Scene] Initializing tiles...
Scene.jsx:49 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:55 [Scene] Initializing bots...
Scene.jsx:59 [Scene] Initializing Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:18] Initializing bot FSM for Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:18] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:18] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:18] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:18] Bot 1 (player2) initialized in IDLE state
Scene.jsx:59 [Scene] Initializing Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:18] Initializing bot FSM for Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:18] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:18] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:18] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:18] Bot 2 (player3) initialized in IDLE state
fsmLogger.js:93 🚀 MOUVEMENT [11:58:18] [ShipMovement] Setting initial position for player1: {x: -1.8, y: 0, z: 3.117691453623979}
fsmLogger.js:93 🚀 MOUVEMENT [11:58:18] [ShipMovement] Setting initial position for player2: {x: -1.8, y: 0, z: 0}
fsmLogger.js:93 🚀 MOUVEMENT [11:58:18] [ShipMovement] Setting initial position for player3: {x: 0.9, y: 0, z: 1.5588457268119895}
fsmLogger.js:100 🔵 INFO [11:58:21] Starting bot processing
fsmLogger.js:93 🟠 ACTION [11:58:21] Adding action to queue: evaluateIdle {priority: 2}
MultiBotManager.jsx:32 [MultiBotManager] Starting parallel processing mode
fsmLogger.js:100 🔵 INFO [11:58:22] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:22] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:22] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:22] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:22] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:22] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [11:58:22] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:22] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:22] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:22] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:22] Bot player2 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:22] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [11:58:22] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:22] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:22] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:22] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:22] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:22] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:22] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:22] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:22] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:22] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:22] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:22] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [11:58:22] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:22] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:22] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:22] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [11:58:23] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:23] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:23] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:23] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:23] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:23] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [11:58:23] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:23] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:93 🟠 ACTION [11:58:23] completed action: evaluateIdle {elapsed: 2}
fsmLogger.js:100 🔵 INFO [11:58:23] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:23] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:23] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:23] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:23] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:23] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:23] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:23] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:23] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:23] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:23] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:23] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [11:58:23] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:23] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:23] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:23] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [11:58:24] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:24] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:24] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:24] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:24] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:24] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [11:58:24] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [11:58:24] Found 25 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [11:58:24] Sending drone to explore tile: C3, distance: 0.00
vehicleSlice.js:85 [PlayerStore] Moving player2/explorer_drone_2 to tile: C3
fsmLogger.js:100 🟠 ACTION [11:58:24] Exploration started at 11:58:24
fsmLogger.js:100 🔵 INFO [11:58:24] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:24] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:24] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:24] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:24] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:24] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:24] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:24] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:24] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:24] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:24] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:24] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [11:58:24] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:24] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:24] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:24] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:93 🚀 MOUVEMENT [11:58:24] [UnifiedDroneMovement] Bot drone discovered new resources at C3: {food: 100, debris: 100, special: 50}
fsmLogger.js:100 🚀 MOUVEMENT [11:58:24] [UnifiedDroneMovement] Bot player2 exploration count increased to 2
fsmLogger.js:100 🚀 MOUVEMENT [11:58:24] [UnifiedDroneMovement] explorer_drone for player2 returned to ship
fsmLogger.js:100 🔵 INFO [11:58:25] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:25] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:25] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:25] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:25] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:25] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:100 🟢 STATE [11:58:25] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [11:58:25] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [11:58:25] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [11:58:25] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [11:58:25] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [11:58:25] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:25] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:25] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:25] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:25] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:25] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:25] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:25] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:25] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:25] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:25] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [11:58:25] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:25] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:25] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:25] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:25] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [11:58:26] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:26] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:26] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:26] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:26] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:26] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:26] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [11:58:26] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:26] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:26] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:26] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:26] Bot player2 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:26] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [11:58:26] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:26] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:26] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:26] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:26] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:26] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:26] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:26] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:26] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [11:58:26] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [11:58:26] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [11:58:26] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [11:58:26] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [11:58:26] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [11:58:26] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:26] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:26] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:26] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [11:58:27] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [11:58:27] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [11:58:27] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:27] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:27] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:27] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:27] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [11:58:27] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [11:58:27] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:93 🟠 ACTION [11:58:27] completed action: evaluateIdle {elapsed: 1}
fsmLogger.js:100 🔵 INFO [11:58:27] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [11:58:27] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [11:58:27] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [11:58:27] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [11:58:27] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [11:58:27] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [11:58:27] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [11:58:27] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:27] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:27] Transition: idle → exploring
 🟢 STATE [11:58:27] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:27] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:27] Entering EXPLORING state for bot player3
 🔵 INFO [11:58:27] Processed Bot 2 (player3)
 🔵 INFO [11:58:27] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:27] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:27] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:27] Adding action to queue: evaluateIdle {priority: 2}
 🔵 INFO [11:58:28] Processing all 2 bots in parallel
 🔵 INFO [11:58:28] Switching active bot to Bot 1 (player2)
 🟢 STATE [11:58:28] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [11:58:28] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [11:58:28] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:28] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:28] Attempting to find a tile to explore
 🔵 INFO [11:58:28] Using exploring radius: 3
 🔵 INFO [11:58:28] Found 24 walkable unexplored tiles in radius
 🟠 ACTION [11:58:28] Sending drone to explore tile: B3, distance: 1.00
 [PlayerStore] Moving player2/explorer_drone_2 to tile: B3
 🟠 ACTION [11:58:28] Exploration started at 11:58:28
 🔵 INFO [11:58:28] Processed Bot 1 (player2)
 🔵 INFO [11:58:28] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:28] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:28] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:28] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:28] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:28] Evaluating conditions from IDLE state for bot player3
 🟣 CONDITION [11:58:28] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:28] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:28] Transition: idle → exploring
 🟢 STATE [11:58:28] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:28] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:28] Entering EXPLORING state for bot player3
 🔵 INFO [11:58:28] Processed Bot 2 (player3)
 🔵 INFO [11:58:28] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:28] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:28] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:28] Adding action to queue: evaluateIdle {priority: 2}
 🚀 MOUVEMENT [11:58:28] [UnifiedDroneMovement] Bot drone discovered new resources at B3: {food: 58, debris: 607, special: 0}
 🚀 MOUVEMENT [11:58:28] [UnifiedDroneMovement] Bot player2 exploration count increased to 4
 🚀 MOUVEMENT [11:58:28] [UnifiedDroneMovement] explorer_drone for player2 returned to ship
 🔵 INFO [11:58:29] Processing all 2 bots in parallel
 🔵 INFO [11:58:29] Switching active bot to Bot 1 (player2)
 🟢 STATE [11:58:29] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [11:58:29] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [11:58:29] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:29] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:29] Drone has returned to ship, exploration sequence fully complete after 1.0s
 🟢 STATE [11:58:29] Transition: exploring → idle
 🟢 STATE [11:58:29] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
 🟢 STATE [11:58:29] Transition: exploring → idle
 🟢 STATE [11:58:29] Entering IDLE state for bot undefined - Evaluating conditions
 🔵 INFO [11:58:29] Bot player2 status: Fuel=100, At base=true
 🟢 STATE [11:58:29] Entering IDLE state for bot undefined - Evaluating conditions
 🔵 INFO [11:58:29] Bot player2 status: Fuel=100, At base=true
 🔵 INFO [11:58:29] Processed Bot 1 (player2)
 🔵 INFO [11:58:29] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:29] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:29] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:29] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:29] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:29] Evaluating conditions from IDLE state for bot player3
 🟣 CONDITION [11:58:29] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:29] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:29] Transition: idle → exploring
 🟢 STATE [11:58:29] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:29] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:29] Entering EXPLORING state for bot player3
 🔵 INFO [11:58:29] Processed Bot 2 (player3)
 🔵 INFO [11:58:29] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:29] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:29] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:29] Adding action to queue: evaluateIdle {priority: 2}
 🔵 INFO [11:58:30] Processing all 2 bots in parallel
 🔵 INFO [11:58:30] Switching active bot to Bot 1 (player2)
 🟢 STATE [11:58:30] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [11:58:30] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [11:58:30] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:30] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:30] Evaluating conditions from IDLE state for bot player2
 🟣 CONDITION [11:58:30] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:30] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:30] Transition: idle → exploring
 🟢 STATE [11:58:30] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:30] Bot player2 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:30] Entering EXPLORING state for bot player2
 🔵 INFO [11:58:30] Processed Bot 1 (player2)
 🔵 INFO [11:58:30] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:30] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:30] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:30] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:30] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:30] Evaluating conditions from IDLE state for bot player3
 🟣 CONDITION [11:58:30] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:30] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:30] Transition: idle → exploring
 🟢 STATE [11:58:30] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:30] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:30] Entering EXPLORING state for bot player3
 🔵 INFO [11:58:30] Processed Bot 2 (player3)
 🔵 INFO [11:58:30] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:30] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:30] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:30] Adding action to queue: evaluateIdle {priority: 2}
 🔵 INFO [11:58:31] Processing all 2 bots in parallel
 🔵 INFO [11:58:31] Switching active bot to Bot 1 (player2)
 🟢 STATE [11:58:31] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [11:58:31] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [11:58:31] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:31] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:31] Evaluating conditions from IDLE state for bot player2
 🟣 CONDITION [11:58:31] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:31] Adding action to queue: exploreDrone {priority: 2}
 🟠 ACTION [11:58:31] completed action: evaluateIdle {elapsed: 0}
 🔵 INFO [11:58:31] Processed Bot 1 (player2)
 🔵 INFO [11:58:31] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:31] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:31] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:31] Adding action to queue: evaluateIdle {priority: 2}
 🟠 ACTION [11:58:31] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [11:58:31] Evaluating conditions from IDLE state for bot player3
 🟣 CONDITION [11:58:31] Transition from IDLE to exploring (discovery)
 🟠 ACTION [11:58:31] Adding action to queue: exploreDrone {priority: 2}
 🟢 STATE [11:58:31] Transition: idle → exploring
 🟢 STATE [11:58:31] Exiting IDLE state, transitioning to exploring
 🔵 INFO [11:58:31] Bot player3 transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
 🟢 STATE [11:58:31] Entering EXPLORING state for bot player3
 🔵 INFO [11:58:31] Processed Bot 2 (player3)
 🔵 INFO [11:58:31] Switching active bot to Bot 2 (player3)
 🟢 STATE [11:58:31] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [11:58:31] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [11:58:31] Adding action to queue: evaluateIdle {priority: 2}
