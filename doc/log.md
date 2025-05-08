Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: Object
Scene.jsx:39 [Scene] Initializing bot...
fsmLogger.js:87 🔵 INFO [07:56:57] Initializing bot FSM null
fsmLogger.js:87 🟢 STATE [07:56:57] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:56:57] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:56:57] Adding action to queue: evaluateIdle Object
fsmLogger.js:87 🟢 STATE [07:56:57] Bot initialized in IDLE state null
ShipMovement.jsx:116 Setting initial position: Object
ShipMovement.jsx:116 Setting initial position: Object
:5173/favicon.ico:1 
            
            
           Failed to load resource: the server responded with a status of 404 (Not Found)Understand this errorAI
fsmLogger.js:87 🟠 ACTION [07:56:58] Execute: evaluateIdle (priority: 3) null
fsmLogger.js:87 🟠 ACTION [07:56:58] Evaluating conditions from IDLE state null
fsmLogger.js:87 🟣 CONDITION [07:56:58] No specific conditions met in IDLE evaluation, changing to EXPLORING state null
fsmLogger.js:87 🟢 STATE [07:56:58] Transition: idle → exploring Object
fsmLogger.js:87 🟢 STATE [07:56:58] Exiting IDLE state, transitioning to exploring null
fsmLogger.js:87 🔵 INFO [07:56:58] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0} null
fsmLogger.js:87 🟢 STATE [07:56:58] Entering EXPLORING state null
fsmLogger.js:87 🟠 ACTION [07:56:58] Adding action to queue: exploreDrone Object
fsmLogger.js:87 🟠 ACTION [07:56:58] Adding action to queue: exploreDrone Object
fsmLogger.js:87 🟠 ACTION [07:56:58] Completed action: evaluateIdle Object
fsmLogger.js:87 🟣 CONDITION [07:56:59] Checking conditions in state: exploring null
fsmLogger.js:87 🟠 ACTION [07:56:59] Execute: exploreDrone (priority: 2) null
fsmLogger.js:87 🟠 ACTION [07:56:59] Attempting to find a tile to explore null
fsmLogger.js:87 🔵 INFO [07:56:59] Using exploring radius: 3 null
fsmLogger.js:87 🔵 INFO [07:56:59] Found 25 walkable unexplored tiles in radius null
fsmLogger.js:87 🟠 ACTION [07:56:59] Sending drone to explore tile: D2, distance: 0.00 null
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: D2
fsmLogger.js:87 🟠 ACTION [07:56:59] Exploration action complete, returning to IDLE for re-evaluation null
fsmLogger.js:87 🟢 STATE [07:56:59] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T05:56:59.694Z'}
fsmLogger.js:87 🟢 STATE [07:56:59] Exiting EXPLORING state - Returning to IDLE for evaluation null
fsmLogger.js:87 🟢 STATE [07:56:59] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T05:56:59.695Z'}
fsmLogger.js:87 🟢 STATE [07:56:59] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:56:59] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:56:59] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟢 STATE [07:56:59] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:56:59] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:56:59] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:56:59] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 2
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:87 🟠 ACTION [07:57:00] Execute: evaluateIdle (priority: 3) null
fsmLogger.js:87 🟠 ACTION [07:57:00] Evaluating conditions from IDLE state null
fsmLogger.js:87 🟣 CONDITION [07:57:00] No specific conditions met in IDLE evaluation, changing to EXPLORING state null
fsmLogger.js:87 🟢 STATE [07:57:00] Transition: idle → exploring {targetState: null, timestamp: '2025-05-08T05:57:00.691Z'}
fsmLogger.js:87 🟢 STATE [07:57:00] Exiting IDLE state, transitioning to exploring null
fsmLogger.js:87 🔵 INFO [07:57:00] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0} null
fsmLogger.js:87 🟢 STATE [07:57:00] Entering EXPLORING state null
fsmLogger.js:87 🟠 ACTION [07:57:00] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:00] Adding action to queue: exploreDrone {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:00] Completed action: evaluateIdle {priority: 3, elapsed: 997}
fsmLogger.js:87 🟣 CONDITION [07:57:01] Checking conditions in state: exploring null
fsmLogger.js:87 🟠 ACTION [07:57:01] Execute: exploreDrone (priority: 2) null
fsmLogger.js:87 🟠 ACTION [07:57:01] Attempting to find a tile to explore null
fsmLogger.js:87 🔵 INFO [07:57:01] Using exploring radius: 3 null
fsmLogger.js:87 🔵 INFO [07:57:01] Found 24 walkable unexplored tiles in radius null
fsmLogger.js:87 🟠 ACTION [07:57:01] Sending drone to explore tile: C2, distance: 1.00 null
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: C2
fsmLogger.js:87 🟠 ACTION [07:57:01] Exploration action complete, returning to IDLE for re-evaluation null
fsmLogger.js:87 🟢 STATE [07:57:01] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T05:57:01.700Z'}
fsmLogger.js:87 🟢 STATE [07:57:01] Exiting EXPLORING state - Returning to IDLE for evaluation null
fsmLogger.js:87 🟢 STATE [07:57:01] Transition: exploring → idle {targetState: null, timestamp: '2025-05-08T05:57:01.700Z'}
fsmLogger.js:87 🟢 STATE [07:57:01] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:01] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:01] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟢 STATE [07:57:01] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:01] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:01] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:01] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at C2: {food: 22, debris: 1686, special: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 4
chunk-Q4YQWOCV.js?v=42eb1b0c:17701 Warning: `NaN` is an invalid value for the `color` css style property.
    at td
    at tr
    at tbody
    at table
    at div
    at div
    at div
    at div
    at BotHUD (http://localhost:5173/src/components/BotHUD.jsx:24:20)
    at div
    at div
    at CollapsibleHUD (http://localhost:5173/src/components/CollapsibleHUD.jsx:20:27)
    at div
    at div
    at App (http://localhost:5173/src/App.jsx:33:47)
console.error @ chunk-Q4YQWOCV.js?v=42eb1b0c:17701
printWarning @ chunk-RC3YDMAO.js?v=42eb1b0c:521
error @ chunk-RC3YDMAO.js?v=42eb1b0c:505
warnStyleValueIsNaN @ chunk-RC3YDMAO.js?v=42eb1b0c:2556
warnValidStyle @ chunk-RC3YDMAO.js?v=42eb1b0c:2575
setValueForStyles @ chunk-RC3YDMAO.js?v=42eb1b0c:2611
setInitialDOMProperties @ chunk-RC3YDMAO.js?v=42eb1b0c:7435
setInitialProperties @ chunk-RC3YDMAO.js?v=42eb1b0c:7595
finalizeInitialChildren @ chunk-RC3YDMAO.js?v=42eb1b0c:8345
completeWork @ chunk-RC3YDMAO.js?v=42eb1b0c:16293
completeUnitOfWork @ chunk-RC3YDMAO.js?v=42eb1b0c:19224
performUnitOfWork @ chunk-RC3YDMAO.js?v=42eb1b0c:19206
workLoopSync @ chunk-RC3YDMAO.js?v=42eb1b0c:19137
renderRootSync @ chunk-RC3YDMAO.js?v=42eb1b0c:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=42eb1b0c:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=42eb1b0c:9119
(anonymous) @ chunk-RC3YDMAO.js?v=42eb1b0c:18627
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=42eb1b0c:16984Understand this errorAI
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:87 🟠 ACTION [07:57:02] Execute: evaluateIdle (priority: 3) null
fsmLogger.js:87 🟠 ACTION [07:57:02] Evaluating conditions from IDLE state null
fsmLogger.js:87 🟣 CONDITION [07:57:02] 1 resources available, changing to COLLECTING state null
fsmLogger.js:87 🟢 STATE [07:57:02] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T05:57:02.707Z'}
fsmLogger.js:87 🟢 STATE [07:57:02] Exiting IDLE state, transitioning to collecting null
fsmLogger.js:87 🔵 INFO [07:57:02] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0} null
fsmLogger.js:87 🟢 STATE [07:57:02] Entering COLLECTING state null
fsmLogger.js:87 🟠 ACTION [07:57:02] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:02] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:02] Completed action: evaluateIdle {priority: 3, elapsed: 1007}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:87 🟣 CONDITION [07:57:03] Checking conditions in state: collecting null
fsmLogger.js:87 🟠 ACTION [07:57:03] Execute: exploreDrone (priority: 2) null
fsmLogger.js:87 🟠 ACTION [07:57:03] Attempting to find a tile to explore null
fsmLogger.js:87 🔵 INFO [07:57:03] Using exploring radius: 3 null
fsmLogger.js:87 🔵 INFO [07:57:03] Found 23 walkable unexplored tiles in radius null
fsmLogger.js:87 🟠 ACTION [07:57:03] Sending drone to explore tile: D1, distance: 1.00 null
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: D1
fsmLogger.js:87 🟣 CONDITION [07:57:03] Exploration count reached threshold and resources found, returning to IDLE null
fsmLogger.js:87 🟢 STATE [07:57:03] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:03.716Z'}
fsmLogger.js:87 🟢 STATE [07:57:03] Exiting COLLECTING state - Returning to IDLE for evaluation null
fsmLogger.js:87 🟢 STATE [07:57:03] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:03.717Z'}
fsmLogger.js:87 🟢 STATE [07:57:03] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:03] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:03] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟢 STATE [07:57:03] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:03] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:03] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:03] Completed action: evaluateIdle {priority: 3, elapsed: 0}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at D1: {food: 7, debris: 7115, special: 1}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 6
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:87 🟠 ACTION [07:57:04] Execute: evaluateIdle (priority: 3) null
fsmLogger.js:87 🟠 ACTION [07:57:04] Evaluating conditions from IDLE state null
fsmLogger.js:87 🟣 CONDITION [07:57:04] 2 resources available, changing to COLLECTING state null
fsmLogger.js:87 🟢 STATE [07:57:04] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T05:57:04.724Z'}
fsmLogger.js:87 🟢 STATE [07:57:04] Exiting IDLE state, transitioning to collecting null
fsmLogger.js:87 🔵 INFO [07:57:04] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0} null
fsmLogger.js:87 🟢 STATE [07:57:04] Entering COLLECTING state null
fsmLogger.js:87 🟠 ACTION [07:57:04] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:04] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:04] Completed action: evaluateIdle {priority: 3, elapsed: 1008}
UnifiedDroneMovement.jsx:188 [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:87 🟣 CONDITION [07:57:05] Checking conditions in state: collecting null
fsmLogger.js:87 🟠 ACTION [07:57:05] Execute: exploreDrone (priority: 2) null
fsmLogger.js:87 🟠 ACTION [07:57:05] Attempting to find a tile to explore null
fsmLogger.js:87 🔵 INFO [07:57:05] Using exploring radius: 3 null
fsmLogger.js:87 🔵 INFO [07:57:05] Found 22 walkable unexplored tiles in radius null
fsmLogger.js:87 🟠 ACTION [07:57:05] Sending drone to explore tile: D3, distance: 1.00 null
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: D3
fsmLogger.js:87 🟣 CONDITION [07:57:05] Exploration count reached threshold and resources found, returning to IDLE null
fsmLogger.js:87 🟢 STATE [07:57:05] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:05.734Z'}
fsmLogger.js:87 🟢 STATE [07:57:05] Exiting COLLECTING state - Returning to IDLE for evaluation null
fsmLogger.js:87 🟢 STATE [07:57:05] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:05.734Z'}
fsmLogger.js:87 🟢 STATE [07:57:05] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:05] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:05] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟢 STATE [07:57:05] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:05] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:05] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:05] Completed action: evaluateIdle {priority: 3, elapsed: 0}
fsmLogger.js:87 🟠 ACTION [07:57:06] Execute: evaluateIdle (priority: 3) null
fsmLogger.js:87 🟠 ACTION [07:57:06] Evaluating conditions from IDLE state null
fsmLogger.js:87 🟣 CONDITION [07:57:06] 2 resources available, changing to COLLECTING state null
fsmLogger.js:87 🟢 STATE [07:57:06] Transition: idle → collecting {targetState: null, timestamp: '2025-05-08T05:57:06.741Z'}
fsmLogger.js:87 🟢 STATE [07:57:06] Exiting IDLE state, transitioning to collecting null
fsmLogger.js:87 🔵 INFO [07:57:06] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0} null
fsmLogger.js:87 🟢 STATE [07:57:06] Entering COLLECTING state null
fsmLogger.js:87 🟠 ACTION [07:57:06] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:06] Adding action to queue: collect {priority: 2, params: {…}}
fsmLogger.js:87 🟠 ACTION [07:57:06] Completed action: evaluateIdle {priority: 3, elapsed: 1008}
UnifiedDroneMovement.jsx:242 [UnifiedDroneMovement] Bot drone discovered new resources at D3: {food: 22, debris: 983, special: 0}
UnifiedDroneMovement.jsx:312 [UnifiedDroneMovement] Bot exploration count increased to 8
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
fsmLogger.js:87 🟣 CONDITION [07:57:07] Checking conditions in state: collecting null
fsmLogger.js:87 🟠 ACTION [07:57:07] Execute: exploreDrone (priority: 2) null
fsmLogger.js:87 🟠 ACTION [07:57:07] Attempting to find a tile to explore null
fsmLogger.js:87 🔵 INFO [07:57:07] Using exploring radius: 3 null
fsmLogger.js:87 🔵 INFO [07:57:07] Found 21 walkable unexplored tiles in radius null
fsmLogger.js:87 🟠 ACTION [07:57:07] Sending drone to explore tile: E1, distance: 1.00 null
usePlayerStore.js:265 [PlayerStore] Moving player2/drone3 to tile: E1
fsmLogger.js:87 🟣 CONDITION [07:57:07] Exploration count reached threshold and resources found, returning to IDLE null
fsmLogger.js:87 🟢 STATE [07:57:07] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:07.750Z'}
fsmLogger.js:87 🟢 STATE [07:57:07] Exiting COLLECTING state - Returning to IDLE for evaluation null
fsmLogger.js:87 🟢 STATE [07:57:07] Transition: collecting → idle {targetState: null, timestamp: '2025-05-08T05:57:07.750Z'}
fsmLogger.js:87 🟢 STATE [07:57:07] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:07] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:07] Adding action to queue: evaluateIdle {priority: 3, params: {…}}
fsmLogger.js:87 🟢 STATE [07:57:07] Entering IDLE state - Evaluating conditions null
fsmLogger.js:87 🔵 INFO [07:57:07] Bot status: Fuel=100, At base=true null
fsmLogger.js:87 🟠 ACTION [07:57:07] Adding action to queue: evaluateIdle {priority: 3, params: {…}}