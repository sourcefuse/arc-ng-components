// ESLint flat config (ESLint 9+), required by @angular-eslint 22.
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const templatePlugin = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');

module.exports = [
  {ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**']},
  {linterOptions: {reportUnusedDisableDirectives: 'off'}},
  {
    files: ['**/*.ts'],
    languageOptions: {parser: tsParser},
    plugins: {'@typescript-eslint': tsPlugin, '@angular-eslint': angularPlugin},
    processor: templatePlugin.processors['extract-inline-html'],
    rules: {
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {parser: templateParser},
    plugins: {'@angular-eslint/template': templatePlugin},
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
];
