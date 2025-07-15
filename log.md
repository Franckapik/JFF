--APRES

VM34:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [21:52:24] Tiles initialized
fsmLogger.ts:207 🎮 GAME [21:52:24] [XFSMStore] Creation bot-0 - Status: active, State: evaluating
fsmLogger.ts:207 🎮 GAME [21:52:24] Bots initialized
fsmLogger.ts:207 🎮 GAME [21:52:24] Players initialized
fsmLogger.ts:207 🎮 GAME [21:52:24] [TileGeneration] Tuile de départ assignée à bot-0:6,3
fsmLogger.ts:207 🎮 GAME [21:52:24] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [21:52:24] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🔧 CONTEXT [21:52:24] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [21:52:24] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [21:52:24] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [21:52:24] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [21:52:24] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [21:52:24] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [21:52:24] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🎮 GAME [21:52:24] [XFSMStore] Actor bot-0 already running (status: active)
fsmLogger.ts:199 🎮 GAME [21:52:25] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}


--AVANT



VM49075:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [14:24:28] Tiles initialized
fsmLogger.ts:207 🎮 GAME [14:24:28] [XFSMStore] Creation bot-0 - Status: active, State: evaluating
fsmLogger.ts:207 🎮 GAME [14:24:28] Bots initialized
fsmLogger.ts:207 🎮 GAME [14:24:28] Players initialized
fsmLogger.ts:207 🎮 GAME [14:24:28] [TileGeneration] Tuile de départ assignée à bot-0:3,0
fsmLogger.ts:207 🎮 GAME [14:24:28] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [14:24:28] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:28] 🛸 [explorer] Syncing FSM position to visual tracker: {x: 0, y: 0.5, z: 0}
fsmLogger.ts:207 🔧 CONTEXT [14:24:28] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [14:24:28] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:28] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [14:24:28] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [14:24:29] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [14:24:29] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [14:24:29] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟢 STATE [14:24:29] action_evaluating_entry
fsmLogger.ts:199 🔵 INFO [14:24:29] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [14:24:29] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: {…}, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [14:24:29] [bot-0] Updating ship position {position: {…}, coord: {…}, shipType: 'ship', timestamp: 1752150269011}
fsmLogger.ts:207 🎮 GAME [14:24:29] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Animation frame: {state: 'docked', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.08669999999925494}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'docked', deltaTime: 0.08669999999925494}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Animation frame: {state: 'docked', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.01730000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:29] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'docked', deltaTime: 0.01730000000074506}
fsmLogger.ts:207 🔵 INFO [14:24:30] [Evaluating] → needExploring (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [14:24:30] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.ts:207 🟢 STATE [14:24:30] action_evaluating_exit
fsmLogger.ts:199 🔵 INFO [14:24:30] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [14:24:30] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.ts:207 🔵 INFO [14:24:30] 🚁 [bot-0] Deploying drone for exploration
fsmLogger.ts:199 🐛 DEBUG [14:24:30] [selectTargetTileInRadiusForDrone] Selected target tile {shipPosition: {…}, targetPosition: {…}, range: 3, tilesInRange: 12, selectedTile: '3,4'}
fsmLogger.ts:199 🔵 INFO [14:24:30] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟢 STATE [14:24:30] 🚀 [bot-0] Entering exploring state
fsmLogger.ts:207 🟢 STATE [14:24:30] 🛸 [bot-0] Drone deploying - moving to target
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Syncing FSM position to visual tracker: {x: 0.5, y: 0.8, z: 0.5}
fsmLogger.ts:199 🐛 DEBUG [14:24:30] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [14:24:30] 🛸 [bot-0] explorer deploying - distance: 1.06 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Animation frame: {state: 'deploying', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.017100000001490118}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.025650000002235177, speed: 1.5, droneState: 'deploying', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'deploying', deltaTime: 0.017100000001490118}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Animation frame: {state: 'deploying', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.017100000001490118}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.025650000002235177, speed: 1.5, droneState: 'deploying', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:30] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'deploying', deltaTime: 0.017100000001490118}
fsmLogger.ts:199 🐛 DEBUG [14:24:31] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [14:24:31] 🛸 [bot-0] explorer deploying - distance: 0.23 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Animation frame: {state: 'deploying', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.016699999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.025349999997764827, speed: 1.5, droneState: 'deploying', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'deploying', deltaTime: 0.016899999998509885}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Animation frame: {state: 'deploying', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.0175}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.025799999998882415, speed: 1.5, droneState: 'deploying', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'deploying', deltaTime: 0.017199999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] Drone reached target (threshold: 0.1) {position: {…}, distance: 0.09568146349607318, threshold: 0.1}
fsmLogger.ts:199 ⚡ EVENT [14:24:31] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟢 STATE [14:24:31] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.ts:207 🟢 STATE [14:24:31] 🔍 [bot-0] Drone scanning - analyzing tile
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🛸 [explorer] Syncing FSM position to visual tracker: {x: 0.5, y: 0.8, z: 0.5}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:31] 🔍 [bot-0] explorer completed tile scanning {position: {…}, distance: 0.09251236329843282}
fsmLogger.ts:199 ⚡ EVENT [14:24:31] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟢 STATE [14:24:31] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.ts:207 🟢 STATE [14:24:31] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.0165}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.033399999998509886, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016699999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.017099999997764827}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.033200000002980234, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:32] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016600000001490117}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.01680000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.034199999995529654, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.017099999997764827}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.01730000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03360000000149012, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:33] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.01680000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.016099999997764826}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.033399999998509886, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016699999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.016699999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.034, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:34] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.017}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.0165}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.033399999998509886, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016699999999254943}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.01720000000298023}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.032599999994039536, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:35] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016299999997019768}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.017099999997764827}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.04940000000596047, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.024700000002980234}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.0165}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03380000000447035, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:36] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.016900000002235176}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.016899999998509885}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03360000000149012, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.01680000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.017100000001490118}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03359999999403954, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:37] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.01679999999701977}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.016899999998509885}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03479999999701977, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.017399999998509885}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Animation frame: {state: 'returning', dronePosition: {…}, droneTarget: {…}, fleetPosition: {…}, deltaTime: 0.01680000000074506}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Interpolating to target: {currentLocal: {…}, targetLocal: {…}, lerpFactor: 0.03460000000149012, speed: 2, droneState: 'returning', …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Position calculation: {droneAbsolutePosition: {…}, droneTargetPosition: {…}, fleetAbsolutePosition: {…}, targetRelativePosition: {…}, currentLocalPosition: {…}, …}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Mesh position updated: {meshExists: true, newMeshPosition: {…}, currentLocalPosition: {…}, targetPosition: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [14:24:38] 🛸 [explorer] Sending updated position to tracker: {localPosition: {…}, worldPosition: {…}, targetPosition: {…}, droneState: 'returning', deltaTime: 0.01730000000074506}
