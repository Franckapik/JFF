fsmLogger.js:273 🎮 GAME [23:06:15] Game store initialized
fsmLogger.js:273 🔴 ERROR [23:06:15] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [23:06:15] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [23:06:15] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [23:06:15] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [23:06:15] NO context change detected for bot bot-0
fsmLogger.js:273 🔴 ERROR [23:06:15] [useBotMachine] No starting tile found for bot null
fsmLogger.js:266 📜 HISTORY [23:06:15] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [23:06:15] NO context change detected for bot null
fsmLogger.js:273 🔵 INFO [23:06:15] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [23:06:15] Tiles initialized {component: 'tiles'}
fsmLogger.js:266 🎮 GAME [23:06:15] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:266 🔵 INFO [23:06:15] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:273 🔴 ERROR [23:06:15] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [23:06:15] NO context change detected for bot bot-0
fsmLogger.js:273 📜 HISTORY [23:06:15] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:15] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [23:06:16] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [23:06:16] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 1.4, y: 0.8, z: 2.0588457268119895}
fsmLogger.js:266 🚀 MOUVEMENT [23:06:16] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0.9, y: 0.5, z: 1.5588457268119895}
fsmLogger.js:266 🔧 CONTEXT [23:06:16] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:273 📜 HISTORY [23:06:16] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:266 🔧 CONTEXT [23:06:16] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'D4', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:266 📜 HISTORY [23:06:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [23:06:16] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [23:06:17] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [23:06:17] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [23:06:17] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [23:06:17] 🚀 [bot-0] explorer drone deployed - distance: 2.34
fsmLogger.js:273 📜 HISTORY [23:06:17] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [23:06:20] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:273 🚀 MOUVEMENT [23:06:20] ✅ [bot-0] Tile explored by explorer: "C4"
useFSMDroneTracker.js:149 🔍 [DEBUG] Resources generated in hook: {food: 0, debris: 0, special: 0}
useFSMDroneTracker.js:150 🔍 [DEBUG] Resources have values: false
fsmLogger.js:273 🚀 MOUVEMENT [23:06:20] 💎 [bot-0] explorer discovered resources: {"food":0,"debris":0,"special":0}
useFSMDroneTracker.js:166 🔍 [DEBUG] Event sent to FSM: {type: 'TILE_EXPLORED', coord: 'C4', resources: {…}, position: {…}, droneType: 'explorer', …}
fsmLogger.js:266 🔵 INFO [23:06:20] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C4', hasResources: false, botId: 'bot-0'}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:190 🔍 [DEBUG] Tile data created: {coord: 'C4', explored: true, collected: false, exploredAt: 1750539980622, hasResources: true, …}
fsmLogger.js:266 🔵 INFO [23:06:20] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C4', droneType: 'explorer', botId: 'bot-0'}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:190 🔍 [DEBUG] Tile data created: {coord: 'C4', explored: true, collected: false, exploredAt: 1750539980622, hasResources: true, …}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:190 🔍 [DEBUG] Tile data created: {coord: 'C4', explored: true, collected: false, exploredAt: 1750539980623, hasResources: true, …}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:190 🔍 [DEBUG] Tile data created: {coord: 'C4', explored: true, collected: false, exploredAt: 1750539980623, hasResources: true, …}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:190 🔍 [DEBUG] Tile data created: {coord: 'C4', explored: true, collected: false, exploredAt: 1750539980623, hasResources: true, …}
droneExploringActions.js:152 🔍 [DEBUG] droneExploresTile called with: {coord: 'C4', resources: {…}, hasResourcesData: true, resourcesKeys: Array(3)}
droneExploringActions.js:170 🔍 [DEBUG] Tile already explored, skipping: C4
fsmLogger.js:273 📜 HISTORY [23:06:20] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:273 🔵 INFO [23:06:20] 🗺️ Tile C4 is now marked as explored
fsmLogger.js:266 📜 HISTORY [23:06:20] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [23:06:20] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [23:06:21] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:266 🔧 CONTEXT [23:06:21] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5960104176241552}
fsmLogger.js:273 📜 HISTORY [23:06:21] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [23:06:23] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:266 🔵 INFO [23:06:23] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:266 🔵 INFO [23:06:23] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:273 📜 HISTORY [23:06:23] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:273 📜 HISTORY [23:06:23] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [23:06:23] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:266 🔵 INFO [23:06:25] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true}
fsmLogger.js:273 📜 HISTORY [23:06:25] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [23:06:25] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:266 📜 HISTORY [23:06:25] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [23:06:25] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
