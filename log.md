VM140933:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.js:282 🎮 GAME [15:02:22] Tiles initialized
fsmLogger.js:282 🎮 GAME [15:02:22] [XFSMStore] Creation bot-0 - Status: active, State: evaluating
fsmLogger.js:282 🎮 GAME [15:02:22] Bots initialized
fsmLogger.js:282 🎮 GAME [15:02:22] Players initialized
fsmLogger.js:282 🎮 GAME [15:02:22] [TileGeneration] Tuile de départ assignée à bot-0:4,0
fsmLogger.js:282 🎮 GAME [15:02:22] Starting tiles assigned
fsmLogger.js:275 🎮 GAME [15:02:22] Game fully initialized Object
fsmLogger.js:275 ⚡ EVENT [15:02:22] SHIP_POSITION_UPDATE Object
fsmLogger.js:275 ⚡ EVENT [15:02:22] DRONE_POSITION_UPDATE Object
fsmLogger.js:282 🎮 GAME [15:02:22] Fleet positions initialized for bot-0
fsmLogger.js:282 🎮 GAME [15:02:22] [Fleet] Initial positions set for bot-0
fsmLogger.js:275 🚀 MOUVEMENT [15:02:22] 🛸 [explorer] Transmitting initial drone position to FSM tracker: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:22] 🛸 [bot-0] Initial explorer position: (-0.37, 0.80, -4.00)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:22] 🏠 [Ship] Transmitting initial position to FSM tracker: Object
fsmLogger.js:275 🐛 DEBUG [15:02:22] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: Object
fsmLogger.js:275 🔧 CONTEXT [15:02:22] 🚢 [bot-0] Setting initial ship position Object
fsmLogger.js:282 🐛 DEBUG [15:02:22] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.js:282 🟢 STATE [15:02:22] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [15:02:22] [Evaluating] Conditions Object
fsmLogger.js:275 🔧 CONTEXT [15:02:22] [bot-0] Updating ship position Object
fsmLogger.js:282 🔧 CONTEXT [15:02:22] 🛸 [bot-0] explorer position: (-0.37, 0.80, -4.00)
fsmLogger.js:282 🎮 GAME [15:02:22] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating
fsmLogger.js:282 🔧 CONTEXT [15:02:22] 🛸 [bot-0] explorer position: (-0.37, 0.50, -4.00)
fsmLogger.js:282 🔵 INFO [15:02:23] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:275 🟣 CONDITION [15:02:23] [shouldExplore] Object
fsmLogger.js:282 🟢 STATE [15:02:23] action_evaluating_exit
fsmLogger.js:275 🔵 INFO [15:02:23] 🔄 [bot-0] updateContext called with: Object
fsmLogger.js:282 🔵 INFO [15:02:23] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:282 🔵 INFO [15:02:23] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:72 Object
fsmLogger.js:282 🐛 DEBUG [15:02:23] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
fsmLogger.js:282 🐛 DEBUG [15:02:23] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.js:275 🔵 INFO [15:02:23] ✅ [bot-0] Drone deployment result: Object
fsmLogger.js:282 🟢 STATE [15:02:23] 🚀 [bot-0] Entering exploring state
fsmLogger.js:282 🟢 STATE [15:02:23] 🛸 [bot-0] Drone deploying - moving to target
fsmLogger.js:275 🔵 INFO [15:02:23] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer Object
fsmLogger.js:275 ⚡ EVENT [15:02:23] DRONE_POSITION_UPDATE Object
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.36, 0.59, -3.95)
fsmLogger.js:275 🔵 INFO [15:02:23] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) Object
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.35, 0.59, -3.79)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.33, 0.58, -3.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.32, 0.58, -3.46)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.30, 0.58, -3.33)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.29, 0.57, -3.20)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.28, 0.57, -3.05)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.27, 0.57, -2.92)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.26, 0.56, -2.80)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.25, 0.56, -2.69)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.24, 0.56, -2.57)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.23, 0.56, -2.47)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.22, 0.55, -2.37)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.21, 0.55, -2.27)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.19, 0.55, -2.08)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.18, 0.54, -1.92)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.16, 0.54, -1.75)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.15, 0.54, -1.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.14, 0.53, -1.48)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.12, 0.53, -1.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.11, 0.53, -1.25)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.11, 0.53, -1.15)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.09, 0.52, -1.01)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:23] 🎯 [bot-0] explorer reached target tile for scanning Object
fsmLogger.js:275 ⚡ EVENT [15:02:23] DRONE_REACHES_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:23] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:282 🟢 STATE [15:02:23] 🔍 [bot-0] Drone scanning - analyzing tile
fsmLogger.js:282 🚀 MOUVEMENT [15:02:23] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:275 💎 RESOURCES [15:02:23] 💎 [bot-0] explorer discovered resources: Object
fsmLogger.js:275 ⚡ EVENT [15:02:23] DRONE_SCANS_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:23] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:282 🟢 STATE [15:02:23] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:275 🔵 INFO [15:02:23] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.12, 0.39, -1.07)
fsmLogger.js:275 🔵 INFO [15:02:23] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.15, 1.10, -1.22)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.18, 1.10, -1.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.21, 1.10, -1.49)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.23, 1.10, -1.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.26, 1.10, -1.73)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.28, 1.09, -1.84)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.31, 1.09, -1.95)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.33, 1.09, -2.06)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.35, 1.09, -2.16)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.40, 1.09, -2.35)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.43, 1.08, -2.52)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.47, 1.08, -2.68)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.50, 1.07, -2.83)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.53, 1.07, -2.97)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.56, 1.06, -3.10)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.59, 1.05, -3.21)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.61, 1.04, -3.32)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.64, 1.03, -3.46)
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.67, 1.01, -3.59)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:23] 🏠 [bot-0] explorer reached base - docking complete Object
fsmLogger.js:275 ⚡ EVENT [15:02:23] DRONE_REACHES_BASE Object
fsmLogger.js:282 🟢 STATE [15:02:23] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:282 🟢 STATE [15:02:23] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:282 🟢 STATE [15:02:23] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [15:02:23] [Evaluating] Conditions Object
fsmLogger.js:282 🔧 CONTEXT [15:02:23] 🛸 [bot-0] explorer position: (-0.68, 0.50, -3.66)
fsmLogger.js:275 🔵 INFO [15:02:24] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer Object
fsmLogger.js:282 🔵 INFO [15:02:24] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:275 🟣 CONDITION [15:02:24] [shouldExplore] Object
fsmLogger.js:282 🟢 STATE [15:02:24] action_evaluating_exit
fsmLogger.js:275 🔵 INFO [15:02:24] 🔄 [bot-0] updateContext called with: Object
fsmLogger.js:282 🔵 INFO [15:02:24] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:282 🔵 INFO [15:02:24] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:72 Object
fsmLogger.js:282 🐛 DEBUG [15:02:24] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
fsmLogger.js:282 🐛 DEBUG [15:02:24] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.js:275 🔵 INFO [15:02:24] ✅ [bot-0] Drone deployment result: Object
fsmLogger.js:282 🟢 STATE [15:02:24] 🚀 [bot-0] Entering exploring state
fsmLogger.js:282 🟢 STATE [15:02:24] 🛸 [bot-0] Drone deploying - moving to target
fsmLogger.js:275 ⚡ EVENT [15:02:24] DRONE_POSITION_UPDATE Object
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.65, 0.41, -3.50)
fsmLogger.js:275 🔵 INFO [15:02:24] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) Object
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.63, 0.42, -3.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.60, 0.42, -3.23)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.58, 0.42, -3.09)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.55, 0.43, -2.95)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.53, 0.43, -2.83)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.51, 0.43, -2.72)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.49, 0.44, -2.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.47, 0.44, -2.50)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.44, 0.44, -2.38)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.41, 0.45, -2.20)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.38, 0.45, -2.01)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.35, 0.45, -1.85)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.32, 0.46, -1.70)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.29, 0.46, -1.56)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.27, 0.46, -1.43)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.25, 0.47, -1.32)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.23, 0.47, -1.21)
fsmLogger.js:282 🔧 CONTEXT [15:02:24] 🛸 [bot-0] explorer position: (-0.21, 0.47, -1.11)
fsmLogger.js:275 🔵 INFO [15:02:25] 📍 [bot-0] Drone explorer tracking update Object
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.18, 0.48, -0.98)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:25] 🎯 [bot-0] explorer reached target tile for scanning Object
fsmLogger.js:275 ⚡ EVENT [15:02:25] DRONE_REACHES_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:25] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:282 🟢 STATE [15:02:25] 🔍 [bot-0] Drone scanning - analyzing tile
fsmLogger.js:282 🚀 MOUVEMENT [15:02:25] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:275 💎 RESOURCES [15:02:25] 💎 [bot-0] explorer discovered resources: Object
fsmLogger.js:275 ⚡ EVENT [15:02:25] DRONE_SCANS_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:25] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:282 🟢 STATE [15:02:25] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:275 🔵 INFO [15:02:25] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.20, 0.67, -1.07)
fsmLogger.js:275 🔵 INFO [15:02:25] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.23, 0.91, -1.22)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.26, 0.91, -1.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.28, 0.90, -1.49)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.31, 0.90, -1.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.33, 0.90, -1.74)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.35, 0.90, -1.85)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.37, 0.90, -1.96)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.39, 0.90, -2.06)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.41, 0.91, -2.17)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.43, 0.91, -2.27)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.47, 0.91, -2.44)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.50, 0.91, -2.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.53, 0.92, -2.77)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.56, 0.92, -2.91)
fsmLogger.js:275 🔵 INFO [15:02:25] 🛸 [explorer] Drone diagnostic: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.58, 0.93, -3.04)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.60, 0.94, -3.15)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.63, 0.94, -3.27)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.66, 0.96, -3.42)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.68, 0.97, -3.55)
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.70, 0.98, -3.66)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:25] 🏠 [bot-0] explorer reached base - docking complete Object
fsmLogger.js:275 ⚡ EVENT [15:02:25] DRONE_REACHES_BASE Object
fsmLogger.js:282 🟢 STATE [15:02:25] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:282 🟢 STATE [15:02:25] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:282 🟢 STATE [15:02:25] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [15:02:25] [Evaluating] Conditions Object
fsmLogger.js:282 🔧 CONTEXT [15:02:25] 🛸 [bot-0] explorer position: (-0.70, 0.50, -3.66)
fsmLogger.js:275 ⚡ EVENT [15:02:26] DRONE_POSITION_UPDATE Object
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.70, 0.60, -3.66)
fsmLogger.js:275 🔵 INFO [15:02:26] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer Object
fsmLogger.js:282 🔵 INFO [15:02:26] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:275 🟣 CONDITION [15:02:26] [shouldExplore] Object
fsmLogger.js:282 🟢 STATE [15:02:26] action_evaluating_exit
fsmLogger.js:275 🔵 INFO [15:02:26] 🔄 [bot-0] updateContext called with: Object
fsmLogger.js:282 🔵 INFO [15:02:26] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:282 🔵 INFO [15:02:26] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:72 Object
fsmLogger.js:282 🐛 DEBUG [15:02:26] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
fsmLogger.js:282 🐛 DEBUG [15:02:26] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.js:275 🔵 INFO [15:02:26] ✅ [bot-0] Drone deployment result: Object
fsmLogger.js:282 🟢 STATE [15:02:26] 🚀 [bot-0] Entering exploring state
fsmLogger.js:282 🟢 STATE [15:02:26] 🛸 [bot-0] Drone deploying - moving to target
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.68, 0.59, -3.52)
fsmLogger.js:275 🔵 INFO [15:02:26] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) Object
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.65, 0.58, -3.38)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.62, 0.58, -3.25)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.60, 0.58, -3.10)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.57, 0.57, -2.96)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.55, 0.57, -2.85)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.53, 0.57, -2.74)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.50, 0.57, -2.62)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.48, 0.56, -2.51)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.46, 0.56, -2.41)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.44, 0.56, -2.30)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.41, 0.55, -2.12)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.37, 0.55, -1.94)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.34, 0.54, -1.78)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.31, 0.54, -1.64)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.29, 0.54, -1.51)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.27, 0.53, -1.38)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.24, 0.53, -1.27)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.22, 0.53, -1.17)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.20, 0.53, -1.03)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:26] 🎯 [bot-0] explorer reached target tile for scanning Object
fsmLogger.js:275 ⚡ EVENT [15:02:26] DRONE_REACHES_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:26] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:282 🟢 STATE [15:02:26] 🔍 [bot-0] Drone scanning - analyzing tile
fsmLogger.js:282 🚀 MOUVEMENT [15:02:26] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:275 💎 RESOURCES [15:02:26] 💎 [bot-0] explorer discovered resources: Object
fsmLogger.js:275 ⚡ EVENT [15:02:26] DRONE_SCANS_TILE Object
fsmLogger.js:282 🟢 STATE [15:02:26] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:282 🟢 STATE [15:02:26] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:275 🔵 INFO [15:02:26] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.21, 0.63, -1.09)
fsmLogger.js:275 🔵 INFO [15:02:26] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: Object
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.23, 1.09, -1.22)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.26, 1.09, -1.37)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.29, 1.09, -1.50)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.31, 1.09, -1.63)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.33, 1.10, -1.73)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.36, 1.10, -1.86)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.38, 1.10, -1.97)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.42, 1.09, -2.17)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.45, 1.09, -2.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.49, 1.09, -2.53)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.52, 1.09, -2.69)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.55, 1.08, -2.84)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.57, 1.08, -2.98)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.60, 1.07, -3.10)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.62, 1.07, -3.22)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.64, 1.06, -3.32)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.67, 1.05, -3.46)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.69, 1.03, -3.59)
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.71, 1.02, -3.70)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:26] 🏠 [bot-0] explorer reached base - docking complete Object
fsmLogger.js:275 ⚡ EVENT [15:02:26] DRONE_REACHES_BASE Object
fsmLogger.js:282 🟢 STATE [15:02:26] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:282 🟢 STATE [15:02:26] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:282 🟢 STATE [15:02:26] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [15:02:26] [Evaluating] Conditions Object
fsmLogger.js:282 🔧 CONTEXT [15:02:26] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.70)
fsmLogger.js:275 🎮 GAME [15:02:26] Game fully initialized Object
fsmLogger.js:275 🔵 INFO [15:02:27] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
fsmLogger.js:275 ⚡ EVENT [15:02:27] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.71, 0.40, -3.70)
fsmLogger.js:282 🔵 INFO [15:02:27] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:275 🟣 CONDITION [15:02:27] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:282 🟢 STATE [15:02:27] action_evaluating_exit
fsmLogger.js:275 🔵 INFO [15:02:27] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
fsmLogger.js:282 🔵 INFO [15:02:27] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:282 🔵 INFO [15:02:27] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:72 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
fsmLogger.js:282 🐛 DEBUG [15:02:27] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
fsmLogger.js:282 🐛 DEBUG [15:02:27] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.js:275 🔵 INFO [15:02:27] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:282 🟢 STATE [15:02:27] 🚀 [bot-0] Entering exploring state
fsmLogger.js:282 🟢 STATE [15:02:27] 🛸 [bot-0] Drone deploying - moving to target
fsmLogger.js:275 🔵 INFO [15:02:27] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.66, 0.41, -3.45)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.64, 0.42, -3.32)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.61, 0.42, -3.17)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.59, 0.42, -3.04)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.56, 0.43, -2.91)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.54, 0.43, -2.80)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.51, 0.43, -2.67)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.49, 0.44, -2.57)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.47, 0.44, -2.46)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.45, 0.44, -2.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:27] 🛸 [bot-0] explorer position: (-0.43, 0.44, -2.26)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.40, 0.45, -2.07)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.37, 0.45, -1.90)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.34, 0.46, -1.75)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.31, 0.46, -1.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.28, 0.46, -1.47)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.26, 0.47, -1.36)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.24, 0.47, -1.24)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.22, 0.47, -1.14)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.19, 0.48, -1.00)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:28] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9797292365868034, threshold: 1}
fsmLogger.js:275 ⚡ EVENT [15:02:28] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:282 🟢 STATE [15:02:28] ✅ [bot-0] Drone deployment complete - reached target
fsmLogger.js:282 🟢 STATE [15:02:28] 🔍 [bot-0] Drone scanning - analyzing tile
fsmLogger.js:282 🚀 MOUVEMENT [15:02:28] 🔍 [bot-0] explorer completed tile scanning
fsmLogger.js:275 💎 RESOURCES [15:02:28] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
fsmLogger.js:275 ⚡ EVENT [15:02:28] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:282 🟢 STATE [15:02:28] 📊 [bot-0] Drone scan complete - data collected
fsmLogger.js:282 🟢 STATE [15:02:28] 🏠 [bot-0] Drone returning - heading to base
fsmLogger.js:275 🔵 INFO [15:02:28] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.21, 0.37, -1.07)
fsmLogger.js:275 🔵 INFO [15:02:28] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.23, 0.91, -1.22)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.26, 0.91, -1.35)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.29, 0.91, -1.48)
fsmLogger.js:275 🔵 INFO [15:02:28] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_returning', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.31, 0.90, -1.61)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.33, 0.90, -1.73)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.35, 0.90, -1.84)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.38, 0.90, -1.96)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.40, 0.90, -2.06)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.42, 0.91, -2.16)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.45, 0.91, -2.35)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.49, 0.91, -2.53)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.52, 0.91, -2.69)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.55, 0.92, -2.84)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.57, 0.92, -2.97)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.60, 0.93, -3.10)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.62, 0.94, -3.21)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.64, 0.94, -3.31)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.66, 0.95, -3.41)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.68, 0.97, -3.54)
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.70, 0.98, -3.66)
fsmLogger.js:275 🚀 MOUVEMENT [15:02:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9819921920487874, threshold: 1}
fsmLogger.js:275 ⚡ EVENT [15:02:28] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.js:282 🟢 STATE [15:02:28] 🔌 [bot-0] Drone return complete - docked to ship
fsmLogger.js:282 🟢 STATE [15:02:28] 🏁 [bot-0] Exiting exploring state
fsmLogger.js:282 🟢 STATE [15:02:28] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [15:02:28] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.js:282 🔧 CONTEXT [15:02:28] 🛸 [bot-0] explorer position: (-0.70, 0.50, -3.66)
 ⚡ EVENT [15:02:29] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.70, 0.60, -3.66)
 🔵 INFO [15:02:29] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 🔵 INFO [15:02:29] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:29] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:29] action_evaluating_exit
 🔵 INFO [15:02:29] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:29] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:29] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:29] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:29] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:29] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:29] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:29] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:29] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.67, 0.59, -3.46)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.64, 0.58, -3.31)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.61, 0.58, -3.17)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.58, 0.58, -3.03)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.56, 0.57, -2.91)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.54, 0.57, -2.79)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.52, 0.57, -2.68)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.49, 0.56, -2.56)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.47, 0.56, -2.46)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.45, 0.56, -2.36)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.43, 0.56, -2.26)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.40, 0.55, -2.08)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.37, 0.55, -1.91)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.34, 0.54, -1.74)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.31, 0.54, -1.61)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.28, 0.54, -1.47)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.26, 0.53, -1.35)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.24, 0.53, -1.24)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.22, 0.53, -1.14)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.19, 0.53, -1.00)
 🚀 MOUVEMENT [15:02:29] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9788482825256732, threshold: 1}
 ⚡ EVENT [15:02:29] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:29] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:29] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:29] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:29] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:29] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:29] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:29] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:29] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.21, 0.41, -1.07)
 🔵 INFO [15:02:29] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.23, 1.09, -1.21)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.26, 1.09, -1.35)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.29, 1.09, -1.49)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.31, 1.10, -1.61)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.33, 1.10, -1.72)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.36, 1.10, -1.85)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.38, 1.10, -1.95)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.40, 1.10, -2.05)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.42, 1.10, -2.16)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.43, 1.09, -2.26)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.45, 1.09, -2.36)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.49, 1.09, -2.53)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.53, 1.09, -2.73)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.55, 1.08, -2.84)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.57, 1.08, -2.97)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.60, 1.07, -3.10)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.62, 1.07, -3.21)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.64, 1.06, -3.32)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.67, 1.05, -3.46)
 🔧 CONTEXT [15:02:29] 🛸 [bot-0] explorer position: (-0.69, 1.03, -3.59)
 🔵 INFO [15:02:30] 📍 [bot-0] Drone explorer tracking update {state: 'drone_returning', distance: '1.041', position: {…}, targetPosition: {…}}
 🔧 CONTEXT [15:02:30] 🛸 [bot-0] explorer position: (-0.71, 1.02, -3.70)
 🚀 MOUVEMENT [15:02:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9686995675393634, threshold: 1}
 ⚡ EVENT [15:02:30] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:30] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:30] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:30] action_evaluating_entry
 🔵 INFO [15:02:30] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔧 CONTEXT [15:02:30] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.70)
 🔵 INFO [15:02:30] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 ⚡ EVENT [15:02:30] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:30] 🛸 [bot-0] explorer position: (-0.71, 0.40, -3.70)
 🔵 INFO [15:02:31] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:31] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:31] action_evaluating_exit
 🔵 INFO [15:02:31] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:31] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:31] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:31] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:31] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:31] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:31] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:31] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:31] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.67, 0.41, -3.49)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.64, 0.42, -3.34)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.62, 0.42, -3.21)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.59, 0.42, -3.07)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.57, 0.43, -2.95)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.54, 0.43, -2.83)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.52, 0.43, -2.70)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.50, 0.44, -2.59)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.48, 0.44, -2.48)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.46, 0.44, -2.38)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.42, 0.45, -2.19)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.40, 0.45, -2.09)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.37, 0.45, -1.92)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.33, 0.46, -1.72)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.31, 0.46, -1.62)
 🔵 INFO [15:02:31] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_deploying', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.29, 0.46, -1.49)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.26, 0.47, -1.37)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.24, 0.47, -1.26)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.22, 0.47, -1.15)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.20, 0.47, -1.01)
 🚀 MOUVEMENT [15:02:31] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9933154119981882, threshold: 1}
 ⚡ EVENT [15:02:31] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:31] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:31] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:31] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:31] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:31] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:31] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:31] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:31] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.21, 0.68, -1.10)
 🔵 INFO [15:02:31] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.24, 0.91, -1.22)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.26, 0.91, -1.37)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.29, 0.90, -1.49)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.31, 0.90, -1.62)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.34, 0.90, -1.74)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.36, 0.90, -1.86)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.38, 0.90, -1.97)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.40, 0.90, -2.07)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.42, 0.91, -2.18)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.45, 0.91, -2.36)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.49, 0.91, -2.54)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.52, 0.91, -2.70)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.55, 0.92, -2.84)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.57, 0.92, -2.98)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.60, 0.93, -3.10)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.62, 0.94, -3.22)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.64, 0.94, -3.32)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.67, 0.96, -3.47)
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.69, 0.97, -3.59)
 🚀 MOUVEMENT [15:02:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9771311927465196, threshold: 1}
 ⚡ EVENT [15:02:31] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:31] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:31] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:31] action_evaluating_entry
 🔵 INFO [15:02:31] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔧 CONTEXT [15:02:31] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.66)
 🔵 INFO [15:02:32] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 ⚡ EVENT [15:02:32] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.71, 0.60, -3.66)
 🔵 INFO [15:02:32] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:32] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:32] action_evaluating_exit
 🔵 INFO [15:02:32] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:32] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:32] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:32] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:32] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:32] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:32] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:32] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:32] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.67, 0.59, -3.49)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.64, 0.58, -3.34)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.61, 0.58, -3.20)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.59, 0.58, -3.06)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.57, 0.57, -2.94)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.54, 0.57, -2.82)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.52, 0.57, -2.70)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.50, 0.56, -2.58)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.48, 0.56, -2.47)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.44, 0.56, -2.27)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.40, 0.55, -2.09)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.37, 0.55, -1.92)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.34, 0.54, -1.76)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.31, 0.54, -1.62)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.29, 0.54, -1.49)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.26, 0.53, -1.36)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.24, 0.53, -1.25)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.21, 0.53, -1.10)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.19, 0.52, -0.97)
 🚀 MOUVEMENT [15:02:32] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9868145939464413, threshold: 1}
 ⚡ EVENT [15:02:32] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:32] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:32] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:32] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:32] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:32] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:32] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:32] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:32] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.21, 0.63, -1.07)
 🔵 INFO [15:02:32] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.24, 1.09, -1.22)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.26, 1.09, -1.35)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.29, 1.09, -1.48)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.31, 1.10, -1.60)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.33, 1.10, -1.73)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.35, 1.10, -1.84)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.38, 1.10, -1.95)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.40, 1.10, -2.07)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.42, 1.10, -2.16)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.44, 1.09, -2.27)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.47, 1.09, -2.44)
 🔧 CONTEXT [15:02:32] 🛸 [bot-0] explorer position: (-0.50, 1.09, -2.61)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.53, 1.09, -2.77)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.56, 1.08, -2.91)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.58, 1.07, -3.04)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.61, 1.07, -3.15)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.63, 1.06, -3.26)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.65, 1.05, -3.37)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.67, 1.04, -3.50)
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.70, 1.03, -3.62)
 🚀 MOUVEMENT [15:02:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9710874139466984, threshold: 1}
 ⚡ EVENT [15:02:33] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:33] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:33] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:33] action_evaluating_entry
 🔵 INFO [15:02:33] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.69)
 🔵 INFO [15:02:33] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 ⚡ EVENT [15:02:33] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:33] 🛸 [bot-0] explorer position: (-0.71, 0.40, -3.69)
 🔵 INFO [15:02:34] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:34] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:34] action_evaluating_exit
 🔵 INFO [15:02:34] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:34] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:34] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:34] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:34] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:34] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:34] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:34] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:34] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.67, 0.41, -3.48)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.64, 0.42, -3.33)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.61, 0.42, -3.19)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.59, 0.42, -3.06)
 🔵 INFO [15:02:34] 🛸 [explorer] Drone diagnostic: {droneState: 'drone_deploying', isActive: true, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.56, 0.43, -2.93)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.54, 0.43, -2.81)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.52, 0.43, -2.70)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.50, 0.44, -2.58)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.47, 0.44, -2.47)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.46, 0.44, -2.37)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.42, 0.45, -2.18)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.38, 0.45, -2.00)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.35, 0.45, -1.84)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.32, 0.46, -1.68)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.30, 0.46, -1.55)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.27, 0.46, -1.42)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.25, 0.47, -1.30)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.23, 0.47, -1.20)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.21, 0.47, -1.10)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.19, 0.48, -0.97)
 🚀 MOUVEMENT [15:02:34] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.98700908798536, threshold: 1}
 ⚡ EVENT [15:02:34] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:34] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:34] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:34] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:34] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:34] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:34] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:34] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:34] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.21, 0.37, -1.07)
 🔵 INFO [15:02:34] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.23, 0.91, -1.21)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.26, 0.91, -1.35)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.29, 0.91, -1.48)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.31, 0.90, -1.61)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.33, 0.90, -1.73)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.35, 0.90, -1.84)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.38, 0.90, -1.96)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.40, 0.90, -2.06)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.44, 0.91, -2.26)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.47, 0.91, -2.44)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.50, 0.91, -2.61)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.53, 0.92, -2.76)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.56, 0.92, -2.91)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.58, 0.93, -3.03)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.61, 0.93, -3.15)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.63, 0.94, -3.26)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.65, 0.95, -3.37)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.67, 0.96, -3.50)
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.70, 0.97, -3.62)
 🚀 MOUVEMENT [15:02:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9832601725869935, threshold: 1}
 ⚡ EVENT [15:02:34] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:34] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:34] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:34] action_evaluating_entry
 🔵 INFO [15:02:34] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔧 CONTEXT [15:02:34] 🛸 [bot-0] explorer position: (-0.70, 0.50, -3.66)
 🔵 INFO [15:02:35] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 ⚡ EVENT [15:02:35] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.70, 0.60, -3.66)
 🔵 INFO [15:02:35] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:35] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:35] action_evaluating_exit
 🔵 INFO [15:02:35] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:35] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:35] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:35] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:35] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:35] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:35] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:35] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:35] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.67, 0.59, -3.46)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.64, 0.58, -3.32)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.61, 0.58, -3.19)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.59, 0.58, -3.05)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.56, 0.57, -2.92)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.54, 0.57, -2.80)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.52, 0.57, -2.69)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.50, 0.56, -2.58)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.47, 0.56, -2.46)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.45, 0.56, -2.36)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.43, 0.56, -2.25)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.40, 0.55, -2.07)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.37, 0.55, -1.91)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.34, 0.54, -1.75)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.31, 0.54, -1.60)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.28, 0.54, -1.48)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.26, 0.53, -1.36)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.24, 0.53, -1.24)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.22, 0.53, -1.15)
 🔧 CONTEXT [15:02:35] 🛸 [bot-0] explorer position: (-0.19, 0.53, -1.01)
 🚀 MOUVEMENT [15:02:36] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9813468389953919, threshold: 1}
 ⚡ EVENT [15:02:36] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:36] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:36] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:36] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:36] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:36] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:36] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:36] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:36] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.20, 0.41, -1.06)
 🔵 INFO [15:02:36] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.23, 1.09, -1.20)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.26, 1.09, -1.34)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.28, 1.09, -1.47)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.31, 1.09, -1.60)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.33, 1.10, -1.73)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.35, 1.10, -1.84)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.37, 1.10, -1.95)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.40, 1.10, -2.06)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.43, 1.09, -2.26)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.47, 1.09, -2.44)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.50, 1.09, -2.60)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.53, 1.09, -2.76)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.56, 1.08, -2.90)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.58, 1.08, -3.03)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.61, 1.07, -3.15)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.63, 1.06, -3.26)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.65, 1.05, -3.37)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.67, 1.04, -3.50)
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.70, 1.03, -3.62)
 🚀 MOUVEMENT [15:02:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9720672470267254, threshold: 1}
 ⚡ EVENT [15:02:36] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:36] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:36] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:36] action_evaluating_entry
 🔵 INFO [15:02:36] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔵 INFO [15:02:36] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.69)
 ⚡ EVENT [15:02:36] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:36] 🛸 [bot-0] explorer position: (-0.71, 0.40, -3.69)
 🔵 INFO [15:02:37] 🛸 [explorer] Drone diagnostic: {droneState: 'docked', isActive: false, hasTargetPosition: true, targetPosition: {…}, currentPosition: _Vector3, …}
 🔵 INFO [15:02:37] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:37] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:37] action_evaluating_exit
 🔵 INFO [15:02:37] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:37] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:37] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:37] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:37] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:37] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:37] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:37] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:37] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.67, 0.41, -3.50)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.65, 0.42, -3.36)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.62, 0.42, -3.22)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.59, 0.42, -3.07)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.57, 0.43, -2.95)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.55, 0.43, -2.84)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.52, 0.43, -2.72)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.50, 0.44, -2.60)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.48, 0.44, -2.49)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.46, 0.44, -2.38)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.44, 0.44, -2.28)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.41, 0.45, -2.11)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.37, 0.45, -1.93)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.34, 0.46, -1.77)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.31, 0.46, -1.63)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.29, 0.46, -1.49)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.26, 0.47, -1.37)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.24, 0.47, -1.26)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.22, 0.47, -1.16)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.20, 0.47, -1.02)
 🚀 MOUVEMENT [15:02:37] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9949072676295989, threshold: 1}
 ⚡ EVENT [15:02:37] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:37] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:37] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:37] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:37] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:37] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:37] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:37] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:37] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.21, 0.67, -1.07)
 🔵 INFO [15:02:37] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.24, 0.91, -1.23)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.26, 0.91, -1.37)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.29, 0.91, -1.49)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.31, 0.90, -1.61)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.33, 0.90, -1.73)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.36, 0.90, -1.85)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.38, 0.90, -1.96)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.40, 0.90, -2.07)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.42, 0.91, -2.17)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.44, 0.91, -2.27)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.47, 0.91, -2.45)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.50, 0.91, -2.62)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.53, 0.92, -2.76)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.56, 0.92, -2.91)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.59, 0.93, -3.04)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.61, 0.93, -3.16)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.63, 0.94, -3.27)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.66, 0.95, -3.42)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.68, 0.96, -3.55)
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.70, 0.98, -3.66)
 🚀 MOUVEMENT [15:02:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.9803327293346915, threshold: 1}
 ⚡ EVENT [15:02:37] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:37] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:37] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:37] action_evaluating_entry
 🔵 INFO [15:02:37] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔧 CONTEXT [15:02:37] 🛸 [bot-0] explorer position: (-0.70, 0.50, -3.66)
 🔵 INFO [15:02:38] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 ⚡ EVENT [15:02:38] DRONE_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.70, 0.60, -3.66)
 🔵 INFO [15:02:38] [Evaluating] → needExploring (need more exploration)
 🟣 CONDITION [15:02:38] [shouldExplore] {context: {…}, event: undefined}
 🟢 STATE [15:02:38] action_evaluating_exit
 🔵 INFO [15:02:38] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(18)}
 🔵 INFO [15:02:38] 🔄 [bot-0] Updating context for transition: needExploring
 🔵 INFO [15:02:38] 🚁 [bot-0] Deploying drone for exploration
 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
 🐛 DEBUG [15:02:38] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
 🐛 DEBUG [15:02:38] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
 🔵 INFO [15:02:38] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
 🟢 STATE [15:02:38] 🚀 [bot-0] Entering exploring state
 🟢 STATE [15:02:38] 🛸 [bot-0] Drone deploying - moving to target
 🔵 INFO [15:02:38] ⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0) {targetPosition: {…}, droneState: 'drone_deploying'}
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.66, 0.59, -3.43)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.63, 0.58, -3.29)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.61, 0.58, -3.15)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.58, 0.58, -3.02)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.56, 0.57, -2.89)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.53, 0.57, -2.77)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.51, 0.57, -2.65)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.49, 0.56, -2.54)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.47, 0.56, -2.44)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.43, 0.56, -2.24)
 🔧 CONTEXT [15:02:38] 🛸 [bot-0] explorer position: (-0.40, 0.55, -2.06)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.36, 0.55, -1.89)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.33, 0.54, -1.74)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.31, 0.54, -1.59)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.28, 0.54, -1.47)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.26, 0.53, -1.34)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.24, 0.53, -1.24)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.22, 0.53, -1.13)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.19, 0.53, -1.00)
 🚀 MOUVEMENT [15:02:39] 🎯 [bot-0] explorer reached target tile for scanning {position: {…}, distance: 0.9744803919115952, threshold: 1}
 ⚡ EVENT [15:02:39] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:39] ✅ [bot-0] Drone deployment complete - reached target
 🟢 STATE [15:02:39] 🔍 [bot-0] Drone scanning - analyzing tile
 🚀 MOUVEMENT [15:02:39] 🔍 [bot-0] explorer completed tile scanning
 💎 RESOURCES [15:02:39] 💎 [bot-0] explorer discovered resources: {food: 0, debris: 0, special: 0}
 ⚡ EVENT [15:02:39] DRONE_SCANS_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:39] 📊 [bot-0] Drone scan complete - data collected
 🟢 STATE [15:02:39] 🏠 [bot-0] Drone returning - heading to base
 🔵 INFO [15:02:39] 🔍 [ANIMATION-RETURN-DEBUG] Using absolute ship position from FSM context: {shipContextPosition: {…}, shipAnimationPosition: {…}, willReturnTo: 'FSM context position'}
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.20, 0.63, -1.06)
 🔵 INFO [15:02:39] 🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position: {shipPosition: {…}, dronePosition: {…}, calculatingDistanceFor: 'drone_returning', note: 'Both animation and tracker should use this same position reference'}
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.23, 1.09, -1.21)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.26, 1.09, -1.35)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.28, 1.09, -1.47)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.31, 1.10, -1.60)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.33, 1.10, -1.72)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.35, 1.10, -1.83)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.38, 1.10, -1.95)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.40, 1.10, -2.06)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.42, 1.10, -2.16)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.45, 1.09, -2.35)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.49, 1.09, -2.52)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.52, 1.09, -2.68)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.55, 1.08, -2.83)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.57, 1.08, -2.97)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.60, 1.07, -3.09)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.62, 1.07, -3.21)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.64, 1.06, -3.31)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.66, 1.05, -3.45)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.69, 1.03, -3.58)
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.71, 1.02, -3.69)
 🚀 MOUVEMENT [15:02:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.975359452118102, threshold: 1}
 ⚡ EVENT [15:02:39] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
 🟢 STATE [15:02:39] 🔌 [bot-0] Drone return complete - docked to ship
 🟢 STATE [15:02:39] 🏁 [bot-0] Exiting exploring state
 🟢 STATE [15:02:39] action_evaluating_entry
 🔵 INFO [15:02:39] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
 🔵 INFO [15:02:39] 🚨 [ANIMATION-STATIC] Calling updateVisualPosition for explorer {worldPosition: {…}, droneState: 'docked', isMoving: false}
 🔧 CONTEXT [15:02:39] 🛸 [bot-0] explorer position: (-0.71, 0.50, -3.69)
