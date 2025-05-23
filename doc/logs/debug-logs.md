 🔵 INFO [17:27:09] Initializing bot FSM for Bot 1 (player2)
 🟢 STATE [17:27:09] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [17:27:09] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 🟢 STATE [17:27:09] Bot 1 (player2) initialized in IDLE state
 [MultiBotManager] Initialized Bot 1 (player2)
 🔵 INFO [17:27:09] Initializing bot FSM for Bot 2 (player3)
 🟢 STATE [17:27:09] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [17:27:09] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 🟢 STATE [17:27:09] Bot 2 (player3) initialized in IDLE state
 [MultiBotManager] Initialized Bot 2 (player3)
 🔵 INFO [17:27:09] Starting bot processing
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 [MultiBotManager] Bots started automatically
 🔵 INFO [17:27:09] Switching active bot to Bot 1 (player2)
 🟢 STATE [17:27:09] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [17:27:09] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 [MultiBotManager] Starting parallel processing mode
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player2/ship
 🟢 STATE [17:27:09] [DroneState] Initialized drone explorer_drone_2 in DOCKED_WITH_SHIP state
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player2/explorer_drone_2
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player3/ship
 🟢 STATE [17:27:09] [DroneState] Initialized drone explorer_drone_3 in DOCKED_WITH_SHIP state
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player3/explorer_drone_3
 [Scene] Initializing tiles...
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player1/ship
 🟢 STATE [17:27:09] [DroneState] Initialized drone explorer_drone_1 in DOCKED_WITH_SHIP state
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Deactivated movement for player1/explorer_drone_1
 [Scene] Initializing players with tiles: Object
 [Scene] Initializing bots...
 [Scene] Initializing Bot 1 (player2)
 🔵 INFO [17:27:09] Initializing bot FSM for Bot 1 (player2)
 🟢 STATE [17:27:09] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [17:27:09] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 🟢 STATE [17:27:09] Bot 1 (player2) initialized in IDLE state
 [Scene] Initializing Bot 2 (player3)
 🔵 INFO [17:27:09] Initializing bot FSM for Bot 2 (player3)
 🟢 STATE [17:27:09] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [17:27:09] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [17:27:09] Adding action to queue: evaluateIdle Object
 🟢 STATE [17:27:09] Bot 2 (player3) initialized in IDLE state
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Setting initial position for player1: Object
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Setting initial position for player2: Object
 🚀 MOUVEMENT [17:27:09] [VehicleMovement] Setting initial position for player3: Object
 🔵 INFO [17:27:10] Processing all 2 bots in parallel
 🔵 INFO [17:27:10] Switching active bot to Bot 1 (player2)
 🟢 STATE [17:27:10] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [17:27:10] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [17:27:10] Adding action to queue: evaluateIdle Object
 🟠 ACTION [17:27:10] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [17:27:10] Evaluating conditions from IDLE state for bot player2
 🟣 CONDITION [17:27:10] Transition from IDLE to exploring (discovery)
 🟠 ACTION [17:27:10] Adding action to queue: exploreDrone Object
 🟢 STATE [17:27:10] Transition: idle → exploring
 🟢 STATE [17:27:10] Exiting IDLE state, transitioning to exploring
 🟢 STATE [17:27:10] Entering EXPLORING state for bot player2
 🔵 INFO [17:27:10] Processed Bot 1 (player2)
 🔵 INFO [17:27:10] Switching active bot to Bot 2 (player3)
 🟢 STATE [17:27:10] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [17:27:10] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [17:27:10] Adding action to queue: evaluateIdle Object
 🟠 ACTION [17:27:10] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
 🟠 ACTION [17:27:10] Evaluating conditions from IDLE state for bot player3
 🟣 CONDITION [17:27:10] Transition from IDLE to exploring (discovery)
 🟠 ACTION [17:27:10] Adding action to queue: exploreDrone Object
 🟢 STATE [17:27:10] Transition: idle → exploring
 🟢 STATE [17:27:10] Exiting IDLE state, transitioning to exploring
 🟢 STATE [17:27:10] Entering EXPLORING state for bot player3
 🔵 INFO [17:27:10] Processed Bot 2 (player3)
 🔵 INFO [17:27:10] Switching active bot to Bot 2 (player3)
 🟢 STATE [17:27:10] Entering IDLE state for bot player3 - Evaluating conditions
 🔵 INFO [17:27:10] Bot player3 status: Fuel=100, At base=true
 🟠 ACTION [17:27:10] Adding action to queue: evaluateIdle Object
 🔵 INFO [17:27:11] Processing all 2 bots in parallel
 🔵 INFO [17:27:11] Switching active bot to Bot 1 (player2)
 🟢 STATE [17:27:11] Entering IDLE state for bot player2 - Evaluating conditions
 🔵 INFO [17:27:11] Bot player2 status: Fuel=100, At base=true
 🟠 ACTION [17:27:11] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:11] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:11] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:11] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:11] Adding action to queue: exploreDrone Object
