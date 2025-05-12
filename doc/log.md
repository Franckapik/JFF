Scene.jsx:26 [Scene] Initializing tiles...
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:38 [Scene] Initializing bot...
fsmLogger.js:96 🔵 INFO [22:07:08] Initializing bot FSM
fsmLogger.js:96 🟢 STATE [22:07:08] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:08] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:07:08] Adding action to queue: testQueue {priority: 4}
fsmLogger.js:89 🟠 ACTION [22:07:08] Adding action to queue: exploreDrone {priority: 3}
fsmLogger.js:89 🟠 ACTION [22:07:08] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:96 🟢 STATE [22:07:08] Bot initialized in IDLE state with testQueue action
ShipMovement.jsx:117 Setting initial position: {x: 1.8, y: 0, z: 0}
ShipMovement.jsx:117 Setting initial position: {x: 1.8, y: 0, z: -3.117691453623979}
App.jsx:24 [App] Starting bot processing with setInterval
fsmLogger.js:96 🟠 ACTION [22:07:09] Execute: Start: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:09] Starting test queue action - Will complete in 5 seconds
fsmLogger.js:96 🟠 ACTION [22:07:10] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:11] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:12] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:13] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:14] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:15] Execute: Continue: testQueue (priority: 4) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:15] Test queue action completed after 6.0 seconds
fsmLogger.js:89 🟠 ACTION [22:07:15] completed action: testQueue {elapsed: 7017}
fsmLogger.js:96 🟠 ACTION [22:07:16] Execute: Start: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:16] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:07:16] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:07:16] Found 23 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:07:16] Sending drone to explore tile: F1, distance: 0.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: F1
fsmLogger.js:96 🟠 ACTION [22:07:16] Exploration started at 22:07:16
fsmLogger.js:96 🟠 ACTION [22:07:17] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:07:18] Execute: Continue: exploreDrone (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:18] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:89 🟠 ACTION [22:07:18] completed action: exploreDrone {elapsed: 10017}
fsmLogger.js:96 🟠 ACTION [22:07:19] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:19] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:07:19] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:07:19] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:07:19] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:07:19] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:07:19] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:07:19] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:07:19] completed action: exploreDrone {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:20] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:20] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:20] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:07:20] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:07:20] Found 22 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:07:20] Sending drone to explore tile: E1, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: E1
fsmLogger.js:96 🟠 ACTION [22:07:20] Exploration started at 22:07:20
fsmLogger.js:96 🟠 ACTION [22:07:21] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:22] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at E1: {food: 58, debris: 7932, special: 1}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 4
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [22:07:23] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:24] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:07:25] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:25] Drone has returned to ship, exploration sequence fully complete after 5.0s
fsmLogger.js:96 🟢 STATE [22:07:25] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:25] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:07:25] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:25] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:25] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:07:25] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:25] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:07:26] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:07:26] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:26] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:07:26] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:07:26] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:07:26] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:07:26] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:07:26] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:07:26] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:07:26] completed action: exploreDrone {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:27] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:27] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:27] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:07:27] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:07:27] Found 21 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:07:27] Sending drone to explore tile: E2, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: E2
fsmLogger.js:96 🟠 ACTION [22:07:27] Exploration started at 22:07:27
fsmLogger.js:96 🟠 ACTION [22:07:28] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:29] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:30] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at E2: {food: 60, debris: 9850, special: 0}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟠 ACTION [22:07:31] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:32] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:33] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:34] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:96 🟠 ACTION [22:07:35] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:35] Drone has returned to ship, exploration sequence fully complete after 8.0s
fsmLogger.js:96 🟢 STATE [22:07:35] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:35] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:07:35] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:35] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:35] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:07:35] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:35] Bot status: Fuel=100, At base=true
fsmLogger.js:89 🟠 ACTION [22:07:36] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:07:36] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:36] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:07:36] Condition centrale satisfaite: transition vers exploring
fsmLogger.js:96 🟢 STATE [22:07:36] Transition: idle → exploring
fsmLogger.js:96 🟢 STATE [22:07:36] Exiting IDLE state, transitioning to exploring
fsmLogger.js:96 🔵 INFO [22:07:36] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:07:36] Entering EXPLORING state
fsmLogger.js:89 🟠 ACTION [22:07:36] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:07:36] completed action: exploreDrone {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:07:37] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:37] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:37] Attempting to find a tile to explore
fsmLogger.js:96 🔵 INFO [22:07:37] Using exploring radius: 3
fsmLogger.js:96 🔵 INFO [22:07:37] Found 20 walkable unexplored tiles in radius
fsmLogger.js:96 🟠 ACTION [22:07:37] Sending drone to explore tile: F0, distance: 1.00
usePlayerStore.js:285 [PlayerStore] Moving player2/drone3 to tile: F0
fsmLogger.js:96 🟠 ACTION [22:07:37] Exploration started at 22:07:37
fsmLogger.js:96 🟠 ACTION [22:07:38] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:39] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
UnifiedDroneMovement.jsx:243 [UnifiedDroneMovement] Bot drone discovered new resources at F0: {food: 51, debris: 7113, special: 0}
UnifiedDroneMovement.jsx:287 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:33 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:96 🟣 CONDITION [22:07:40] Exit condition met in state exploring: transitioning to idle
fsmLogger.js:96 🟢 STATE [22:07:40] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:40] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:96 🟢 STATE [22:07:40] Transition: exploring → idle
fsmLogger.js:96 🟢 STATE [22:07:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:40] Bot status: Fuel=100, At base=true
fsmLogger.js:96 🟢 STATE [22:07:40] Entering IDLE state - Evaluating conditions
fsmLogger.js:96 🔵 INFO [22:07:40] Bot status: Fuel=100, At base=true
UnifiedDroneMovement.jsx:184 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:89 🟠 ACTION [22:07:41] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:96 🟠 ACTION [22:07:41] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:96 🟠 ACTION [22:07:41] Evaluating conditions from IDLE state using centralized conditions
fsmLogger.js:96 🟣 CONDITION [22:07:41] Condition centrale satisfaite: transition vers collecting
fsmLogger.js:96 🟢 STATE [22:07:41] Transition: idle → collecting
fsmLogger.js:96 🟢 STATE [22:07:41] Exiting IDLE state, transitioning to collecting
fsmLogger.js:96 🔵 INFO [22:07:41] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:96 🟢 STATE [22:07:41] Entering COLLECTING state
fsmLogger.js:89 🟠 ACTION [22:07:41] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:89 🟠 ACTION [22:07:41] completed action: moveToResource {elapsed: 0}
fsmLogger.js:89 🟠 ACTION [22:07:42] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:42] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:42] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:42] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:43] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:43] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:43] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:43] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:44] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:44] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:44] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:44] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:45] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:45] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:45] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:45] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:46] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:46] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:46] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:46] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:47] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:47] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:47] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:47] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:48] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:48] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:48] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:48] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:49] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:49] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:49] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:49] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:50] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:50] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:50] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:50] failed action: moveToResource {elapsed: 1}
fsmLogger.js:89 🟠 ACTION [22:07:51] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:51] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:51] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:51] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:52] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:52] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:52] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:52] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:53] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:53] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:53] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:53] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:54] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:54] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:54] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:54] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:55] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:55] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:55] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:55] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
Clock.jsx:12 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ Clock.jsx:12
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:56] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:56] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:56] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:56] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:57] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:57] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:57] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:57] failed action: moveToResource {elapsed: 0}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
fsmLogger.js:89 🟠 ACTION [22:07:58] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:96 🟠 ACTION [22:07:58] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:89 🔴 ERROR [22:07:58] Error in action moveToResource: TypeError: tileStore.getTileAtCoord is not a function
    at moveToResourceAction.js:76:28
    at Array.map (<anonymous>)
    at moveToResourceAction (moveToResourceAction.js:74:42)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:291:11)
    at App.jsx:28:9
fsmLogger.js:89 🟠 ACTION [22:07:58] failed action: moveToResource {elapsed: 1}
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
BotDebugger.jsx:204 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at BotDebugger (BotDebugger.jsx:125:37)
    at div (<anonymous>)
    at App (App.jsx:14:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=42eb1b0c:19665
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18533
dispatchSetState @ chunk-RC3YDMAO.js?v=42eb1b0c:12403
(anonymous) @ BotDebugger.jsx:204
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=42eb1b0c:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=42eb1b0c:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=42eb1b0c:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=42eb1b0c:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=42eb1b0c:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=42eb1b0c:19447
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:19328
workLoop @ chunk-RC3YDMAO.js?v=42eb1b0c:197
flushWork @ chunk-RC3YDMAO.js?v=42eb1b0c:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=42eb1b0c:384
