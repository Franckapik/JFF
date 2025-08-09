VM16178:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [19:59:43] Tiles initialized
fsmLogger.ts:207 🎮 GAME [19:59:43] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [19:59:43] Bots initialized
fsmLogger.ts:207 🎮 GAME [19:59:43] Players initialized
fsmLogger.ts:207 🎮 GAME [19:59:43] [TileGeneration] Tuile de départ assignée à bot-0:0,3
fsmLogger.ts:207 🎮 GAME [19:59:43] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [19:59:43] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🔧 CONTEXT [19:59:43] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [19:59:43] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:43] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [19:59:43] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [19:59:43] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [19:59:43] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [19:59:43] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟠 ACTION [19:59:43] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [19:59:43] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [19:59:43] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [19:59:43] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:207 🎮 GAME [19:59:43] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:43] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [19:59:43] [Evaluating] → NEED_EXPLORING (need more exploration)
guards.ts?t=1754762358376:11 0
fsmLogger.ts:199 🟣 CONDITION [19:59:43] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:43] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [19:59:43] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [19:59:43] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [19:59:43] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [19:59:43] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:43] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:43] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🐛 DEBUG [19:59:43] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [19:59:43] 🛸 [bot-0] explorer deploying - distance: 2.93 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [19:59:44] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [19:59:44] 🛸 [bot-0] explorer deploying - distance: 0.65 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:44] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5996625543327383, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [19:59:44] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:44] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [19:59:44] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [19:59:44] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [19:59:44] 📊 [bot-0] Incrémentation exploration: 0 → 1
fsmLogger.ts:207 🟠 ACTION [19:59:44] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:44] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [19:59:46] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [19:59:46] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [19:59:46] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [19:59:46] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [19:59:46] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:46] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [19:59:46] 🛸 [bot-0] explorer returning - distance: 2.91 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.596994765918662}
fsmLogger.ts:199 ⚡ EVENT [19:59:47] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:47] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [19:59:47] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:47] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [19:59:47] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [19:59:47] [Evaluating] → NEED_EXPLORING (need more exploration)
guards.ts?t=1754762358376:11 1
fsmLogger.ts:199 🟣 CONDITION [19:59:47] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:47] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [19:59:47] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [19:59:47] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [19:59:47] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [19:59:47] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:47] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:47] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:47] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [19:59:47] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [19:59:47] 🛸 [bot-0] explorer deploying - distance: 1.34 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:48] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.59967133228926, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [19:59:48] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:48] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [19:59:48] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [19:59:48] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [19:59:48] 📊 [bot-0] Incrémentation exploration: 1 → 2
fsmLogger.ts:207 🟠 ACTION [19:59:48] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:48] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [19:59:50] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [19:59:50] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [19:59:50] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [19:59:50] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [19:59:50] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:50] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [19:59:50] 🛸 [bot-0] explorer returning - distance: 1.67 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:50] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5983255743013464}
fsmLogger.ts:199 ⚡ EVENT [19:59:50] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:50] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [19:59:50] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:50] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [19:59:50] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [19:59:51] [Evaluating] → NEED_EXPLORING (need more exploration)
guards.ts?t=1754762358376:11 2
fsmLogger.ts:199 🟣 CONDITION [19:59:51] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:51] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [19:59:51] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [19:59:51] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [19:59:51] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [19:59:51] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:51] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:51] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:51] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [19:59:51] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [19:59:51] 🛸 [bot-0] explorer deploying - distance: 1.96 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:51] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5940672597116323, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [19:59:51] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:51] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [19:59:51] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [19:59:51] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [19:59:51] 📊 [bot-0] Incrémentation exploration: 2 → 3
fsmLogger.ts:207 🟠 ACTION [19:59:51] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:51] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [19:59:53] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [19:59:53] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [19:59:53] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [19:59:53] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [19:59:53] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:53] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [19:59:53] 🛸 [bot-0] explorer returning - distance: 1.68 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:54] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5995178911756304}
fsmLogger.ts:199 ⚡ EVENT [19:59:54] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [19:59:54] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [19:59:54] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [19:59:54] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [19:59:54] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [19:59:54] [Evaluating] → NEED_EXPLORING (need more exploration)
guards.ts?t=1754762358376:11 3
fsmLogger.ts:207 🔵 INFO [19:59:54] [bot-0] shouldExplore: false - déjà 3 explorations dans ce cycle (limite: 2)
fsmLogger.ts:199 🟣 CONDITION [19:59:54] [GUARD] shouldExplore: false {context: {…}, event: {…}}
fsmLogger.ts:199 🐛 DEBUG [19:59:54] 🛸 [bot-0] explorer returning - distance: 0.22 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:54] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.21633990039526274}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:55] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.07873921853581475}
fsmLogger.ts:199 ⚡ EVENT [19:59:55] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [19:59:55] 🛸 [bot-0] explorer returning - distance: 0.03 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:55] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.028471004303840492}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:56] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.01040285511521649}
fsmLogger.ts:199 ⚡ EVENT [19:59:56] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [19:59:56] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:56] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0037995497836936483}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:57] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0013836510018031512}
fsmLogger.ts:199 ⚡ EVENT [19:59:57] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [19:59:57] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:57] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0005049016871652144}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:58] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00018457262303074574}
fsmLogger.ts:199 ⚡ EVENT [19:59:58] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [19:59:58] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:58] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00006752121207034602}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:59] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00002472978398289294}
fsmLogger.ts:199 ⚡ EVENT [19:59:59] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [19:59:59] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [19:59:59] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.000009033575145762811}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:00] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0000033060733904637135}
fsmLogger.ts:199 ⚡ EVENT [20:00:00] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:00] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:00] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0000012094481351045758}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:01] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.4262733259156617e-7}
fsmLogger.ts:199 ⚡ EVENT [20:00:01] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:01] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:01] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.619585412251334e-7}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:02] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.936921314348781e-8}
fsmLogger.ts:199 ⚡ EVENT [20:00:02] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:02] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:02] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.171860736344357e-8}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:03] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.82128036544126e-9}
fsmLogger.ts:199 ⚡ EVENT [20:00:03] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:03] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:03] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.861243291080403e-9}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:04] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0479958205657298e-9}
fsmLogger.ts:199 ⚡ EVENT [20:00:04] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:04] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:04] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.8322891590328997e-10}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:05] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4019550477526713e-10}
fsmLogger.ts:199 ⚡ EVENT [20:00:05] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:05] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:05] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.1256122613839375e-11}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:06] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.878896836578602e-11}
fsmLogger.ts:199 ⚡ EVENT [20:00:06] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:06] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:06] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.8790650277966755e-12}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:07] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.4843351973392293e-12}
fsmLogger.ts:199 ⚡ EVENT [20:00:07] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:07] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:07] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.08281317225298e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:08] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.3254277950554874e-13}
fsmLogger.ts:199 ⚡ EVENT [20:00:08] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:08] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:08] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.218010329174934e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:09] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.392509889155462e-14}
fsmLogger.ts:199 ⚡ EVENT [20:00:09] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:09] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:09] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6098319360521975e-14}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:10] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.8078742530026265e-15}
fsmLogger.ts:199 ⚡ EVENT [20:00:10] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:10] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:10] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.1255096518004462e-15}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:11] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.791347573544424e-16}
fsmLogger.ts:199 ⚡ EVENT [20:00:11] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🎮 GAME [20:00:11] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🎮 GAME [20:00:11] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [20:00:11] Bots initialized
fsmLogger.ts:207 🔧 CONTEXT [20:00:11] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [20:00:11] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:11] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [20:00:11] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [20:00:11] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [20:00:11] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [20:00:11] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟠 ACTION [20:00:11] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:00:11] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [20:00:11] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [20:00:11] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:207 🎮 GAME [20:00:11] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:11] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [20:00:11] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:00:11] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:11] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:00:11] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:00:11] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:00:11] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:00:11] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:11] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:11] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🐛 DEBUG [20:00:11] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:00:11] 🛸 [bot-0] explorer deploying - distance: 1.71 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:12] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5976841572251874, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:00:12] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:12] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:00:12] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:00:12] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:00:12] 📊 [bot-0] Incrémentation exploration: 0 → 1
fsmLogger.ts:207 🟠 ACTION [20:00:12] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:12] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:00:14] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:00:14] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:00:14] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:00:14] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:00:14] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:14] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:00:14] 🛸 [bot-0] explorer returning - distance: 1.70 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:15] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5940661962268888}
fsmLogger.ts:199 ⚡ EVENT [20:00:15] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:15] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:00:15] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:15] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:00:15] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:00:15] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:00:15] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:15] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:00:15] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:00:15] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:00:15] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:00:15] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:15] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:15] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:15] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:00:15] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:00:15] 🛸 [bot-0] explorer deploying - distance: 2.60 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:16] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5998281693646415, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:00:16] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:16] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:00:16] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:00:16] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:00:16] 📊 [bot-0] Incrémentation exploration: 1 → 2
fsmLogger.ts:207 🟠 ACTION [20:00:16] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:16] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:00:18] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:00:18] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:00:18] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:00:18] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:00:18] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:18] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:00:18] 🛸 [bot-0] explorer returning - distance: 2.91 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:19] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5960014537778731}
fsmLogger.ts:199 ⚡ EVENT [20:00:19] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:19] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:00:19] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:19] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:00:19] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:00:19] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:00:19] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:19] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:00:19] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:00:19] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:00:19] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:00:19] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:19] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:19] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:19] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:00:19] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:00:19] 🛸 [bot-0] explorer deploying - distance: 3.45 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:00:20] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:00:20] 🛸 [bot-0] explorer deploying - distance: 0.77 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:20] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5975418934033863, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:00:20] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:20] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:00:20] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:00:20] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:00:20] 📊 [bot-0] Incrémentation exploration: 2 → 3
fsmLogger.ts:207 🟠 ACTION [20:00:20] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:20] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:00:22] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:00:22] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:00:22] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:00:22] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:00:22] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:22] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:00:22] 🛸 [bot-0] explorer returning - distance: 2.92 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5949984722948618}
fsmLogger.ts:199 ⚡ EVENT [20:00:23] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:00:23] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:00:23] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:00:23] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:00:23] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:00:23] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:207 🔵 INFO [20:00:23] [bot-0] shouldExplore: false - déjà 3 explorations dans ce cycle (limite: 2)
fsmLogger.ts:199 🟣 CONDITION [20:00:23] [GUARD] shouldExplore: false {context: {…}, event: {…}}
fsmLogger.ts:199 🐛 DEBUG [20:00:23] 🛸 [bot-0] explorer returning - distance: 0.39 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.21793032606416146}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.07868750054754202}
fsmLogger.ts:199 ⚡ EVENT [20:00:24] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:24] 🛸 [bot-0] explorer returning - distance: 0.05 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.028814830701234997}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.010393653822755679}
fsmLogger.ts:199 ⚡ EVENT [20:00:25] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:25] 🛸 [bot-0] explorer returning - distance: 0.01 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0037482499773548303}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.001372874756963602}
fsmLogger.ts:199 ⚡ EVENT [20:00:26] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:26] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.000503359834190723}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00018425374426591856}
fsmLogger.ts:199 ⚡ EVENT [20:00:27] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:27] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00006750049225140401}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00002467319837706845}
fsmLogger.ts:199 ⚡ EVENT [20:00:28] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:28] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.000008914226547785687}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.000003260397818733881}
fsmLogger.ts:199 ⚡ EVENT [20:00:29] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:29] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0000011765138140670672}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.318928728217659e-7}
fsmLogger.ts:199 ⚡ EVENT [20:00:30] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:30] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.5594494432053537e-7}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.707190928902027e-8}
fsmLogger.ts:199 ⚡ EVENT [20:00:31] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:31] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.0925046180700856e-8}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.692241257736879e-9}
fsmLogger.ts:199 ⚡ EVENT [20:00:32] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:32] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.8221323724506173e-9}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0359761543153098e-9}
fsmLogger.ts:199 ⚡ EVENT [20:00:33] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:33] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.796775558224571e-10}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.3758984898671837e-10}
fsmLogger.ts:199 ⚡ EVENT [20:00:34] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:34] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.061026953188472e-11}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.8544522834965886e-11}
fsmLogger.ts:199 ⚡ EVENT [20:00:35] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:35] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.710854247906487e-12}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.4609842973450163e-12}
fsmLogger.ts:199 ⚡ EVENT [20:00:36] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:36] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.028567001666625e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.3075859221688964e-13}
fsmLogger.ts:199 ⚡ EVENT [20:00:37] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:37] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1937921161684093e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.369854300752825e-14}
fsmLogger.ts:199 ⚡ EVENT [20:00:38] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:38] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6005633559005742e-14}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.8754602068159446e-15}
fsmLogger.ts:199 ⚡ EVENT [20:00:39] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:39] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.11974034260867e-15}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.768791935228987e-16}
fsmLogger.ts:199 ⚡ EVENT [20:00:40] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:40] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.850092422369956e-16}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0426324634980194e-16}
fsmLogger.ts:199 ⚡ EVENT [20:00:41] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:41] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.832899734496626e-17}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4064585647873975e-17}
fsmLogger.ts:199 ⚡ EVENT [20:00:42] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:42] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.149349803512196e-18}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.888750926105333e-18}
fsmLogger.ts:199 ⚡ EVENT [20:00:43] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:43] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.81279636868182e-19}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.504483606165311e-19}
fsmLogger.ts:199 ⚡ EVENT [20:00:44] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:44] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.176907869354632e-20}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.372876692444408e-20}
fsmLogger.ts:199 ⚡ EVENT [20:00:45] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:45] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.217109335043514e-20}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.46247606786877e-21}
fsmLogger.ts:199 ⚡ EVENT [20:00:46] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:46] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6102806677755142e-21}
fsmLogger.ts:199 ⚡ EVENT [20:00:47] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.801269574291474e-22}
fsmLogger.ts:199 🐛 DEBUG [20:00:47] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.1248481589123518e-22}
fsmLogger.ts:199 ⚡ EVENT [20:00:48] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.784322790206531e-23}
fsmLogger.ts:199 🐛 DEBUG [20:00:48] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.851153308514832e-23}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:49] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0449358164663592e-23}
fsmLogger.ts:199 ⚡ EVENT [20:00:49] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:49] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:49] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.835095912154494e-24}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:50] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.3891756983448785e-24}
fsmLogger.ts:199 ⚡ EVENT [20:00:50] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:50] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:50] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.099505316819439e-25}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:51] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.868554240288676e-25}
fsmLogger.ts:199 ⚡ EVENT [20:00:51] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:51] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:51] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.86353553959826e-26}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:52] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.5088261462876115e-26}
fsmLogger.ts:199 ⚡ EVENT [20:00:52] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:52] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:52] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.189008760135826e-27}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:53] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.372550341130133e-27}
fsmLogger.ts:199 ⚡ EVENT [20:00:53] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:53] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:53] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2362776099541666e-27}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:54] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.544734158764866e-28}
fsmLogger.ts:199 ⚡ EVENT [20:00:54] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:54] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:54] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.667327831814836e-28}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:55] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.110621712134375e-29}
fsmLogger.ts:199 ⚡ EVENT [20:00:55] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:55] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:55] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.238140307335952e-29}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:56] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.226084384430898e-30}
fsmLogger.ts:199 ⚡ EVENT [20:00:56] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:56] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:56] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.967791849025409e-30}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:57] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0861321667472733e-30}
fsmLogger.ts:199 ⚡ EVENT [20:00:57] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:57] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:57] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.973359056648383e-31}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:58] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.455332884791636e-31}
fsmLogger.ts:199 ⚡ EVENT [20:00:58] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:58] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:58] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.343464533976735e-32}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:59] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.9591638805001345e-32}
fsmLogger.ts:199 ⚡ EVENT [20:00:59] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:00:59] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:00:59] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.175856308999279e-33}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:00] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.587303565469629e-33}
fsmLogger.ts:199 ⚡ EVENT [20:01:00] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:00] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:00] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.48040862285864e-34}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:01] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.478772695225097e-34}
fsmLogger.ts:199 ⚡ EVENT [20:01:01] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:01] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:01] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2762471758130773e-34}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:02] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.6849975290751085e-35}
fsmLogger.ts:199 ⚡ EVENT [20:01:02] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:02] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:02] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.7184145536361163e-35}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:03] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.309449327182693e-36}
fsmLogger.ts:199 ⚡ EVENT [20:01:03] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:03] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:03] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.3151908056004747e-36}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:04] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.488545072363654e-37}
fsmLogger.ts:199 ⚡ EVENT [20:01:04] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:04] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:04] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.120792686463977e-37}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:05] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1286621186501554e-37}
fsmLogger.ts:199 ⚡ EVENT [20:01:05] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:05] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:05] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.146601196671143e-38}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:06] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4953838763654564e-38}
fsmLogger.ts:199 ⚡ EVENT [20:01:06] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:06] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:06] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.482760452848932e-39}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:07] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.0094254263885355e-39}
fsmLogger.ts:199 ⚡ EVENT [20:01:07] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:07] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:07] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.359964273590335e-40}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:08] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.652632550814779e-40}
fsmLogger.ts:199 ⚡ EVENT [20:01:08] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:08] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:08] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.727715377719226e-41}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:09] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.5695052168423463e-41}
fsmLogger.ts:199 ⚡ EVENT [20:01:09] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:09] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:09] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.3074052710907805e-41}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:10] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.786695400100795e-42}
fsmLogger.ts:199 ⚡ EVENT [20:01:10] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:10] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:10] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.724814003465739e-42}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:11] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.31619978940766e-43}
fsmLogger.ts:199 ⚡ EVENT [20:01:11] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:11] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:11] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.307796937785492e-43}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:12] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.464855745185336e-44}
fsmLogger.ts:199 ⚡ EVENT [20:01:12] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:12] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:12] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.097921152772965e-44}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:13] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1353754432763975e-44}
fsmLogger.ts:199 ⚡ EVENT [20:01:13] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:13] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:13] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.162801640875133e-45}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:14] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.5265784970107304e-45}
fsmLogger.ts:199 ⚡ EVENT [20:01:14] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:14] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:14] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.589151379089439e-46}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:15] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.016034909943014e-46}
fsmLogger.ts:199 ⚡ EVENT [20:01:15] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:15] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:15] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.274855295035196e-47}
fsmLogger.ts:199 ⚡ EVENT [20:01:16] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:16] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.625690714288626e-47}
fsmLogger.ts:199 🐛 DEBUG [20:01:16] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:16] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.636325961031072e-48}
fsmLogger.ts:199 ⚡ EVENT [20:01:17] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:17] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.4723280188263813e-48}
fsmLogger.ts:199 🐛 DEBUG [20:01:17] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:17] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.27181532186428e-48}
fsmLogger.ts:199 ⚡ EVENT [20:01:18] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:18] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.587509765476011e-49}
fsmLogger.ts:199 🐛 DEBUG [20:01:18] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:18] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6520435587162396e-49}
fsmLogger.ts:199 ⚡ EVENT [20:01:19] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:19] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.048516518202522e-50}
fsmLogger.ts:199 🐛 DEBUG [20:01:19] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:19] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.221273130811159e-50}
fsmLogger.ts:199 ⚡ EVENT [20:01:20] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:20] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.013867001129129e-51}
fsmLogger.ts:199 🐛 DEBUG [20:01:20] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:20] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.9442066991817634e-51}
fsmLogger.ts:199 ⚡ EVENT [20:01:21] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:21] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0770610644560277e-51}
fsmLogger.ts:199 🐛 DEBUG [20:01:21] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:21] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.951376115444451e-52}
fsmLogger.ts:199 ⚡ EVENT [20:01:22] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:22] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4466802933750285e-52}
fsmLogger.ts:199 🐛 DEBUG [20:01:22] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:22] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.331040647399452e-53}
fsmLogger.ts:199 ⚡ EVENT [20:01:23] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.9581692867613425e-53}
fsmLogger.ts:199 🐛 DEBUG [20:01:23] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.182495273188179e-54}
fsmLogger.ts:199 ⚡ EVENT [20:01:24] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.635021291543714e-54}
fsmLogger.ts:199 🐛 DEBUG [20:01:24] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.655225468962947e-55}
fsmLogger.ts:199 ⚡ EVENT [20:01:25] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.55009580554884e-55}
fsmLogger.ts:199 🐛 DEBUG [20:01:25] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.283916678048827e-55}
fsmLogger.ts:199 ⚡ EVENT [20:01:26] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.72656398981306e-56}
fsmLogger.ts:199 🐛 DEBUG [20:01:26] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.731926553770412e-56}
fsmLogger.ts:199 ⚡ EVENT [20:01:27] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.244584400017692e-57}
fsmLogger.ts:199 🐛 DEBUG [20:01:27] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.2914034783787976e-57}
fsmLogger.ts:199 ⚡ EVENT [20:01:28] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.367125560037347e-58}
fsmLogger.ts:199 🐛 DEBUG [20:01:28] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.0358406618252737e-58}
fsmLogger.ts:199 ⚡ EVENT [20:01:29] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1146648483308976e-58}
fsmLogger.ts:199 🐛 DEBUG [20:01:29] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.081041217724379e-59}
fsmLogger.ts:199 ⚡ EVENT [20:01:30] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4738494445790467e-59}
fsmLogger.ts:199 🐛 DEBUG [20:01:30] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.404918010405837e-60}
fsmLogger.ts:199 ⚡ EVENT [20:01:31] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.980860850715423e-60}
fsmLogger.ts:199 🐛 DEBUG [20:01:31] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.258249585930239e-61}
fsmLogger.ts:199 ⚡ EVENT [20:01:32] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.6617273918875424e-61}
fsmLogger.ts:199 🐛 DEBUG [20:01:32] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.74518376718642e-62}
fsmLogger.ts:199 ⚡ EVENT [20:01:33] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.571568407128049e-62}
fsmLogger.ts:199 🐛 DEBUG [20:01:33] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2846122009155798e-62}
fsmLogger.ts:199 ⚡ EVENT [20:01:34] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.706131536646295e-63}
fsmLogger.ts:199 🐛 DEBUG [20:01:34] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.725144814102421e-63}
fsmLogger.ts:199 ⚡ EVENT [20:01:35] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.316179453540464e-64}
fsmLogger.ts:199 🐛 DEBUG [20:01:35] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.312033928865105e-64}
fsmLogger.ts:199 ⚡ EVENT [20:01:36] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.326107309763777e-65}
fsmLogger.ts:199 🐛 DEBUG [20:01:36] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.9983969047085175e-65}
fsmLogger.ts:199 ⚡ EVENT [20:01:37] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.100837252100445e-65}
fsmLogger.ts:199 🐛 DEBUG [20:01:37] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.032858955674017e-66}
fsmLogger.ts:199 ⚡ EVENT [20:01:38] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.453489710917263e-66}
fsmLogger.ts:199 🐛 DEBUG [20:01:38] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.328002535901543e-67}
fsmLogger.ts:199 ⚡ EVENT [20:01:39] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.9499025213037144e-67}
fsmLogger.ts:199 🐛 DEBUG [20:01:39] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.1477383893171175e-68}
fsmLogger.ts:199 ⚡ EVENT [20:01:40] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.6212067616455504e-68}
fsmLogger.ts:199 🐛 DEBUG [20:01:40] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.600737319356665e-69}
fsmLogger.ts:199 ⚡ EVENT [20:01:41] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.4602167222909567e-69}
fsmLogger.ts:199 🐛 DEBUG [20:01:41] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2681457943191472e-69}
fsmLogger.ts:199 ⚡ EVENT [20:01:42] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.5705302019457626e-70}
fsmLogger.ts:199 🐛 DEBUG [20:01:42] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6462683703010183e-70}
fsmLogger.ts:199 ⚡ EVENT [20:01:43] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.032314897377218e-71}
fsmLogger.ts:199 🐛 DEBUG [20:01:43] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.2108018555696427e-71}
fsmLogger.ts:199 ⚡ EVENT [20:01:44] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.102418340924206e-72}
fsmLogger.ts:199 🐛 DEBUG [20:01:44] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.9827611339170885e-72}
fsmLogger.ts:199 ⚡ EVENT [20:01:45] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:45] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0748096336961546e-72}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.8705932582478016e-73}
fsmLogger.ts:199 ⚡ EVENT [20:01:46] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:46] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4191305070618644e-73}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.201067163105504e-74}
fsmLogger.ts:199 ⚡ EVENT [20:01:47] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:47] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.905786293063111e-74}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.973300363252855e-75}
fsmLogger.ts:199 ⚡ EVENT [20:01:48] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:01:48] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:01:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.5582753018874864e-75}
