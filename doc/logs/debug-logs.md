Scene.jsx:27 [Scene] Initializing tiles...
Scene.jsx:34 [Scene] Initializing players with tiles: {A3: {…}, A4: {…}, A5: {…}, A6: {…}, B2: {…}, …}
Scene.jsx:40 [Scene] Initializing bot...
fsmLogger.js:100 🔵 INFO [14:41:42] Initializing bot FSM
fsmLogger.js:100 🟢 STATE [14:41:42] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:42] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:41:42] Adding action to queue: evaluateIdle {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:42] Bot initialized in IDLE state with testQueue action
fsmLogger.js:93 🚀 MOUVEMENT [14:41:42] [ShipMovement] Setting initial position for player1: {x: 0.9, y: 0, z: -1.5588457268119895}
fsmLogger.js:93 🚀 MOUVEMENT [14:41:42] [ShipMovement] Setting initial position for player2: {x: 2.7, y: 0, z: 1.5588457268119895}
App.jsx:25 [App] Starting bot processing with setInterval
fsmLogger.js:100 🟠 ACTION [14:41:43] Execute: Start: evaluateIdle (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:43] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:41:43] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:41:43] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:43] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:41:43] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:41:43] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:41:43] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:41:44] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:41:44] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:44] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:41:44] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:41:44] Found 22 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:41:44] Sending drone to explore tile: E4, distance: 0.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: E4
fsmLogger.js:100 🟠 ACTION [14:41:44] Exploration started at 14:41:44
fsmLogger.js:100 🚀 MOUVEMENT [14:41:44] [UnifiedDroneMovement] Bot exploration count increased to 2
fsmLogger.js:100 🚀 MOUVEMENT [14:41:44] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:41:45] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:45] Drone has returned to ship, exploration sequence fully complete after 1.0s
fsmLogger.js:100 🟢 STATE [14:41:45] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:45] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:41:45] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:45] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:45] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:41:45] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:45] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:41:46] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:41:46] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:46] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:41:46] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:41:46] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:46] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:41:46] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:41:46] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:41:46] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:41:47] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:41:47] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:47] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:41:47] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:41:47] Found 21 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:41:47] Sending drone to explore tile: D4, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: D4
fsmLogger.js:100 🟠 ACTION [14:41:47] Exploration started at 14:41:47
fsmLogger.js:93 🚀 MOUVEMENT [14:41:48] [UnifiedDroneMovement] Bot drone discovered new resources at D4: {food: 44, debris: 592, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:41:48] [UnifiedDroneMovement] Bot exploration count increased to 4
fsmLogger.js:100 🟠 ACTION [14:41:48] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:41:48] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:41:49] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:49] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [14:41:49] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:49] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:41:49] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:49] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:49] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:41:49] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:49] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:41:50] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:41:50] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:50] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:41:50] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:41:50] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:50] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:41:50] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:41:50] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:41:50] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:41:51] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:41:51] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:51] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:41:51] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:41:51] Found 20 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:41:51] Sending drone to explore tile: D5, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: D5
fsmLogger.js:100 🟠 ACTION [14:41:51] Exploration started at 14:41:51
fsmLogger.js:93 🚀 MOUVEMENT [14:41:52] [UnifiedDroneMovement] Bot drone discovered new resources at D5: {food: 49, debris: 2129, special: 2}
fsmLogger.js:100 🚀 MOUVEMENT [14:41:52] [UnifiedDroneMovement] Bot exploration count increased to 6
fsmLogger.js:100 🟠 ACTION [14:41:52] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🚀 MOUVEMENT [14:41:53] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟠 ACTION [14:41:53] Execute: Continue: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:53] Drone has returned to ship, exploration sequence fully complete after 2.0s
fsmLogger.js:100 🟢 STATE [14:41:53] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:53] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:41:53] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:53] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:53] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:41:53] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:53] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:41:54] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:41:54] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:54] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:41:54] Transition from IDLE to exploring (discovery)
fsmLogger.js:93 🟠 ACTION [14:41:54] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:54] Transition: idle → exploring
fsmLogger.js:100 🟢 STATE [14:41:54] Exiting IDLE state, transitioning to exploring
fsmLogger.js:100 🔵 INFO [14:41:54] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:41:54] Entering EXPLORING state
fsmLogger.js:93 🟠 ACTION [14:41:55] Adding action to queue: exploreDrone {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:41:55] Execute: Start: exploreDrone (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:55] Attempting to find a tile to explore
fsmLogger.js:100 🔵 INFO [14:41:55] Using exploring radius: 3
fsmLogger.js:100 🔵 INFO [14:41:55] Found 19 walkable unexplored tiles in radius
fsmLogger.js:100 🟠 ACTION [14:41:55] Sending drone to explore tile: E3, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/drone3 to tile: E3
fsmLogger.js:100 🟠 ACTION [14:41:55] Exploration started at 14:41:55
fsmLogger.js:93 🚀 MOUVEMENT [14:41:55] [UnifiedDroneMovement] Bot drone discovered new resources at E3: {food: 43, debris: 1949, special: 1}
fsmLogger.js:100 🚀 MOUVEMENT [14:41:55] [UnifiedDroneMovement] Bot exploration count increased to 8
fsmLogger.js:100 🚀 MOUVEMENT [14:41:56] [UnifiedDroneMovement] Drone for player2 returned to ship
fsmLogger.js:100 🟣 CONDITION [14:41:56] Exit condition met in state exploring: transitioning to idle (resources_discovered)
fsmLogger.js:100 🟢 STATE [14:41:56] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:56] Exiting EXPLORING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:41:56] Transition: exploring → idle
fsmLogger.js:100 🟢 STATE [14:41:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:56] Bot status: Fuel=100, At base=true
fsmLogger.js:100 🟢 STATE [14:41:56] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:41:56] Bot status: Fuel=100, At base=true
fsmLogger.js:93 🟠 ACTION [14:41:57] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:41:57] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:57] Evaluating conditions from IDLE state
fsmLogger.js:100 🟣 CONDITION [14:41:57] Transition from IDLE to collecting (efficiency)
fsmLogger.js:93 🟠 ACTION [14:41:57] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟢 STATE [14:41:57] Transition: idle → collecting
fsmLogger.js:100 🟢 STATE [14:41:57] Exiting IDLE state, transitioning to collecting
fsmLogger.js:100 🔵 INFO [14:41:57] Transition details: Fuel=100, Resources={"food":0,"debris":0,"special":0}
fsmLogger.js:100 🟢 STATE [14:41:57] Entering COLLECTING state
fsmLogger.js:100 🟠 ACTION [14:41:58] Using dynamic default action for state collecting: moveToResource (priority: 2)
fsmLogger.js:93 🟠 ACTION [14:41:58] Adding action to queue: moveToResource {priority: 2}
fsmLogger.js:100 🟠 ACTION [14:41:58] Execute: Start: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:58] Moving to resource at E3, value: 3951, distance: 1.00
usePlayerStore.js:273 [PlayerStore] Moving player2/ship to tile: E3
fsmLogger.js:93 🚀 MOUVEMENT [14:41:58] [ShipMovement] player2 target changed, recalculating path to: E3
fsmLogger.js:100 🚀 MOUVEMENT [14:41:58] [ShipMovement] Calculating path for player2 from E4 to E3
fsmLogger.js:100 🚀 MOUVEMENT [14:41:58] [ShipMovement] Setting isMoving=true for player2/ship
fsmLogger.js:100 🚀 MOUVEMENT [14:41:59] [ShipMovement] player2/ship Arrived at destination
fsmLogger.js:100 🚀 MOUVEMENT [14:41:59] [ShipMovement] Finalizing movement for player2/ship to E3
fsmLogger.js:100 🟠 ACTION [14:41:59] Execute: Continue: moveToResource (priority: 2) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:41:59] Bot has reached resource at E3 after 1.0s
fsmLogger.js:93 🟠 ACTION [14:41:59] completed action: moveToResource {elapsed: 1001}
fsmLogger.js:100 🟠 ACTION [14:42:00] Bot is at resource location, adding collectResource action
fsmLogger.js:100 🟠 ACTION [14:42:00] Using dynamic default action for state collecting: collectResource (priority: 3)
fsmLogger.js:93 🟠 ACTION [14:42:00] Adding action to queue: collectResource {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:00] Execute: Start: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:42:00] Debug: collectResource called at position E3, state: false
fsmLogger.js:100 🟠 ACTION [14:42:00] Debug: Target resource coord: E3, Bot coord: E3
fsmLogger.js:100 🟠 ACTION [14:42:00] Starting resource collection at E3: {"food":43,"debris":1949,"special":1}
fsmLogger.js:100 🟠 ACTION [14:42:01] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:42:02] Execute: Continue: collectResource (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:42:02] Resources collected successfully: {"food":43,"debris":1949,"special":1}
fsmLogger.js:100 🟠 ACTION [14:42:02] Collection completed. Returning to IDLE for next action decision.
fsmLogger.js:100 🟢 STATE [14:42:02] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:42:02] Exiting COLLECTING state - Returning to IDLE for evaluation
fsmLogger.js:100 🟢 STATE [14:42:02] Transition: collecting → idle
fsmLogger.js:100 🟢 STATE [14:42:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:42:02] Bot status: Fuel=95, At base=false
fsmLogger.js:100 🟢 STATE [14:42:02] Entering IDLE state - Evaluating conditions
fsmLogger.js:100 🔵 INFO [14:42:02] Bot status: Fuel=95, At base=false
fsmLogger.js:93 🟠 ACTION [14:42:02] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:93 🟠 ACTION [14:42:02] completed action: evaluateIdle {elapsed: 0}
fsmLogger.js:93 🟠 ACTION [14:42:03] Adding action to queue: evaluateIdle {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:03] Execute: Start: evaluateIdle (priority: 3) (priority: undefined)
fsmLogger.js:100 🟠 ACTION [14:42:03] Evaluating conditions from IDLE state
botConditions.js:72 [BotCondition] Ressources au-dessus des limites: Food 43/100, Debris 1949/1000, Special 1/2
fsmLogger.js:100 🟣 CONDITION [14:42:03] Transition from IDLE to returning (safety_critical)
fsmLogger.js:100 🟢 STATE [14:42:03] Transition: idle → returning
fsmLogger.js:100 🟢 STATE [14:42:03] Exiting IDLE state, transitioning to returning
fsmLogger.js:100 🔵 INFO [14:42:03] Transition details: Fuel=95, Resources={"food":43,"debris":1949,"special":1}
fsmLogger.js:100 🟢 STATE [14:42:03] Entering RETURNING state
fsmLogger.js:93 🟠 ACTION [14:42:04] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:04] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:04] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:04] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:05] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:05] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:05] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:05] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:06] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:06] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:06] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:06] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:07] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:07] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:07] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:07] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:08] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:08] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:08] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:08] failed action: returnToBase {elapsed: 1}
fsmLogger.js:93 🟠 ACTION [14:42:09] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:09] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:09] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:09] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:10] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:10] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:10] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:10] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:11] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:11] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:11] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:11] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:12] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:12] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:12] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:12] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:13] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:13] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:13] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:13] failed action: returnToBase {elapsed: 2}
fsmLogger.js:93 🟠 ACTION [14:42:14] Adding action to queue: returnToBase {priority: 3}
fsmLogger.js:100 🟠 ACTION [14:42:14] Execute: Start: returnToBase (priority: 3) (priority: undefined)
fsmLogger.js:93 🔴 ERROR [14:42:14] Error in action returnToBase: TypeError: tileStore.getTileAtCoord is not a function
    at returnToBaseAction (returnToBaseAction.js:49:32)
    at Object.executeNextAction (useBotStore.js:216:24)
    at processBot (useBotStore.js:318:11)
    at App.jsx:29:9
fsmLogger.js:93 🟠 ACTION [14:42:14] failed action: returnToBase {elapsed: 2}
