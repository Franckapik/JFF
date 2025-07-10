VM95344:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [10:23:22] Tiles initialized
fsmLogger.ts:207 🎮 GAME [10:23:22] [XFSMStore] Creation bot-0 - Status: active, State: evaluating
fsmLogger.ts:207 🎮 GAME [10:23:22] Bots initialized
fsmLogger.ts:207 🎮 GAME [10:23:22] Players initialized
fsmLogger.ts:207 🎮 GAME [10:23:22] [TileGeneration] Tuile de départ assignée à bot-0:0,4
fsmLogger.ts:207 🎮 GAME [10:23:22] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [10:23:22] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
VM95344:1 The result of getSnapshot should be cached to avoid an infinite loop Error Component Stack
    at Fleet (Fleet.tsx:31:51)
    at group (<anonymous>)
    at Scene (Scene.tsx:40:20)
    at Suspense (<anonymous>)
    at ErrorBoundary (chunk-MYIQN5PF.js?v=55a0677f:12419:5)
    at m (chunk-MYIQN5PF.js?v=55a0677f:12328:9)
    at chunk-MYIQN5PF.js?v=55a0677f:12397:5
    at Provider (chunk-MYIQN5PF.js?v=55a0677f:13920:3)
eval @ VM95344:1
overrideMethod @ hook.js:608
mountSyncExternalStore @ chunk-MYIQN5PF.js?v=55a0677f:3617
useSyncExternalStore @ chunk-MYIQN5PF.js?v=55a0677f:10716
exports.useSyncExternalStore @ chunk-UGC3UZ7L.js?v=55a0677f:930
useStore @ chunk-AAUWMGBL.js?v=55a0677f:15
useBoundStore @ chunk-AAUWMGBL.js?v=55a0677f:25
Fleet @ Fleet.tsx:33
react-stack-bottom-frame @ chunk-MYIQN5PF.js?v=55a0677f:10487
renderWithHooks @ chunk-MYIQN5PF.js?v=55a0677f:3275
updateFunctionComponent @ chunk-MYIQN5PF.js?v=55a0677f:4853
beginWork @ chunk-MYIQN5PF.js?v=55a0677f:5862
runWithFiberInDEV @ chunk-MYIQN5PF.js?v=55a0677f:918
performUnitOfWork @ chunk-MYIQN5PF.js?v=55a0677f:9394
workLoopSync @ chunk-MYIQN5PF.js?v=55a0677f:9255
renderRootSync @ chunk-MYIQN5PF.js?v=55a0677f:9238
performWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:8846
performSyncWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:2048
flushSyncWorkAcrossRoots_impl @ chunk-MYIQN5PF.js?v=55a0677f:1956
flushPassiveEffects @ chunk-MYIQN5PF.js?v=55a0677f:9691
(anonymous) @ chunk-MYIQN5PF.js?v=55a0677f:9605
performWorkUntilDeadline @ chunk-MYIQN5PF.js?v=55a0677f:238
fsmLogger.ts:199 ⚡ EVENT [10:23:22] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [10:23:22] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -3.8301270189221936, y: 0.8, z: 2}
fsmLogger.ts:199 🚀 MOUVEMENT [10:23:22] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -4.330127018922194, y: 0.5, z: 1.5}
fsmLogger.ts:199 🐛 DEBUG [10:23:22] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [10:23:22] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [10:23:22] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [10:23:22] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟢 STATE [10:23:22] action_evaluating_entry
fsmLogger.ts:199 🔵 INFO [10:23:22] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔧 CONTEXT [10:23:22] 🛸 [bot-0] explorer position: (0.00, 0.50, 0.00)
fsmLogger.ts:199 🔧 CONTEXT [10:23:22] [bot-0] Updating ship position {position: {…}, coord: {…}, shipType: 'ship', timestamp: 1752135802661}
fsmLogger.ts:207 🎮 GAME [10:23:22] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating
chunk-MYIQN5PF.js?v=55a0677f:1871 Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at getRootForUpdatedFiber (chunk-MYIQN5PF.js?v=55a0677f:1871:128)
    at enqueueConcurrentRenderForLane (chunk-MYIQN5PF.js?v=55a0677f:1859:16)
    at forceStoreRerender (chunk-MYIQN5PF.js?v=55a0677f:3719:20)
    at updateStoreInstance (chunk-MYIQN5PF.js?v=55a0677f:3701:41)
    at react-stack-bottom-frame (chunk-MYIQN5PF.js?v=55a0677f:10537:20)
    at runWithFiberInDEV (chunk-MYIQN5PF.js?v=55a0677f:918:18)
    at commitHookEffectListMount (chunk-MYIQN5PF.js?v=55a0677f:6958:123)
    at commitHookPassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:7016:60)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8302:29)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8296:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
