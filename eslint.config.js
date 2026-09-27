import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.worker },
    },
    settings: { react: { version: '19' } },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-duplicates': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/no-unknown-property': ['error', {
        ignore: ['position', 'rotation', 'args', 'intensity', 'castShadow', 'receiveShadow', 'attach', 'shadow-mapSize', 'metalness', 'roughness', 'transparent', 'emissive', 'emissiveIntensity'],
      }],
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    settings: { react: { version: '19' } },
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'import/no-duplicates': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['scripts/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    rules: js.configs.recommended.rules,
  },
  {
    files: ['src/engine/{botMachine,model,protocol,resources,rules,session,world}.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{
        group: ['react', 'react/*', 'react-dom', '@react-three/*', 'zustand', 'zustand/*', '**/stores/**', '**/components/**', '**/hooks/**'],
        message: 'The session engine must remain independent of rendering and UI stores.',
      }] }],
    },
  },
];
