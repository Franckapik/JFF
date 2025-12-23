import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist', 'node_modules', 'backup', '*.config.js', '*.config.mjs'] },
  // Bloc TypeScript uniquement
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    settings: {
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      // Détection des variables/fonctions/types non utilisés
      'no-unused-vars': 'off', // Désactive la règle JS de base
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
      }],

      // Types any - Warn au lieu d'erreur pour permettre la migration progressive
      '@typescript-eslint/no-explicit-any': 'warn',

      // Détection des exports/imports non utilisés - DÉSACTIVÉ temporairement
      // Cette règle a des problèmes avec les types TypeScript et les re-exports
      'import/no-unused-modules': 'off',

      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // à activer si tu veux checker les imports
      'import/order': ['warn', {
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

      // Règles complémentaires
      'no-undef': 'error',
      'no-unused-expressions': 'warn',
      'no-unreachable': 'error',
      'no-console': 'warn',

      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unused-prop-types': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // React Three Fiber - Autorise les propriétés de R3F  
      'react/no-unknown-property': ['error', { 
        'ignore': ['position', 'rotation', 'args', 'intensity', 'castShadow', 'metalness', 'roughness', 'transparent', 'emissive', 'emissiveIntensity'] 
      }],
      // TypeScript comments - Plus permissif pour @ts-expect-error
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // Bloc dédié: Maintenance Domain Guards - Enforce Purity
  {
    files: ['src/ai/fsm/machineX/domains/maintenance/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      // Forbid store access in maintenance domain (ensure pure guards)
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='useTileStore'] > Identifier",
          message: '❌ Guards in maintenance/ must be pure. getState() is forbidden. Use guards.pure.ts instead.',
        },
        {
          selector: "CallExpression[callee.object.name='useGameStore'] > Identifier",
          message: '❌ Guards in maintenance/ must be pure. getState() is forbidden. Use guards.pure.ts instead.',
        },
      ],
      
      // Forbid React/R3F/stores imports in maintenance guards (ensure purity)
      'no-restricted-imports': [
        'error',
        {
          name: 'react',
          message: '❌ FSM guards must be pure. React imports forbidden.',
        },
        {
          name: '@react-three/fiber',
          message: '❌ FSM guards must be pure. R3F imports forbidden.',
        },
        {
          name: 'zustand',
          message: '❌ FSM guards must be pure. Store imports forbidden.',
        },
      ],
    },
  },

  // Bloc dédié: Evaluation Domain Guards - Enforce Purity
  {
    files: ['src/ai/fsm/machineX/domains/evaluation/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      // Note: evaluation/guards.ts still has shouldCollect with getState()
      // This is marked @deprecated and will be refactored in Phase 2
      // For now, we allow it but warn about new violations
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.object.name='useTileStore'] > Identifier",
          message: '⚠️ Guards in evaluation/ should be pure. getState() is discouraged. Use guards.pure.ts for new guards.',
        },
        {
          selector: "CallExpression[callee.object.name='useGameStore'] > Identifier",
          message: '⚠️ Guards in evaluation/ should be pure. getState() is discouraged. Use guards.pure.ts for new guards.',
        },
      ],
      
      // Forbid React/R3F/stores imports in evaluation guards (ensure purity)
      'no-restricted-imports': [
        'error',
        {
          name: 'react',
          message: '❌ FSM guards must be pure. React imports forbidden.',
        },
        {
          name: '@react-three/fiber',
          message: '❌ FSM guards must be pure. R3F imports forbidden.',
        },
      ],
    },
  },

  // Bloc JavaScript uniquement (sans TypeScript parser)
  {
    files: ['src/**/*.{js,jsx}'],
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
          extensions: ['.js', '.jsx', '.ts', '.tsx']
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

      // Détection des variables/fonctions non utilisés (JS standard)
      'no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false,
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
      }],

      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/order': ['warn', {
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

      // Règles complémentaires
      'no-undef': 'error',
      'no-unused-expressions': 'warn',
      'no-unreachable': 'error',
      'no-console': 'warn',

      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unused-prop-types': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Bloc spécifique pour fichiers de constantes TypeScript uniquement
  {
    files: ['**/constants.ts', '**/config/*.ts', 'src/TestExports.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {
        'vars': 'all',
        'args': 'none',
        'varsIgnorePattern': '^_|^[A-Z][A-Z_]*$',
        'ignoreRestSiblings': true,
      }],
    }
  }
]