getRootForUpdatedFiber @ chunk-MYIQN5PF.js?v=55a0677f:1871
enqueueConcurrentRenderForLane @ chunk-MYIQN5PF.js?v=55a0677f:1859
forceStoreRerender @ chunk-MYIQN5PF.js?v=55a0677f:3719
updateStoreInstance @ chunk-MYIQN5PF.js?v=55a0677f:3701
react-stack-bottom-frame @ chunk-MYIQN5PF.js?v=55a0677f:10537
runWithFiberInDEV @ chunk-MYIQN5PF.js?v=55a0677f:918
commitHookEffectListMount @ chunk-MYIQN5PF.js?v=55a0677f:6958
commitHookPassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:7016
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8302
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8358
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8306
flushPassiveEffects @ chunk-MYIQN5PF.js?v=55a0677f:9682
commitRootImpl @ chunk-MYIQN5PF.js?v=55a0677f:9633
commitRoot @ chunk-MYIQN5PF.js?v=55a0677f:9552
commitRootWhenReady @ chunk-MYIQN5PF.js?v=55a0677f:9036
performWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:8980
performSyncWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:2048
flushSyncWorkAcrossRoots_impl @ chunk-MYIQN5PF.js?v=55a0677f:1956
flushPassiveEffects @ chunk-MYIQN5PF.js?v=55a0677f:9691
(anonymous) @ chunk-MYIQN5PF.js?v=55a0677f:9605
performWorkUntilDeadline @ chunk-MYIQN5PF.js?v=55a0677f:238
chunk-MYQMZAZZ.js?v=55a0677f:6228 Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at getRootForUpdatedFiber (chunk-MYIQN5PF.js?v=55a0677f:1871:128)
    at enqueueConcurrentRenderForLane (chunk-MYIQN5PF.js?v=55a0677f:1859:16)
    at forceStoreRerender (chunk-MYIQN5PF.js?v=55a0677f:3719:20)
    at updateStoreInstance (chunk-MYIQN5PF.js?v=55a0677f:3701:41)
    at react-stack-bottom-frame (chunk-MYIQN5PF.js?v=55a0677f:10537:20)
    at runWithFiberInDEV (chunk-MYIQN5PF.js?v=55a0677f:918:18)
    at commitHookEffectListMount (chunk-MYIQN5PF.js?v=55a0677f:6958:123)
    at commitHookPassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:7016:60)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8302:29)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8385:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
    at commitPassiveMountOnFiber (chunk-MYIQN5PF.js?v=55a0677f:8296:13)
    at recursivelyTraversePassiveMountEffects (chunk-MYIQN5PF.js?v=55a0677f:8283:13)
getRootForUpdatedFiber @ chunk-MYIQN5PF.js?v=55a0677f:1871
enqueueConcurrentRenderForLane @ chunk-MYIQN5PF.js?v=55a0677f:1859
forceStoreRerender @ chunk-MYIQN5PF.js?v=55a0677f:3719
updateStoreInstance @ chunk-MYIQN5PF.js?v=55a0677f:3701
react-stack-bottom-frame @ chunk-MYIQN5PF.js?v=55a0677f:10537
runWithFiberInDEV @ chunk-MYIQN5PF.js?v=55a0677f:918
commitHookEffectListMount @ chunk-MYIQN5PF.js?v=55a0677f:6958
commitHookPassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:7016
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8302
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8358
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8385
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8296
recursivelyTraversePassiveMountEffects @ chunk-MYIQN5PF.js?v=55a0677f:8283
commitPassiveMountOnFiber @ chunk-MYIQN5PF.js?v=55a0677f:8306
flushPassiveEffects @ chunk-MYIQN5PF.js?v=55a0677f:9682
commitRootImpl @ chunk-MYIQN5PF.js?v=55a0677f:9633
commitRoot @ chunk-MYIQN5PF.js?v=55a0677f:9552
commitRootWhenReady @ chunk-MYIQN5PF.js?v=55a0677f:9036
performWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:8980
performSyncWorkOnRoot @ chunk-MYIQN5PF.js?v=55a0677f:2048
flushSyncWorkAcrossRoots_impl @ chunk-MYIQN5PF.js?v=55a0677f:1956
flushPassiveEffects @ chunk-MYIQN5PF.js?v=55a0677f:9691
(anonymous) @ chunk-MYIQN5PF.js?v=55a0677f:9605
performWorkUntilDeadline @ chunk-MYIQN5PF.js?v=55a0677f:238
chunk-DFUGOSMY.js?v=55a0677f:40257 THREE.WebGLRenderer: Context Lost.
fsmLogger.ts:207 🔵 INFO [10:23:23] [Evaluating] → needExploring (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [10:23:23] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.ts:207 🟢 STATE [10:23:23] action_evaluating_exit
fsmLogger.ts:199 🔵 INFO [10:23:23] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [10:23:23] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.ts:207 🔵 INFO [10:23:23] 🚁 [bot-0] Deploying drone for exploration
fsmLogger.ts:207 🐛 DEBUG [10:23:23] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.ts:199 🔵 INFO [10:23:23] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟢 STATE [10:23:23] 🚀 [bot-0] Entering exploring state
fsmLogger.ts:207 🟢 STATE [10:23:23] 🛸 [bot-0] Drone deploying - moving to target
