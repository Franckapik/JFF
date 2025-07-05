VM14341:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
evaluating.state.js:20 exploring
fsmLogger.js:277 🎮 GAME [22:58:14] Game store initialized
fsmLogger.js:270 🔵 INFO [22:58:14] [shouldExplore] {context: {…}, event: {…}}
fsmLogger.js:277 🎮 GAME [22:58:14] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [22:58:14] Tiles initialized {component: 'tiles'}
fsmLogger.js:277 🟢 STATE [22:58:14] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [22:58:14] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.js:270 🎮 GAME [22:58:14] [XFSMStore.addBot] {botId: 'bot-0', activeBots: 1}
fsmLogger.js:277 🎮 GAME [22:58:14] [TileStore] Synchronized 1 starting tiles with 1 active bots
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: null, vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: null, to: 'docked', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🚀 MOUVEMENT [22:58:14] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 2.3, y: 0.8, z: -2.617691453623979}
fsmLogger.js:270 ⚡ EVENT [22:58:14] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.js:277 🔧 CONTEXT [22:58:14] 🛸 [bot-0] Initial explorer position: (2.30, 0.80, -2.62)
useShipAnimation.js:31 🏠 [Ship] About to transmit initial position to FSM tracker: {x: 1.8, y: 0.5, z: -3.117691453623979}
fsmLogger.js:270 🚀 MOUVEMENT [22:58:14] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 1.8, y: 0.5, z: -3.117691453623979}
initializationHandler.js:23 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.js:270 🔧 CONTEXT [22:58:14] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.js:270 ⚡ EVENT [22:58:14] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
initializationHandler.js:43 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
useShipAnimation.js:35 🏠 [Ship] Initial position transmitted successfully
fsmLogger.js:277 🔵 INFO [22:58:15] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [22:58:15] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [22:58:15] action_evaluating_exit
fsmLogger.js:270 🔵 INFO [22:58:15] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(16)}
fsmLogger.js:277 🔵 INFO [22:58:15] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:277 🔵 INFO [22:58:15] 🚁 [bot-0] Deploying drone for exploration
fsmLogger.js:270 🔵 INFO [22:58:15] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:277 🟢 STATE [22:58:15] 🚀 [bot-0] Entering exploring state
fsmLogger.js:277 🟢 STATE [22:58:15] 🛸 [bot-0] Drone deploying - moving to target
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
fsmLogger.js:277 🔧 CONTEXT [22:58:15] 🛸 [bot-0] explorer position: (2.59, 0.58, -1.35)
fsmLogger.js:270 ⚡ EVENT [22:58:15] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 🚀 MOUVEMENT [22:58:15] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 1.4723396181889745, threshold: 1.5}
fsmLogger.js:270 ⚡ EVENT [22:58:15] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:277 🟢 STATE [22:58:15] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:277 🟢 STATE [22:58:15] 🔍 [bot-0] Drone scanning - analyzing tile
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
fsmLogger.js:270 ⚡ EVENT [22:58:16] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 🔵 INFO [22:58:17] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_scanning', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
fsmLogger.js:270 ⚡ EVENT [22:58:17] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:58:17] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:270 💎 RESOURCES [22:58:17] 💎 [bot-0] explorer discovered resources: {food: 53, debris: 258, special: 2}
fsmLogger.js:270 ⚡ EVENT [22:58:17] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:277 🟢 STATE [22:58:17] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:277 🟢 STATE [22:58:17] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:270 🔵 INFO [22:58:17] [shouldExplore] {context: {…}, event: {…}}
fsmLogger.js:277 🔵 INFO [22:58:17] 🗺️ Tile E4 is now marked as explored
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
fsmLogger.js:277 🔧 CONTEXT [22:58:17] 🛸 [bot-0] explorer position: (3.16, 0.58, 1.58)
fsmLogger.js:277 🔧 CONTEXT [22:58:17] 🛸 [bot-0] explorer position: (3.08, 1.07, 1.31)
fsmLogger.js:277 🚀 MOUVEMENT [22:58:18] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:270 💎 RESOURCES [22:58:18] 💎 [bot-0] explorer discovered resources: {food: 91, debris: 537, special: 2}
fsmLogger.js:270 ⚡ EVENT [22:58:18] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:277 🔵 INFO [22:58:18] 🗺️ Tile E5 is now marked as explored
fsmLogger.js:270 ⚡ EVENT [22:58:18] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 ⚡ EVENT [22:58:19] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 🔵 INFO [22:58:20] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_returning', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
fsmLogger.js:270 ⚡ EVENT [22:58:20] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 ⚡ EVENT [22:58:21] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 ⚡ EVENT [22:58:22] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 🔵 INFO [22:58:23] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_returning', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
fsmLogger.js:270 ⚡ EVENT [22:58:23] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:270 ⚡ EVENT [22:58:24] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
