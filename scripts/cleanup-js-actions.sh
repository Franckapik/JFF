#!/bin/bash

# Script pour supprimer les anciens fichiers JavaScript après la migration TypeScript
# Version: 1.0.0
# Date: 2025-07-09

echo "🧹 Suppression des anciens fichiers JavaScript d'actions..."

# Fichiers d'actions core
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/core/droneExploringActions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/core/positionActions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/core/shipCollectingActions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/core/index.js

# Fichiers d'actions principaux
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/exploring.actions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/evaluating.actions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/collecting.actions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/maintaining.actions.js
rm -f /home/fanch/Documents/jff/react-three-vite/src/ai/fsm/machineX/actions/index.ts

echo "✅ Suppression terminée. Tous les fichiers JavaScript d'actions ont été supprimés."
echo "🎯 Les fichiers TypeScript équivalents sont maintenant utilisés."
