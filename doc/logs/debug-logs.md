fsmLogger.js:119 🔵 INFO [19:10:01] [bot-0] Initializing bot FSM for Bot 1 (bot-0)
fsmLogger.js:119 🟢 STATE [19:10:01] [bot-0] Entering IDLE state for bot bot-0
fsmLogger.js:112 🟠 ACTION [19:10:01] [bot-0] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:119 🟢 STATE [19:10:01] [bot-0] Bot 1 (bot-0) initialized in IDLE state
fsmLogger.js:119 🔵 INFO [19:10:01] [bot-0] [MultiBotManager] Initialized Bot 1 (bot-0)
fsmLogger.js:119 🔵 INFO [19:10:01] [bot-0] Starting bot processing
fsmLogger.js:112 🟠 ACTION [19:10:01] [bot-0] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:119 🔵 INFO [19:10:01] [MultiBotManager] Bots started automatically
fsmLogger.js:119 🔵 INFO [19:10:01] [bot-0] Switching active bot to Bot 1 (bot-0)
fsmLogger.js:119 🟢 STATE [19:10:01] [bot-0] Entering IDLE state for bot bot-0
fsmLogger.js:112 🟠 ACTION [19:10:01] [bot-0] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:119 🔵 INFO [19:10:01] [MultiBotManager] Starting parallel processing mode
fsmLogger.js:119 🚀 MOUVEMENT [19:10:01] [VehicleMovement] Deactivated movement for bot-0/undefined-ship
fsmLogger.js:119 🟢 STATE [19:10:01] [bot-0-drone-explorer_drone] [DroneState] Initialized drone bot-0-drone-explorer_drone in DOCKED_WITH_SHIP state
fsmLogger.js:119 🚀 MOUVEMENT [19:10:01] [VehicleMovement] Deactivated movement for bot-0/bot-0-drone-explorer_drone
fsmLogger.js:119 🔵 INFO [19:10:01] [Scene] Initializing tiles...
fsmLogger.js:119 🚀 MOUVEMENT [19:10:01] [VehicleMovement] Deactivated movement for player1/ship
fsmLogger.js:119 🟢 STATE [19:10:01] [player1-drone-explorer_drone] [DroneState] Initialized drone player1-drone-explorer_drone in DOCKED_WITH_SHIP state
fsmLogger.js:119 🚀 MOUVEMENT [19:10:01] [VehicleMovement] Deactivated movement for player1/player1-drone-explorer_drone
fsmLogger.js:112 🔵 INFO [19:10:01] [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
playerBaseSlice.js:51 Not enough starting tiles of type 'depart' found. Need 2 (for 1 human players and 1 bots), but found only 1. Check tile generation or player/bot count in useGameStore. {needed: 2, found: 1, playerCountFromGameStore: 1, botCountFromGameStore: 1, playersToInitialize: {…}, …} Error Component Stack
    at Scene (Scene.jsx:20:27)
    at Suspense (<anonymous>)
    at ErrorBoundary (chunk-Q4YQWOCV.js?v=ffdcef8a:16084:5)
    at FiberProvider (chunk-Q4YQWOCV.js?v=ffdcef8a:17704:21)
    at Provider (chunk-Q4YQWOCV.js?v=ffdcef8a:17371:3)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
initializePlayer @ playerBaseSlice.js:51
(anonymous) @ Scene.jsx:51
commitHookEffectListMount @ chunk-Q4YQWOCV.js?v=ffdcef8a:10915
commitPassiveMountOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12223
commitPassiveMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12195
commitPassiveMountEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12185
commitPassiveMountEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:12175
flushPassiveEffectsImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13943
flushPassiveEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:13906
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13875
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
chunk-Q4YQWOCV.js?v=ffdcef8a:10678 Uncaught Error: Not enough starting tiles of type 'depart' found. Need 2 (for 1 human players and 1 bots), but found only 1. Check tile generation or player/bot count in useGameStore.
    at initializePlayer (playerBaseSlice.js:59:15)
    at Scene.jsx:51:7
    at commitHookEffectListMount (chunk-Q4YQWOCV.js?v=ffdcef8a:10915:34)
    at commitPassiveMountOnFiber (chunk-Q4YQWOCV.js?v=ffdcef8a:12223:19)
    at commitPassiveMountEffects_complete (chunk-Q4YQWOCV.js?v=ffdcef8a:12195:17)
    at commitPassiveMountEffects_begin (chunk-Q4YQWOCV.js?v=ffdcef8a:12185:15)
    at commitPassiveMountEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:12175:11)
    at flushPassiveEffectsImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13943:11)
    at flushPassiveEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:13906:22)
    at commitRootImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13875:13)
