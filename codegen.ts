import type { CodegenConfig } from '@/graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  schema: 'http://localhost:3000/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      plugins: [],
    },
    'src/graphql/types.tsx': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
