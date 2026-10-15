/** Flat ESLint configuration for the Expo TypeScript app. */
const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'coverage/**'],
  },
  ...expoConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'import/no-named-as-default-member': 'off',
    },
  },
]);
