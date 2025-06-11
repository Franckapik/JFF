fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'lhey81'}
fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'ddh18y'}
fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'ntkm83'}
fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'ntkass'}
fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'x9f333'}
fsmLogger.js:137 🔧 CONTEXT [15:06:28] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'g72gxi'}
fsmLogger.js:144 🔴 ERROR [15:06:28] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:144 🔵 INFO [15:06:28] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:144 🔵 INFO [15:06:28] Système FSM: DÉMARRÉ
fsmLogger.js:144 🔴 ERROR [15:06:28] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:144 🔵 INFO [15:06:28] [Scene] Initializing tiles...
fsmLogger.js:137 🔵 INFO [15:06:29] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'hhpx2i'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: '57rsk0'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'ieyoi2'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'gxwmnu'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: 'gcq2au'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏭 [FACTORY] Creating new exploringState instance {instanceId: '43p3i8'}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🔍 [DEBUG] useFSMDroneTracker instantiated {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', hasContext: true, hasSend: true}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:137 🔧 CONTEXT [15:06:29] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'A-2', worldPosition: {…}, eventType: 'UPDATE_POSITION'}
useBotMachine.js:137 🚀 [bot-0] Manual start - sending AUTO event
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] Sending DRONE_REACHED_TARGET event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', eventKey: 'drone_deploying_reached_bot-0_explorer', tileCoord: 'A-2'}
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:32] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: 'A-2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:32] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: 'A-2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:32] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: 'A-2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:32] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: 'A-2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:32] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_prospecting', isInDeployingState: false, isDroneActive: true, shouldTransition: false}
fsmLogger.js:137 🔧 CONTEXT [15:06:35] 🔍 [DEBUG] Sending PROSPECTING_COMPLETE event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', prospectingEventKey: 'drone_prospecting_complete_bot-0_explorer', capturedTileCoord: 'A-2'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:35] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: 'A-2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:35] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: 'A-2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:35] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: 'A-2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:35] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: 'A-2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: false {botId: undefined, currentState: 'exploring_returning', isInProspectingState: false, guardConditions: {…}}
fsmLogger.js:137 🔧 CONTEXT [15:06:35] 🔍 [DEBUG] Sending DRONE_RETURNED event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', eventKey: 'drone_returning_reached_bot-0_explorer'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:35] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:35] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
useBotMachine.js:126 🔄 [bot-0] Drone docked, resetting exploration flag for next cycle
useBotMachine.js:137 🚀 [bot-0] Manual start - sending AUTO event
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] Sending DRONE_REACHED_TARGET event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', eventKey: 'drone_deploying_reached_bot-0_explorer', tileCoord: '-1,2'}
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:40] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-1,2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:40] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-1,2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:40] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-1,2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_deploying', isInDeployingState: true, isDroneActive: true, shouldTransition: true}
fsmLogger.js:137 🔵 INFO [15:06:40] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-1,2', botId: undefined}
fsmLogger.js:137 🔧 CONTEXT [15:06:40] 🔍 [DEBUG] DRONE_REACHED_TARGET guard check {botId: undefined, currentState: 'exploring_prospecting', isInDeployingState: false, isDroneActive: true, shouldTransition: false}
fsmLogger.js:137 🔧 CONTEXT [15:06:43] 🔍 [DEBUG] Sending PROSPECTING_COMPLETE event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', prospectingEventKey: 'drone_prospecting_complete_bot-0_explorer', capturedTileCoord: '-1,2'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:43] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-1,2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:43] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-1,2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:43] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-1,2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: true {botId: undefined, currentState: 'exploring_prospecting', isInProspectingState: true, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [15:06:43] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-1,2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔍 [Exploring] PROSPECTING_COMPLETE guard result: false {botId: undefined, currentState: 'exploring_returning', isInProspectingState: false, guardConditions: {…}}
fsmLogger.js:137 🔧 CONTEXT [15:06:43] 🔍 [DEBUG] Sending DRONE_RETURNED event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer-m5o7ddqff', eventKey: 'drone_returning_reached_bot-0_explorer'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] DRONE_RETURNED guard check {botId: undefined, currentState: 'exploring_returning', isInReturningState: true, droneState: 'returning', isActive: true, …}
fsmLogger.js:137 🔵 INFO [15:06:43] 🏠 [Exploring] Drone returned to ship, mission completed {botId: undefined, droneType: 'explorer'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🔧 [Exploring] Drone docking completed {botId: undefined, droneState: 'docked', isActive: false, lastAction: 'dockDrone_success'}
fsmLogger.js:137 🔵 INFO [15:06:43] 🎯 [Exploring] Transition to EVALUATING prepared {botId: undefined, currentAction: 'evaluating', lastDecision: 'drone_returned_successfully'}
useBotMachine.js:126 🔄 [bot-0] Drone docked, resetting exploration flag for next cycle
useBotMachine.js:137 🚀 [bot-0] Manual start - sending AUTO event