fsmLogger.js:93 🟠 ACTION [17:27:11] completed action: evaluateIdle Object
fsmLogger.js:100 🔵 INFO [17:27:11] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:11] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:11] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:11] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:11] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:11] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:11] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:11] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:11] Adding action to queue: exploreDrone Object
fsmLogger.js:100 🟢 STATE [17:27:11] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:11] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:11] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:11] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:11] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:11] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:11] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:11] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🔵 INFO [17:27:12] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:12] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:12] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:12] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:12] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:12] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:12] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [17:27:12] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [17:27:12] Found 20 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [17:27:12] Sending drone to explore tile: D5, distance: 0.00
vehicleSlice.js:85 [PlayerStore] Moving player2/explorer_drone_2 to tile: D5
fsmLogger.js:100 🟠 ACTION [17:27:12] Exploration started at 17:27:12
fsmLogger.js:100 🔵 INFO [17:27:12] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:12] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:12] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:12] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:12] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:12] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:12] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:12] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:12] Adding action to queue: exploreDrone Object
fsmLogger.js:100 🟢 STATE [17:27:12] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:12] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:12] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:12] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:12] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:12] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:12] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:12] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🔵 INFO [17:27:13] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:13] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:13] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:13] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:13] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟣 CONDITION [17:27:13] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:13] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:13] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:13] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:13] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:13] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:13] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:13] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:13] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:13] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:13] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:13] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:13] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:13] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:13] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:13] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:13] Adding action to queue: exploreDrone Object
fsmLogger.js:100 🟢 STATE [17:27:13] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:13] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:13] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:13] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:13] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:13] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:13] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:13] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🔵 INFO [17:27:14] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:14] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:14] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:14] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:14] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:14] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:14] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:14] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:14] Adding action to queue: exploreDrone Object
fsmLogger.js:100 🟢 STATE [17:27:14] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:14] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:14] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:14] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:14] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:14] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:14] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:14] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🟠 ACTION [17:27:14] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:14] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:14] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:14] Adding action to queue: exploreDrone Object
fsmLogger.js:100 🟢 STATE [17:27:14] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:14] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:14] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:14] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:14] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:14] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:14] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:14] Adding action to queue: evaluateIdle Object
fsmLogger.js:100 🔵 INFO [17:27:15] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:15] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:15] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:15] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:15] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:15] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:15] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:15] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:15] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:15] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:15] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:15] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:15] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:15] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:15] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:15] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:15] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:15] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:15] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:15] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:15] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:15] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:15] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:15] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:15] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:15] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:15] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:15] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:15] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:15] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:16] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:16] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:16] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:16] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:16] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:16] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:16] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:16] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:16] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:16] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:16] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:16] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:16] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:16] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:16] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:16] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:16] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:16] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:16] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:16] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:16] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:16] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:16] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:16] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:16] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:16] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:16] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:16] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:16] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:17] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:17] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:17] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:17] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:17] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:17] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:17] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:17] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:17] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:17] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:17] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:17] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:17] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:17] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:17] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:17] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:17] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:17] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:17] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:17] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:17] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:17] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:17] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:17] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:17] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:17] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:17] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:17] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:17] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:17] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:18] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:18] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:18] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:18] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:18] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:18] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:18] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:18] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:18] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:18] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:18] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:18] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:18] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:18] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:18] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:18] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:18] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:18] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:18] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:18] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:18] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:18] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:18] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:18] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:18] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:18] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:18] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:18] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:18] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:19] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:19] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:19] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:19] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:19] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:19] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:19] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:19] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:19] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:19] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:19] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:19] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:19] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:19] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:19] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:19] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:19] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:19] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:19] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:19] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:19] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:19] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:19] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:19] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:19] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:19] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:19] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:19] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:19] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:19] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:20] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:20] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:20] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:20] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:20] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:20] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:20] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:20] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:20] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:20] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:20] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:20] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:20] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:20] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:20] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:20] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:20] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:20] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:20] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:20] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:20] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:20] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:20] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:20] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:20] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:20] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:20] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:20] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:20] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:21] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:21] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:21] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:21] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:21] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:21] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:21] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:21] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:21] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:21] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:21] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:21] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:21] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:21] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:21] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:21] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:21] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:21] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:21] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:21] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:21] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:21] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:21] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:21] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:21] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:21] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:21] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:21] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:21] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:21] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:22] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:22] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:22] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:22] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:22] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:22] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:22] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:22] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:22] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:22] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:22] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:22] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:22] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:22] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:22] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:22] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:22] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:22] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:22] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:22] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:22] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:22] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:22] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:22] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:22] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:22] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:22] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:23] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:23] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:23] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:23] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:23] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:23] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:23] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:23] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:23] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:23] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:23] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:23] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:23] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:23] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:23] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:23] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:23] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:23] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:23] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:23] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:23] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:23] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:23] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:23] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:23] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:23] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:23] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:23] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:24] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:24] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:24] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:24] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:24] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:24] Evaluating conditions from IDLE state for bot player2
fsmLogger.js:100 🟣 CONDITION [17:27:24] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:24] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:24] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:24] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:24] Entering EXPLORING state for bot player2
fsmLogger.js:100 🔵 INFO [17:27:24] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:24] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:24] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:24] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:24] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:24] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:24] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:24] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:24] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:24] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:24] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:24] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:24] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:24] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:24] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:24] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🔵 INFO [17:27:25] Processing all 2 bots in parallel
fsmLogger.js:100 🔵 INFO [17:27:25] Switching active bot to Bot 1 (player2)
fsmLogger.js:100 🟢 STATE [17:27:25] Entering IDLE state for bot player2 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:25] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟣 CONDITION [17:27:25] Exit condition met in state exploring: transitioning to idle (exploration_complete)
fsmLogger.js:100 🟢 STATE [17:27:25] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:25] Exiting EXPLORING state for bot player2 - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [17:27:25] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [17:27:25] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [17:27:25] Entering IDLE state for bot undefined - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:25] Bot player2 status: Fuel=100, At base=true
fsmLogger.js:100 🔵 INFO [17:27:25] Processed Bot 1 (player2)
fsmLogger.js:100 🔵 INFO [17:27:25] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:25] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:25] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:25] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟠 ACTION [17:27:25] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [17:27:25] Evaluating conditions from IDLE state for bot player3
fsmLogger.js:100 🟣 CONDITION [17:27:25] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [17:27:25] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [17:27:25] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [17:27:25] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🟢 STATE [17:27:25] Entering EXPLORING state for bot player3
fsmLogger.js:100 🔵 INFO [17:27:25] Processed Bot 2 (player3)
fsmLogger.js:100 🔵 INFO [17:27:25] Switching active bot to Bot 2 (player3)
fsmLogger.js:100 🟢 STATE [17:27:25] Entering IDLE state for bot player3 - Evaluating conditions
fsmLogger.js:100 🔵 INFO [17:27:25] Bot player3 status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [17:27:25] Adding action to queue: evaluateIdle {priority: 2}
