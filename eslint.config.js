import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'

export default [
  { ignores: ['dist', 'node_modules', 'backup'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx']
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // ============================================================================
      // RÈGLES POUR LES EXPORTS/IMPORTS NON UTILISÉS - NOUVELLES RÈGLES
      // ============================================================================

      // 🔥 ALTERNATIVE : Règles plus simples pour les exports/imports
      'import/no-duplicates': 'error',           // Imports dupliqués
      'import/no-unresolved': 'off',             // Désactivé (problème avec alias Vite)
      'import/order': ['warn', {                 // Ordre des imports
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always-and-inside-groups',
      }],

      // 🔍 DÉTECTION BASIQUE DES VARIABLES EXPORTÉES NON UTILISÉES
      // Note: import/no-unused-modules ne fonctionne qu'en ligne de commande, pas dans VS Code
      'import/no-unused-modules': ['error', {
        'unusedExports': true,
        'src': ['src/**/*.{js,jsx}'],
        'ignoreExports': [
          'src/index.jsx',        // Point d'entrée principal
          'src/App.jsx',          // Composant racine
          '**/*.test.{js,jsx}',   // Fichiers de test
          '**/*.spec.{js,jsx}',   // Fichiers de spec
        ]
      }],

      // ============================================================================
      // RÈGLES POUR LES VARIABLES NON UTILISÉES - PRIORITÉ MAXIMALE  
      // ============================================================================

      // Règle principale : détecter les variables non utilisées (ERROR = rouge)
      'no-unused-vars': ['error', {
        'vars': 'all',              // Vérifier TOUTES les variables
        'args': 'after-used',       // Vérifier les arguments après ceux utilisés
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',  // Ignorer les arguments commençant par _
        'varsIgnorePattern': '^_',  // Ignorer les variables commençant par _
        'caughtErrors': 'all',      // Vérifier les erreurs dans catch
        'caughtErrorsIgnorePattern': '^_', // Ignorer les erreurs catch commençant par _
        'destructuredArrayIgnorePattern': '^_', // Ignorer dans destructuring
        'reportUsedIgnorePattern': false
      }],

      // Règles complémentaires importantes
      'no-undef': 'error',           // Variables non définies
      'no-unused-expressions': 'warn', // Expressions non utilisées
      'no-unreachable': 'error',     // Code inaccessible
      'no-console': 'warn',          // Console.log en warning

      // ============================================================================
      // RÈGLES REACT AJUSTÉES
      // ============================================================================
      'react/prop-types': 'off',     // Désactiver prop-types 
      'react/react-in-jsx-scope': 'off', // React 17+ n'a plus besoin d'import React
      'react/no-unused-prop-types': 'warn', // Props non utilisées
      'react-hooks/exhaustive-deps': 'warn', // Dépendances useEffect
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // ============================================================================
  // CONFIGURATION SPÉCIALE POUR LA DÉTECTION D'EXPORTS NON UTILISÉS
  // ============================================================================
  {
    files: ['**/constants.js', '**/config/*.js', 'src/TestExports.js'],
    rules: {
      // Ajoutons une règle personnalisée pour les fichiers de constantes
      'no-unused-vars': ['warn', {
        'vars': 'all',
        'args': 'none',  // Ne pas vérifier les args dans les fichiers de constantes
        'varsIgnorePattern': '^_|^[A-Z][A-Z_]*$', // Ignorer _ et constantes MAJUSCULES
        'ignoreRestSiblings': true,
      }],
    }
  }
]
