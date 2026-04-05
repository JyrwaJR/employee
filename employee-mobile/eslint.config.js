const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    // Comprehensive ignores for modern Expo/Mobile development
    ignores: [
      '**/node_modules/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'dist/**',
      'build/**',
      '.eas/**',
      '*.min.js',
      'pnpm-lock.yaml',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
  // Prettier must be last to disable conflicting ESLint rules
  prettierConfig,
]);
