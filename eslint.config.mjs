import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.node } },
  {
    ignores: ['docs/', 'dist/', 'node_modules/', '*.js', 'src/graphql/*'],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
