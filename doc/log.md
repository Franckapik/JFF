fsmLogger.js:132 🎮 GAME [22:25:39] Game store initialized
fsmLogger.js:125 👤 PLAYER [22:25:39] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:132 👤 PLAYER [22:25:39] Created bot player: bot-0
fsmLogger.js:125 👤 PLAYER [22:25:39] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:132 🔵 INFO [22:25:39] [FSMContext] Creating new FSM machine for bot: bot-0
fsmLogger.js:132 🔵 INFO [22:25:39] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔴 ERROR [22:25:39] [useBotMachineFixed] No starting tile found for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:39] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:132 🔵 INFO [22:25:39] Système FSM démarré
fsmLogger.js:132 🔵 INFO [22:25:39] Système FSM: DÉMARRÉ
fsmLogger.js:132 🔵 INFO [22:25:39] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔴 ERROR [22:25:39] [useBotMachineFixed] No starting tile found for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:39] [Scene] Initializing tiles...
fsmLogger.js:125 🎮 GAME [22:25:39] Tiles initialized {component: 'tiles'}
tileGenerationSlice.js:371 [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:125 🔵 INFO [22:25:40] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:132 🔵 INFO [22:25:40] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔵 INFO [22:25:40] [D1] [useBotMachineFixed] Found starting tile for bot bot-0:
fsmLogger.js:132 🔵 INFO [22:25:40] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔵 INFO [22:25:40] [D1] [useBotMachineFixed] Found starting tile for bot bot-0:
useCentralizedEventHistory.js:95 [CentralizedEventHistory] Context update detected for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:40] Event added to history: CONTEXT_CHANGED for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:40] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔵 INFO [22:25:40] [D1] [useBotMachineFixed] Found starting tile for bot bot-0:
fsmLogger.js:132 🔵 INFO [22:25:40] [useBotMachineFixed] Bot bot-0 needs position synchronization
fsmLogger.js:132 🔵 INFO [22:25:40] [D1] [useBotMachineFixed] Found starting tile for bot bot-0:
useBotMachineFixed.js:67 [useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:41] 🚁 [Exploring] Deploying drone for first time
fsmLogger.js:132 🔵 INFO [22:25:41] 🔍 [Exploring] Starting exploration phase
useBotMachineFixed.js:67 [useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:41] 🚁 [Exploring] Deploying drone for first time
fsmLogger.js:132 🔵 INFO [22:25:41] 🔍 [Exploring] Starting exploration phase
useCentralizedEventHistory.js:71 [CentralizedEventHistory] State transition detected: evaluating → exploring for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:41] Event added to history: ASSESSMENT_COMPLETE for bot bot-0
useCentralizedEventHistory.js:95 [CentralizedEventHistory] Context update detected for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:41] Event added to history: CONTEXT_CHANGED for bot bot-0
useBotMachineFixed.js:67 [useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:42] 🚁 [Exploring] Deploying drone for first time
fsmLogger.js:132 🔵 INFO [22:25:42] 🔍 [Exploring] Starting exploration phase
useBotMachineFixed.js:67 [useBotMachineFixed] Sending ASSESSMENT_COMPLETE for bot bot-0
fsmLogger.js:132 🔵 INFO [22:25:42] 🚁 [Exploring] Deploying drone for first time
fsmLogger.js:132 🔵 INFO [22:25:42] 🔍 [Exploring] Starting exploration phase
fsmLogger.js:125 🔵 INFO [22:25:42] 🎯 [FSMPositionTracker] Drone deploying: distance 2.344 (seuil: 0.25) (visual: true) {botId: 'bot-0', droneState: 'deploying'}
fsmLogger.js:125 🔵 INFO [22:25:44] 🎯 [FSMPositionTracker] Drone deploying: distance 0.468 (seuil: 0.25) (visual: true) {botId: 'bot-0', droneState: 'deploying'}
fsmLogger.js:132 🔵 INFO [22:25:44] 🚀 [FSMPositionTracker] Auto-sending DRONE_DEPLOYED for bot-0 (visual position)
fsmLogger.js:132 🔵 INFO [22:25:44] 🚁 [Exploring] Drone successfully deployed, marking tile and recalling
fsmLogger.js:125 🔴 ERROR [22:25:44] ❌ [Exploring] Failed to mark tile in store: ReferenceError: require is not defined
    at Object.<anonymous> (exploring.js:93:36)
    at callForward (chunk-4EZ7HHGP.js?v=23a37820:13:49)
    at Object.<anonymous> (chunk-4EZ7HHGP.js?v=23a37820:18:14)
    at transitionTo (chunk-4EZ7HHGP.js?v=23a37820:142:35)
    at send (chunk-4EZ7HHGP.js?v=23a37820:162:12)
    at Object.send (chunk-4EZ7HHGP.js?v=23a37820:170:5)
    at useFSMPositionTracker.js:83:9
    at useFSMPositionTracker.js:173:7
    at Object.current (Fleet.jsx:110:7)
    at render$1 (chunk-Q4YQWOCV.js?v=23a37820:16971:22)
fsmLogger.js:125 🔵 INFO [22:25:46] 🎯 [FSMPositionTracker] Drone returning: distance 0.615 (seuil: 0.25) (visual: true) {botId: 'bot-0', droneState: 'returning'}
fsmLogger.js:132 🔵 INFO [22:25:47] 🏠 [FSMPositionTracker] Auto-sending DRONE_RETURNED for bot-0 (visual position)
fsmLogger.js:125 🔵 INFO [22:25:47] 🏠 [Exploring] Drone returned to ship, docking {botId: undefined}
