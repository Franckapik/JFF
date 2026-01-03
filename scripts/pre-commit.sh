#!/bin/bash

# Script de validation pré-commit
echo "🔍 Vérification TypeScript..."

# Vérifier les types TypeScript
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript validation passed."
else
    echo "❌ TypeScript errors detected!"
    echo "Exécutez 'npm run type-check' pour voir les détails."
    exit 1
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