initializePlayer @ playerBaseSlice.js:59
(anonymous) @ Scene.jsx:51
commitHookEffectListMount @ chunk-Q4YQWOCV.js?v=ffdcef8a:10915
commitPassiveMountOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12223
commitPassiveMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12195
commitPassiveMountEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12185
commitPassiveMountEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:12175
flushPassiveEffectsImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13943
flushPassiveEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:13906
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13875
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
hook.js:608 The above error occurred in the <Scene> component:

    at Scene (http://localhost:5173/src/components/Scene.jsx?t=1748279281700:37:27)
    at Suspense
    at ErrorBoundary (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ffdcef8a:16084:5)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ffdcef8a:17704:21)
    at Provider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ffdcef8a:17371:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
logCapturedError @ chunk-Q4YQWOCV.js?v=ffdcef8a:7769
callback @ chunk-Q4YQWOCV.js?v=ffdcef8a:7815
callCallback @ chunk-Q4YQWOCV.js?v=ffdcef8a:3720
commitUpdateQueue @ chunk-Q4YQWOCV.js?v=ffdcef8a:3737
commitLayoutEffectOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:11070
commitLayoutMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12044
commitLayoutEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12033
commitLayoutEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:11984
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13822
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
chunk-Q4YQWOCV.js?v=ffdcef8a:17969 Uncaught Error: Not enough starting tiles of type 'depart' found. Need 2 (for 1 human players and 1 bots), but found only 1. Check tile generation or player/bot count in useGameStore.
    at initializePlayer (playerBaseSlice.js:59:15)
    at Scene.jsx:51:7
    at commitHookEffectListMount (chunk-Q4YQWOCV.js?v=ffdcef8a:10915:34)
    at commitPassiveMountOnFiber (chunk-Q4YQWOCV.js?v=ffdcef8a:12223:19)
    at commitPassiveMountEffects_complete (chunk-Q4YQWOCV.js?v=ffdcef8a:12195:17)
    at commitPassiveMountEffects_begin (chunk-Q4YQWOCV.js?v=ffdcef8a:12185:15)
    at commitPassiveMountEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:12175:11)
    at flushPassiveEffectsImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13943:11)
    at flushPassiveEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:13906:22)
    at commitRootImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13875:13)
initializePlayer @ playerBaseSlice.js:59
(anonymous) @ Scene.jsx:51
commitHookEffectListMount @ chunk-Q4YQWOCV.js?v=ffdcef8a:10915
commitPassiveMountOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12223
commitPassiveMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12195
commitPassiveMountEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12185
commitPassiveMountEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:12175
flushPassiveEffectsImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13943
flushPassiveEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:13906
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13875
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
chunk-Q4YQWOCV.js?v=ffdcef8a:17969 Uncaught Error: Not enough starting tiles of type 'depart' found. Need 2 (for 1 human players and 1 bots), but found only 1. Check tile generation or player/bot count in useGameStore.
    at initializePlayer (playerBaseSlice.js:59:15)
    at Scene.jsx:51:7
    at commitHookEffectListMount (chunk-Q4YQWOCV.js?v=ffdcef8a:10915:34)
    at commitPassiveMountOnFiber (chunk-Q4YQWOCV.js?v=ffdcef8a:12223:19)
    at commitPassiveMountEffects_complete (chunk-Q4YQWOCV.js?v=ffdcef8a:12195:17)
    at commitPassiveMountEffects_begin (chunk-Q4YQWOCV.js?v=ffdcef8a:12185:15)
    at commitPassiveMountEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:12175:11)
    at flushPassiveEffectsImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13943:11)
    at flushPassiveEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:13906:22)
    at commitRootImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13875:13)
