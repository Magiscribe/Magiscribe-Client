import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.node } },
  {
    ignores: ['.docs/', 'dist/', 'node_modules/', 'dist/', '*.js'],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
