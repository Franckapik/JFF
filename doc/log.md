fsmLogger.js:119 🔵 INFO [10:09:23] [bot-0] Initializing bot FSM for Bot 0 (bot-0)
fsmLogger.js:119 🟢 STATE [10:09:23] [bot-0] Entering IDLE state for bot bot-0
fsmLogger.js:112 🟠 ACTION [10:09:23] [bot-0] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:119 🟢 STATE [10:09:23] [bot-0] Bot 0 (bot-0) initialized in IDLE state
fsmLogger.js:119 🔵 INFO [10:09:23] [bot-0] [MultiBotManager] Initialized Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:23] [bot-0] Starting bot processing
fsmLogger.js:119 🟠 ACTION [10:09:23] [bot-0] Skipping duplicate evaluateIdle action for bot bot-0
fsmLogger.js:119 🔵 INFO [10:09:23] [MultiBotManager] Bots started automatically
fsmLogger.js:119 🔵 INFO [10:09:23] [MultiBotManager] Starting parallel processing mode
fsmLogger.js:119 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Deactivated movement for bot-0/bot-0-ship
fsmLogger.js:119 🟢 STATE [10:09:23] [bot-0] [DroneState] Initialized drone bot-0-drone-explorer_drone in DOCKED_WITH_SHIP state
fsmLogger.js:119 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Deactivated movement for bot-0/bot-0-drone-explorer_drone
fsmLogger.js:119 🔵 INFO [10:09:23] [Scene] Initializing tiles...
fsmLogger.js:119 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Deactivated movement for player-1/player-1-ship
fsmLogger.js:119 🟢 STATE [10:09:23] [player-1] [DroneState] Initialized drone player-1-drone-explorer_drone in DOCKED_WITH_SHIP state
fsmLogger.js:119 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Deactivated movement for player-1/player-1-drone-explorer_drone
fsmLogger.js:112 🔵 INFO [10:09:23] [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:119 🔵 INFO [10:09:23] [Scene] Initializing bots...
fsmLogger.js:119 🔵 INFO [10:09:23] [bot-0] [Scene] Initializing Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:23] [bot-0] Initializing bot FSM for Bot 0 (bot-0)
fsmLogger.js:119 🟢 STATE [10:09:23] [bot-0] Entering IDLE state for bot bot-0
fsmLogger.js:112 🟠 ACTION [10:09:23] [bot-0] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:119 🟢 STATE [10:09:23] [bot-0] Bot 0 (bot-0) initialized in IDLE state
fsmLogger.js:112 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Setting initial position for player-1/player-1-ship: {x: -1.8, y: 0, z: 0}
fsmLogger.js:112 🚀 MOUVEMENT [10:09:23] [VehicleMovement] Setting initial position for bot-0/bot-0-ship: {x: 0.9, y: 0, z: -1.5588457268119895}
fsmLogger.js:119 🔵 INFO [10:09:24] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:24] Execute: Start: evaluateIdle (priority: 2) (priority: null) bot-0
fsmLogger.js:119 🟠 ACTION [10:09:24] [bot-0] Evaluating conditions from IDLE state for bot bot-0
fsmLogger.js:119 🟣 CONDITION [10:09:24] [bot-0] Transition from IDLE to exploring (start_exploring)
fsmLogger.js:112 🟠 ACTION [10:09:24] [bot-0] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:119 🟢 STATE [10:09:24] [bot-0] Transition: idle → exploring
fsmLogger.js:119 🟢 STATE [10:09:24] [bot-0] Exiting idle state for bot bot-0 - Returning to IDLE for evaluation
fsmLogger.js:119 🟢 STATE [10:09:24] [bot-0] Entering EXPLORING state for bot bot-0
fsmLogger.js:119 🔵 INFO [10:09:24] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:25] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:25] [bot-0] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:112 🟠 ACTION [10:09:25] Execute: Start: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: false, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: false}
exploreWithDroneAction.js:93 droneAtShip: {result: true}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: true
exploreWithDroneAction.js:103 playerState.memory.explorationState: undefined
exploreWithDroneAction.js:106 === PHASE 1: Starting exploration ===
fsmLogger.js:119 🟠 ACTION [10:09:25] [bot-0] Attempting to find a tile to explore
fsmLogger.js:119 🔵 INFO [10:09:25] [bot-0] Using exploring radius: 3
fsmLogger.js:119 🔵 INFO [10:09:25] [bot-0] Found 26 walkable unexplored tiles in radius
fsmLogger.js:119 🟠 ACTION [10:09:25] [bot-0] Sending drone to explore tile: D3, distance: 1.00
fsmLogger.js:119 🚀 MOUVEMENT [10:09:25] [D3] [PlayerStore] Moving bot-0/bot-0-drone-explorer_drone to tile:
fsmLogger.js:119 🟠 ACTION [10:09:25] Exploration started at 10:09:25
fsmLogger.js:119 🔵 INFO [10:09:25] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🟢 STATE [10:09:25] [bot-0] [DroneState] Transitioned drone bot-0-drone-explorer_drone: DOCKED_WITH_SHIP -> MOVING_TO_TARGET
fsmLogger.js:119 🚀 MOUVEMENT [10:09:25] [VehicleMovement] Activated movement for bot-0/bot-0-drone-explorer_drone
vehicleSlice.js:17 Warning: Cannot update a component (`Unknown`) while rendering a different component (`Unknown`). To locate the bad setState() call inside `Unknown`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render Error Component Stack
    at DroneMovement.jsx:13:37
    at Bot.jsx:25:3
    at Scene (Scene.jsx:20:27)
    at Suspense (<anonymous>)
    at ErrorBoundary (chunk-Q4YQWOCV.js?v=ffdcef8a:16084:5)
    at FiberProvider (chunk-Q4YQWOCV.js?v=ffdcef8a:17704:21)
    at Provider (chunk-Q4YQWOCV.js?v=ffdcef8a:17371:3)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