initializePlayer @ playerBaseSlice.js:59
(anonymous) @ Scene.jsx:51
commitHookEffectListMount @ chunk-Q4YQWOCV.js?v=ffdcef8a:10915
commitPassiveMountOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12223
commitPassiveMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12195
commitPassiveMountEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12185
commitPassiveMountEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:12175
flushPassiveEffectsImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13943
flushPassiveEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:13906
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13875
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
hook.js:608 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ffdcef8a:17929:3)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ffdcef8a:17704:21)
    at CanvasWrapper
    at div
    at div
    at div
    at App (http://localhost:5173/src/App.jsx?t=1748279281700:28:47)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
logCapturedError @ chunk-RC3YDMAO.js?v=ffdcef8a:14032
update.callback @ chunk-RC3YDMAO.js?v=ffdcef8a:14052
callCallback @ chunk-RC3YDMAO.js?v=ffdcef8a:11248
commitUpdateQueue @ chunk-RC3YDMAO.js?v=ffdcef8a:11265
commitLayoutEffectOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:17093
commitLayoutMountEffects_complete @ chunk-RC3YDMAO.js?v=ffdcef8a:17980
commitLayoutEffects_begin @ chunk-RC3YDMAO.js?v=ffdcef8a:17969
commitLayoutEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:17920
commitRootImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19353
commitRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:19277
finishConcurrentRender @ chunk-RC3YDMAO.js?v=ffdcef8a:18760
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:18718
workLoop @ chunk-RC3YDMAO.js?v=ffdcef8a:197
flushWork @ chunk-RC3YDMAO.js?v=ffdcef8a:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ffdcef8a:384
chunk-RC3YDMAO.js?v=ffdcef8a:19413 Uncaught Error: Not enough starting tiles of type 'depart' found. Need 2 (for 1 human players and 1 bots), but found only 1. Check tile generation or player/bot count in useGameStore.
    at initializePlayer (playerBaseSlice.js:59:15)
    at Scene.jsx:51:7
    at commitHookEffectListMount (chunk-Q4YQWOCV.js?v=ffdcef8a:10915:34)
    at commitPassiveMountOnFiber (chunk-Q4YQWOCV.js?v=ffdcef8a:12223:19)
    at commitPassiveMountEffects_complete (chunk-Q4YQWOCV.js?v=ffdcef8a:12195:17)
    at commitPassiveMountEffects_begin (chunk-Q4YQWOCV.js?v=ffdcef8a:12185:15)
    at commitPassiveMountEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:12175:11)
    at flushPassiveEffectsImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13943:11)
    at flushPassiveEffects (chunk-Q4YQWOCV.js?v=ffdcef8a:13906:22)
    at commitRootImpl (chunk-Q4YQWOCV.js?v=ffdcef8a:13875:13)
initializePlayer @ playerBaseSlice.js:59
(anonymous) @ Scene.jsx:51
commitHookEffectListMount @ chunk-Q4YQWOCV.js?v=ffdcef8a:10915
commitPassiveMountOnFiber @ chunk-Q4YQWOCV.js?v=ffdcef8a:12223
commitPassiveMountEffects_complete @ chunk-Q4YQWOCV.js?v=ffdcef8a:12195
commitPassiveMountEffects_begin @ chunk-Q4YQWOCV.js?v=ffdcef8a:12185
commitPassiveMountEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:12175
flushPassiveEffectsImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13943
flushPassiveEffects @ chunk-Q4YQWOCV.js?v=ffdcef8a:13906
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13875
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
performSyncWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13336
flushSyncCallbacks @ chunk-Q4YQWOCV.js?v=ffdcef8a:2770
commitRootImpl @ chunk-Q4YQWOCV.js?v=ffdcef8a:13891
commitRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ffdcef8a:13246
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ffdcef8a:13159
workLoop @ chunk-Q4YQWOCV.js?v=ffdcef8a:278
flushWork @ chunk-Q4YQWOCV.js?v=ffdcef8a:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ffdcef8a:465
MultiBotManager.jsx:58 [MultiBotManager] Stopped bot processing
chunk-4OO23XFX.js?v=ffdcef8a:17835 THREE.WebGLRenderer: Context Lost.
