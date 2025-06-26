#!/bin/bash

# Script de validation pré-commit pour vérifier les imports/exports
echo "🔍 Vérification des imports/exports..."

# Exécuter le script d'analyse
if node scripts/check-exports.js | grep -q "PROBLÈMES DÉTECTÉS"; then
    echo "❌ Erreurs d'import/export détectées !"
    echo "Exécutez 'npm run check-exports' pour voir les détails."
    exit 1
else
    echo "✅ Aucun problème d'import/export détecté."
fi

# Vérifier que les fichiers modifiés compilent
echo "🔍 Vérification de la compilation..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Compilation réussie."
else
    echo "❌ Erreurs de compilation détectées !"
    echo "Exécutez 'npm run build' pour voir les détails."
    exit 1
fi

echo "🎉 Toutes les vérifications sont passées !"
exit 0