printWarning @ chunk-Q4YQWOCV.js?v=ffdcef8a:600
error2 @ chunk-Q4YQWOCV.js?v=ffdcef8a:584
warnAboutRenderPhaseUpdatesInDEV @ chunk-Q4YQWOCV.js?v=ffdcef8a:14232
scheduleUpdateOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12944
forceStoreRerender @ chunk-Q4YQWOCV.js?v=ffdcef8a:6345
handleStoreChange @ chunk-Q4YQWOCV.js?v=ffdcef8a:6329
(anonymous) @ zustand.js?v=ffdcef8a:17
setState @ zustand.js?v=ffdcef8a:17
updateVehicle @ vehicleSlice.js:17
(anonymous) @ useVehicleMovement.js:163
basicStateReducer @ chunk-Q4YQWOCV.js?v=ffdcef8a:6051
updateReducer @ chunk-Q4YQWOCV.js?v=ffdcef8a:6142
updateState @ chunk-Q4YQWOCV.js?v=ffdcef8a:6366
useState @ chunk-Q4YQWOCV.js?v=ffdcef8a:7118
useState @ chunk-DRWLMN53.js?v=ffdcef8a:1066
useVehicleMovement @ useVehicleMovement.js:33
(anonymous) @ DroneMovement.jsx:114
renderWithHooks @ chunk-Q4YQWOCV.js?v=ffdcef8a:5896
updateFunctionComponent @ chunk-Q4YQWOCV.js?v=ffdcef8a:9020
beginWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:10372
beginWork$1 @ chunk-Q4YQWOCV.js?v=ffdcef8a:14192
performUnitOfWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:13668
workLoopSync @ chunk-Q4YQWOCV.js?v=ffdcef8a:13608
renderRootSync @ chunk-Q4YQWOCV.js?v=ffdcef8a:13587
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13119
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
fsmLogger.js:119 🔵 INFO [10:09:26] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:26] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:26] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:27] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:27] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:27] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:28] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:28] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:28] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:29] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:29] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:29] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:30] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:30] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:30] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:31] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:31] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:31] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:32] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:32] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:32] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:33] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:33] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:33] [bot-0] Processed Bot 0 (bot-0)
fsmLogger.js:119 🔵 INFO [10:09:34] Processing all 1 bots in parallel
fsmLogger.js:112 🟠 ACTION [10:09:34] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
exploreWithDroneAction.js:30 === exploreWithDroneAction START ===
exploreWithDroneAction.js:33 botId: bot-0
exploreWithDroneAction.js:36 botVehicleId: bot-0-ship
exploreWithDroneAction.js:39 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
exploreWithDroneAction.js:43 botDroneId: bot-0-drone-explorer_drone
exploreWithDroneAction.js:46 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
exploreWithDroneAction.js:49 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
exploreWithDroneAction.js:90 isDroneMoving: {result: true}
exploreWithDroneAction.js:93 droneAtShip: {result: false}
exploreWithDroneAction.js:97 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
exploreWithDroneAction.js:100 isDroneDocked: false
exploreWithDroneAction.js:103 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
exploreWithDroneAction.js:248 === DRONE MOVEMENT DEBUG ===
exploreWithDroneAction.js:249 botDrone.position: null
exploreWithDroneAction.js:250 botDrone.coord: null
exploreWithDroneAction.js:251 botDrone.progress: 0.00
exploreWithDroneAction.js:252 botDrone.targetTile: {position: {…}, coord: 'D3'}
exploreWithDroneAction.js:253 botDrone.isMoving: true
fsmLogger.js:119 🔵 INFO [10:09:34] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:35] Processing all 1 bots in parallel
 🟠 ACTION [10:09:35] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:35] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:36] Processing all 1 bots in parallel
 🟠 ACTION [10:09:36] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:36] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:37] Processing all 1 bots in parallel
 🟠 ACTION [10:09:37] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:37] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:38] Processing all 1 bots in parallel
 🟠 ACTION [10:09:38] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:38] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:39] Processing all 1 bots in parallel
 🟠 ACTION [10:09:39] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:39] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:40] Processing all 1 bots in parallel
 🟠 ACTION [10:09:40] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:40] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:41] Processing all 1 bots in parallel
 🟠 ACTION [10:09:41] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:41] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:42] Processing all 1 bots in parallel
 🟠 ACTION [10:09:42] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:42] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:43] Processing all 1 bots in parallel
 🟠 ACTION [10:09:43] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:43] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:44] Processing all 1 bots in parallel
 🟠 ACTION [10:09:44] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:44] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:45] Processing all 1 bots in parallel
 🟠 ACTION [10:09:45] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:45] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:46] Processing all 1 bots in parallel
 🟠 ACTION [10:09:46] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:46] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:47] Processing all 1 bots in parallel
 🟠 ACTION [10:09:47] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:47] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:48] Processing all 1 bots in parallel
 🟠 ACTION [10:09:48] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:48] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:49] Processing all 1 bots in parallel
 🟠 ACTION [10:09:49] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:49] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:50] Processing all 1 bots in parallel
 🟠 ACTION [10:09:50] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:50] [bot-0] Processed Bot 0 (bot-0)
 🔵 INFO [10:09:51] Processing all 1 bots in parallel
 🟠 ACTION [10:09:51] Execute: Continue: exploreDrone (priority: 2) (priority: null) bot-0
 === exploreWithDroneAction START ===
 botId: bot-0
 botVehicleId: bot-0-ship
 botVehicle: {id: 'bot-0-ship', type: 'ship', position: {…}, coord: 'E2', isMoving: false, …}
 botDroneId: bot-0-drone-explorer_drone
 botDrone: {id: 'bot-0-drone-explorer_drone', type: 'explorer_drone', position: null, coord: null, isMoving: true, …}
 playerState: {id: 'bot-0', exploringRadius: 3, vehicles: {…}, score: {…}, memory: {…}, …}
 isDroneMoving: {result: true}
 droneAtShip: {result: false}
 droneState: {droneStates: {…}, initializeDrone: ƒ, transitionDroneState: ƒ, isDroneInState: ƒ, getDroneState: ƒ, …}
 isDroneDocked: false
 playerState.memory.explorationState: {started: true, startTime: 1748419765072, targetCoord: 'D3'}
 === DRONE MOVEMENT DEBUG ===
 botDrone.position: null
 botDrone.coord: null
 botDrone.progress: 0.00
 botDrone.targetTile: {position: {…}, coord: 'D3'}
 botDrone.isMoving: true
 🔵 INFO [10:09:51] [bot-0] Processed Bot 0 (bot-0)
