VM14482:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [23:30:32] Tiles initialized
fsmLogger.ts:207 🎮 GAME [23:30:32] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [23:30:32] Bots initialized
fsmLogger.ts:207 🎮 GAME [23:30:32] Players initialized
fsmLogger.ts:207 🎮 GAME [23:30:32] [TileGeneration] Tuile de départ assignée à bot-0:4,2
fsmLogger.ts:207 🎮 GAME [23:30:32] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [23:30:32] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🔧 CONTEXT [23:30:32] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [23:30:32] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [23:30:32] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [23:30:32] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [23:30:32] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [23:30:32] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [23:30:32] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟠 ACTION [23:30:32] onEvaluatingEntry
actions.effects.ts:27 uninitialized
fsmLogger.ts:199 🔵 INFO [23:30:32] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [23:30:32] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [23:30:32] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:207 🎮 GAME [23:30:32] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🚀 MOUVEMENT [23:30:32] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [23:30:32] [Evaluating] → No action needed, staying in evaluating
