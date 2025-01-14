import parser from 'vue-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      '**/.vscode/',
      '**/*.d.ts',
    ],
  },
  ...compat.extends(
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    files: [
      '**/*.vue',
      '**/*.ts',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.tsx',
      '**/*.jsx',
    ],
    languageOptions: {
      parser: parser,
      ecmaVersion: 2023,
      sourceType: 'script',

      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },

    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
    overrides: [
      {
        files: ['pages/**/*.vue'],
        rules: {
          'vue/multi-word-component-names': 'off',
        },
      },
    ],
  },
];
