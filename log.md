VM16829:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
evaluating.state.js:20 exploring
index.js:51 🔧 [ACTIONS DEBUG] Position actions in allActions: {hasUpdateShipPosition: true, hasUpdateDronePosition: true, availableActions: Array(33), positionActionsCount: 3}
fsmLogger.js:277 🎮 GAME [00:21:39] Game store initialized
fsmLogger.js:270 🔵 INFO [00:21:39] [shouldExplore] {context: {…}, event: {…}}
fsmLogger.js:277 🎮 GAME [00:21:39] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [00:21:39] Tiles initialized {component: 'tiles'}
fsmLogger.js:277 🟢 STATE [00:21:39] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [00:21:39] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.js:270 🎮 GAME [00:21:39] [XFSMStore.addBot] {botId: 'bot-0', activeBots: 1}
fsmLogger.js:277 🎮 GAME [00:21:39] [TileStore] Synchronized 1 starting tiles with 1 active bots
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: null, vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: null, to: 'docked', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:39] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 3.2, y: 0.8, z: -1.0588457268119895}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:39] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:39] [unknown] Drone position update failed: event is undefined
fsmLogger.js:277 🔧 CONTEXT [00:21:39] 🛸 [bot-0] Initial explorer position: (3.20, 0.80, -1.06)
useShipAnimation.js:31 🏠 [Ship] About to transmit initial position to FSM tracker: {x: 2.7, y: 0.5, z: -1.5588457268119895}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:39] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 2.7, y: 0.5, z: -1.5588457268119895}
initializationHandler.js:23 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.js:270 🔧 CONTEXT [00:21:39] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'SHIP_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:39] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:52 🚢 [updateShipPosition] XState v4 format detected
positionActions.js:60 🚢 [updateShipPosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:39] [unknown] Ship position update failed: event is undefined
initializationHandler.js:43 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
useShipAnimation.js:35 🏠 [Ship] Initial position transmitted successfully
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:40] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [00:21:40] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [00:21:40] action_evaluating_exit
fsmLogger.js:270 🔵 INFO [00:21:40] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(16)}
fsmLogger.js:277 🔵 INFO [00:21:40] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:277 🔵 INFO [00:21:40] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:90 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
fsmLogger.js:270 🔵 INFO [00:21:40] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:277 🟢 STATE [00:21:40] 🚀 [bot-0] Entering exploring state
fsmLogger.js:277 🟢 STATE [00:21:40] 🛸 [bot-0] Drone deploying - moving to target
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:40] 🛸 [bot-0] explorer position: (1.29, 0.57, -1.64)
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:40] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:40] [unknown] Drone position update failed: event is undefined
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:40] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9638021255864965, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:40] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:40] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:277 🟢 STATE [00:21:40] 🔍 [bot-0] Drone scanning - analyzing tile
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:41] 🛸 [bot-0] explorer position: (-3.08, 0.51, -2.96)
fsmLogger.js:277 🚀 MOUVEMENT [00:21:41] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:270 💎 RESOURCES [00:21:41] 💎 [bot-0] explorer discovered resources: {food: 89, debris: 888, special: 0}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:41] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:41] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:277 🟢 STATE [00:21:41] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:277 🔵 INFO [00:21:41] 🗺️ Tile C1 is now marked as explored
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [00:21:41] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:41] 🛸 [bot-0] explorer position: (-2.25, 0.52, -2.17)
fsmLogger.js:270 🔵 INFO [00:21:41] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:41] 🛸 [bot-0] explorer position: (-2.16, 1.08, -2.07)
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9789090684188593, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
fsmLogger.js:270 ⚡ EVENT [00:21:41] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:41] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:277 🟢 STATE [00:21:41] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:277 🟢 STATE [00:21:41] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [00:21:41] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [00:21:41] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:41] 🛸 [bot-0] explorer position: (-0.62, 0.47, -0.60)
fsmLogger.js:277 🔵 INFO [00:21:42] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [00:21:42] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [00:21:42] action_evaluating_exit
fsmLogger.js:270 🔵 INFO [00:21:42] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
fsmLogger.js:277 🔵 INFO [00:21:42] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:277 🔵 INFO [00:21:42] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:90 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
fsmLogger.js:270 🔵 INFO [00:21:42] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:277 🟢 STATE [00:21:42] 🚀 [bot-0] Entering exploring state
fsmLogger.js:277 🟢 STATE [00:21:42] 🛸 [bot-0] Drone deploying - moving to target
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:42] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:42] [unknown] Drone position update failed: event is undefined
fsmLogger.js:277 🔧 CONTEXT [00:21:42] 🛸 [bot-0] explorer position: (0.50, 0.43, -0.49)
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🔵 INFO [00:21:42] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_deploying', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:42] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9897432267615002, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:42] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:42] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:277 🟢 STATE [00:21:42] 🔍 [bot-0] Drone scanning - analyzing tile
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🚀 MOUVEMENT [00:21:42] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:270 💎 RESOURCES [00:21:42] 💎 [bot-0] explorer discovered resources: {food: 1, debris: 200, special: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:42] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:42] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:277 🟢 STATE [00:21:42] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:277 🔵 INFO [00:21:42] 🗺️ Tile G3 is now marked as explored
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [00:21:42] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:42] 🛸 [bot-0] explorer position: (3.06, 0.69, -0.04)
fsmLogger.js:270 🔵 INFO [00:21:42] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9859126306075625, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
fsmLogger.js:270 ⚡ EVENT [00:21:43] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:43] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:277 🟢 STATE [00:21:43] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:277 🟢 STATE [00:21:43] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [00:21:43] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:43] 🛸 [bot-0] explorer position: (0.79, 0.56, -0.01)
fsmLogger.js:270 🔵 INFO [00:21:43] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
fsmLogger.js:277 🔵 INFO [00:21:44] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [00:21:44] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [00:21:44] action_evaluating_exit
fsmLogger.js:270 🔵 INFO [00:21:44] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
fsmLogger.js:277 🔵 INFO [00:21:44] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:277 🔵 INFO [00:21:44] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:90 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
fsmLogger.js:270 🔵 INFO [00:21:44] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:277 🟢 STATE [00:21:44] 🚀 [bot-0] Entering exploring state
fsmLogger.js:277 🟢 STATE [00:21:44] 🛸 [bot-0] Drone deploying - moving to target
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:44] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:44] [unknown] Drone position update failed: event is undefined
fsmLogger.js:277 🔧 CONTEXT [00:21:44] 🛸 [bot-0] explorer position: (0.45, 0.54, 0.93)
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:44] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9685809979198505, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:44] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:44] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:277 🟢 STATE [00:21:44] 🔍 [bot-0] Drone scanning - analyzing tile
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🚀 MOUVEMENT [00:21:44] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:270 💎 RESOURCES [00:21:44] 💎 [bot-0] explorer discovered resources: {food: 80, debris: 400, special: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
fsmLogger.js:270 ⚡ EVENT [00:21:44] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:44] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:277 🟢 STATE [00:21:44] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:277 🔵 INFO [00:21:44] 🗺️ Tile B6 is now marked as explored
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [00:21:44] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:44] 🛸 [bot-0] explorer position: (-0.48, 0.78, 2.80)
fsmLogger.js:270 🔵 INFO [00:21:44] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:270 🚀 MOUVEMENT [00:21:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9910504797697223, threshold: 1}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
fsmLogger.js:270 ⚡ EVENT [00:21:44] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
fsmLogger.js:277 🟢 STATE [00:21:44] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:277 🟢 STATE [00:21:44] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:277 🟢 STATE [00:21:44] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [00:21:44] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [00:21:44] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔧 CONTEXT [00:21:44] 🛸 [bot-0] explorer position: (-0.15, 0.42, 0.87)
fsmLogger.js:270 🔵 INFO [00:21:45] 🛸 [explorer] Drone diagnostic: {droneState: 'docked', isActive: false, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
fsmLogger.js:277 🔵 INFO [00:21:45] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [00:21:45] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [00:21:45] action_evaluating_exit
fsmLogger.js:270 🔵 INFO [00:21:45] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
fsmLogger.js:277 🔵 INFO [00:21:45] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:277 🔵 INFO [00:21:45] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:90 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
fsmLogger.js:270 🔵 INFO [00:21:45] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:277 🟢 STATE [00:21:45] 🚀 [bot-0] Entering exploring state
fsmLogger.js:277 🟢 STATE [00:21:45] 🛸 [bot-0] Drone deploying - moving to target
Fleet.jsx:72 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
Fleet.jsx:100 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
fsmLogger.js:270 ⚡ EVENT [00:21:45] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
fsmLogger.js:277 🔵 INFO [00:21:45] [unknown] Drone position update failed: event is undefined
fsmLogger.js:277 🔧 CONTEXT [00:21:45] 🛸 [bot-0] explorer position: (-0.78, 0.48, 1.28)
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
positionActions.js:221 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
index.js:69 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
index.js:76 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
positionActions.js:213 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:46] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9684135895314904, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:46] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:46] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:46] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:46] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [00:21:46] 💎 [bot-0] explorer discovered resources: {food: 44, debris: 959, special: 2}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
 ⚡ EVENT [00:21:46] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:46] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [00:21:46] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [00:21:46] 🗺️ Tile A5 is now marked as explored
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:46] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:46] 🛸 [bot-0] explorer position: (-1.74, 0.78, 1.58)
 🔵 INFO [00:21:46] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.980004650288908, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
 ⚡ EVENT [00:21:46] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:46] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [00:21:46] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [00:21:46] action_evaluating_entry
 🔵 INFO [00:21:46] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:46] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 🔵 INFO [00:21:47] [Evaluating] → needExploring (need more exploration)
 🔵 INFO [00:21:47] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [00:21:47] action_evaluating_exit
 🔵 INFO [00:21:47] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
 🔵 INFO [00:21:47] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [00:21:47] 🚁 [bot-0] Deploying drone for exploration
 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
 🔵 INFO [00:21:47] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [00:21:47] 🚀 [bot-0] Entering exploring state
 🟢 STATE [00:21:47] 🛸 [bot-0] Drone deploying - moving to target
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 ⚡ EVENT [00:21:47] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:47] [unknown] Drone position update failed: event is undefined
 🔧 CONTEXT [00:21:47] 🛸 [bot-0] explorer position: (0.19, 0.51, 0.72)
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:47] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9709719026035757, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:47] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:47] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:47] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:47] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [00:21:47] 💎 [bot-0] explorer discovered resources: {food: 12, debris: 902, special: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
 ⚡ EVENT [00:21:47] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:47] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [00:21:47] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [00:21:47] 🗺️ Tile F4 is now marked as explored
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:47] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:47] 🛸 [bot-0] explorer position: (2.91, 0.54, 1.08)
 🔵 INFO [00:21:47] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9827259085469376, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
 ⚡ EVENT [00:21:48] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:48] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [00:21:48] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [00:21:48] action_evaluating_entry
 🔵 INFO [00:21:48] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:48] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:48] 🛸 [bot-0] explorer position: (0.75, 0.40, 0.28)
 🔵 INFO [00:21:48] 🛸 [explorer] Drone diagnostic: {droneState: 'docked', isActive: false, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 ⚡ EVENT [00:21:49] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:49] [unknown] Drone position update failed: event is undefined
 🔵 INFO [00:21:49] [Evaluating] → needExploring (need more exploration)
 🔵 INFO [00:21:49] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [00:21:49] action_evaluating_exit
 🔵 INFO [00:21:49] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
 🔵 INFO [00:21:49] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [00:21:49] 🚁 [bot-0] Deploying drone for exploration
 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
 🔵 INFO [00:21:49] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [00:21:49] 🚀 [bot-0] Entering exploring state
 🟢 STATE [00:21:49] 🛸 [bot-0] Drone deploying - moving to target
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:49] 🛸 [bot-0] explorer position: (1.24, 0.52, -0.30)
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:49] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.981039614181575, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:49] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:49] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:49] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:49] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [00:21:49] 💎 [bot-0] explorer discovered resources: {food: 91, debris: 614, special: 0}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
 ⚡ EVENT [00:21:49] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:49] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [00:21:49] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [00:21:49] 🗺️ Tile G1 is now marked as explored
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:49] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:49] 🛸 [bot-0] explorer position: (2.22, 0.51, -1.82)
 🔵 INFO [00:21:49] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:49] 🛸 [bot-0] explorer position: (2.14, 1.00, -1.76)
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:49] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9854447251350814, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
 ⚡ EVENT [00:21:49] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:49] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [00:21:49] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [00:21:49] action_evaluating_entry
 🔵 INFO [00:21:49] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:49] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 ⚡ EVENT [00:21:50] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:50] [unknown] Drone position update failed: event is undefined
 🔵 INFO [00:21:50] [Evaluating] → needExploring (need more exploration)
 🔵 INFO [00:21:50] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [00:21:50] action_evaluating_exit
 🔵 INFO [00:21:50] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
 🔵 INFO [00:21:50] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [00:21:50] 🚁 [bot-0] Deploying drone for exploration
 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
 🔵 INFO [00:21:50] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [00:21:50] 🚀 [bot-0] Entering exploring state
 🟢 STATE [00:21:50] 🛸 [bot-0] Drone deploying - moving to target
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:50] 🛸 [bot-0] explorer position: (1.41, 0.47, -0.17)
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:51] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9998576567083716, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:51] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:51] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:51] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:51] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [00:21:51] 💎 [bot-0] explorer discovered resources: {food: 12, debris: 902, special: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
 ⚡ EVENT [00:21:51] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:51] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [00:21:51] 🏠 [bot-0] Drone returning - heading to base
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:51] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:51] 🛸 [bot-0] explorer position: (2.78, 0.64, 0.89)
 🔵 INFO [00:21:51] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:51] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9912693962018, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
 ⚡ EVENT [00:21:51] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:51] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [00:21:51] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [00:21:51] action_evaluating_entry
 🔵 INFO [00:21:51] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:51] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:51] 🛸 [bot-0] explorer position: (0.76, 0.40, 0.24)
 🔵 INFO [00:21:51] 🛸 [explorer] Drone diagnostic: {droneState: 'docked', isActive: false, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 ⚡ EVENT [00:21:52] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:52] [unknown] Drone position update failed: event is undefined
 🔵 INFO [00:21:52] [Evaluating] → needExploring (need more exploration)
 🔵 INFO [00:21:52] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [00:21:52] action_evaluating_exit
 🔵 INFO [00:21:52] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
 🔵 INFO [00:21:52] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [00:21:52] 🚁 [bot-0] Deploying drone for exploration
 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
 🔵 INFO [00:21:52] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [00:21:52] 🚀 [bot-0] Entering exploring state
 🟢 STATE [00:21:52] 🛸 [bot-0] Drone deploying - moving to target
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:52] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🚀 MOUVEMENT [00:21:52] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.6308591077551675, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:52] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:52] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:52] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:52] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [00:21:52] 💎 [bot-0] explorer discovered resources: {food: 37, debris: 286, special: 0}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_SCANS_TILE'}
 ⚡ EVENT [00:21:52] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:52] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [00:21:52] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [00:21:52] 🗺️ Tile D3 is now marked as explored
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_returning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_scanning', to: 'drone_returning', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:52] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:52] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:53] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.40918370787412434, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_BASE'}
 ⚡ EVENT [00:21:53] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:53] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [00:21:53] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [00:21:53] action_evaluating_entry
 🔵 INFO [00:21:53] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: false, droneState: 'docked', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_returning', to: 'docked', position: {…}, targetPosition: {…}}
 🔵 INFO [00:21:53] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 ⚡ EVENT [00:21:53] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: 'evaluating'}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔵 INFO [00:21:53] [unknown] Drone position update failed: event is undefined
 🔵 INFO [00:21:54] [Evaluating] → needExploring (need more exploration)
 🔵 INFO [00:21:54] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [00:21:54] action_evaluating_exit
 🔵 INFO [00:21:54] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(17)}
 🔵 INFO [00:21:54] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [00:21:54] 🚁 [bot-0] Deploying drone for exploration
 [selectTargetTileInRadiusForDrone] No valid tiles found, falling back to random tile
 🔵 INFO [00:21:54] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [00:21:54] 🚀 [bot-0] Entering exploring state
 🟢 STATE [00:21:54] 🛸 [bot-0] Drone deploying - moving to target
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_deploying', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'docked', to: 'drone_deploying', position: {…}, targetPosition: {…}}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🔧 CONTEXT [00:21:54] 🛸 [bot-0] explorer position: (0.20, 0.46, 0.85)
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_POSITION_UPDATE'}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🛸 [updateDronePosition] XState v4 format detected
 🛸 [updateDronePosition] Function called with: {contextType: 'object', contextKeys: Array(4), eventType: 'undefined', eventKeys: 'event is null/undefined', hasEvent: false, …}
 🚀 MOUVEMENT [00:21:54] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9920882670413733, threshold: 1}
 📨 [XFSMStore.send] Called with: {event: {…}, botId: 'bot-0', eventType: 'DRONE_REACHES_TILE'}
 ⚡ EVENT [00:21:54] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 📨 [XFSMStore.send] About to send to actor: {hasActor: true, eventStructure: {…}, actorState: {…}}
 🟢 STATE [00:21:54] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [00:21:54] 🔍 [bot-0] Drone scanning - analyzing tile
 🛸 [Fleet] Context update for bot-0: {fsmState: {…}, lastAction: 'droneDeployForExploration_success', vehiclePosition: '(0.0, 0.5, 0.0)', droneActive: true, droneState: 'drone_scanning', …}
 🚨 [Fleet] DRONE STATE CHANGE for bot-0: {from: 'drone_deploying', to: 'drone_scanning', position: {…}, targetPosition: {…}}
