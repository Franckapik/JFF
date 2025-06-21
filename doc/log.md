fsmLogger.js:273 🎮 GAME [14:18:16] Game store initialized
fsmLogger.js:266 👤 PLAYER [14:18:16] Starting bot-only player generation: 1 bots Object
fsmLogger.js:273 👤 PLAYER [14:18:16] Created bot player: bot-0
fsmLogger.js:266 👤 PLAYER [14:18:16] Bot-only player generation completed. Total bots: 1 Object
fsmLogger.js:273 🔴 ERROR [14:18:16] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [14:18:16] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [14:18:16] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [14:18:16] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:16] Context effect triggered for bot bot-0: Object
fsmLogger.js:273 📜 HISTORY [14:18:16] NO context change detected for bot bot-0
fsmLogger.js:273 🔵 INFO [14:18:16] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [14:18:16] Tiles initialized Object
fsmLogger.js:266 🎮 GAME [14:18:16] [TileStore] Synchronized starting tiles with FSM bots: Object
fsmLogger.js:266 🔵 INFO [14:18:16] [Scene] Synchronized starting tiles with FSM bots Object
fsmLogger.js:273 📜 HISTORY [14:18:16] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [14:18:17] 🛸 [explorer] Transmitting initial drone position to FSM tracker: Object
fsmLogger.js:266 🚀 MOUVEMENT [14:18:17] 🏠 [Ship] Transmitting initial position to FSM tracker: Object
fsmLogger.js:266 🔧 CONTEXT [14:18:17] 🏠 [bot-0] Setting initial ship position via FSM event Object
fsmLogger.js:273 📜 HISTORY [14:18:17] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:266 🔧 CONTEXT [14:18:17] ✅ [bot-0] Initial ship position sent via FSM event Object
fsmLogger.js:266 📜 HISTORY [14:18:17] Context effect triggered for bot bot-0: Object
fsmLogger.js:266 📜 HISTORY [14:18:17] Context change detected for bot bot-0: Object
fsmLogger.js:273 📜 HISTORY [14:18:18] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:18] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:18] Context effect triggered for bot bot-0: Object
fsmLogger.js:266 📜 HISTORY [14:18:18] Context change detected for bot bot-0: Object
fsmLogger.js:273 🚀 MOUVEMENT [14:18:18] 🚀 [bot-0] explorer drone deployed - distance: 8.40
fsmLogger.js:273 📜 HISTORY [14:18:18] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:18] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:18:19] 🚀 [bot-0] explorer drone deployed - distance: 5.63
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:18:19] 🚀 [bot-0] explorer drone deployed - distance: 3.76
fsmLogger.js:273 📜 HISTORY [14:18:19] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:20] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:20] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:18:23] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:273 🚀 MOUVEMENT [14:18:23] ✅ [bot-0] Tile explored by explorer: "-2,-1"
fsmLogger.js:266 🔵 INFO [14:18:23] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,-1', botId: undefined}
fsmLogger.js:273 📜 HISTORY [14:18:23] Received sync event: DRONE_REACHED_TARGET for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:23] State transition detected: exploring_deploying → exploring_prospecting for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'prospecting', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:18:23] Context change detected for bot bot-0: {droneStateChange: 'deploying → prospecting', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:18:23] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:273 🚀 MOUVEMENT [14:18:26] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:273 🚀 MOUVEMENT [14:18:26] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":61,"special":0}
fsmLogger.js:266 🔵 INFO [14:18:26] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:266 🔵 INFO [14:18:26] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:266 🔵 INFO [14:18:26] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:273 📜 HISTORY [14:18:26] Received sync event: PROSPECTING_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:26] State transition detected: exploring_prospecting → exploring_returning for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'prospecting', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:18:26] Context change detected for bot bot-0: {droneStateChange: 'prospecting → returning', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:18:29] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:266 🔧 CONTEXT [14:18:29] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5995597478654076}
fsmLogger.js:266 🔵 INFO [14:18:29] 🏠 [Exploring] DRONE_APPROACHING_SHIP guard check {botId: undefined, currentState: 'evaluating', droneState: 'returning', isActive: true, distance: 0.5995597478654076, …}
fsmLogger.js:266 🔵 INFO [14:18:29] 🏠 [Exploring] Drone approaching ship, preparing evaluation {botId: undefined, droneType: 'explorer', distance: 0.5995597478654076}
fsmLogger.js:273 📜 HISTORY [14:18:29] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:29] State transition detected: exploring_returning → evaluating for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:29] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [14:18:29] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:18:30] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:273 📜 HISTORY [14:18:30] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:266 🔵 INFO [14:18:31] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true}
fsmLogger.js:273 📜 HISTORY [14:18:31] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:18:31] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:18:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [14:18:31] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:18:35] 🏠 [bot-0] explorer drone reached ship - distance: 0.10
fsmLogger.js:273 📜 HISTORY [14:18:35] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:18:40] 🏠 [bot-0] explorer drone reached ship - distance: 0.00
fsmLogger.js:273 📜 HISTORY [14:18:40] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:18:45] 🏠 [bot-0] explorer drone reached ship - distance: 0.10
fsmLogger.js:273 📜 HISTORY [14:18:45] Received sync event: DRONE_REACHED_SHIP for bot bot-0
