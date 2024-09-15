import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'src/graphql/': {
      preset: 'client',
      plugins: ['typescript'],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
