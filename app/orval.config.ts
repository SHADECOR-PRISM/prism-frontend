import { defineConfig } from 'orval';

export default defineConfig({
  prism: {
    input: './openapi/schema.json',
    output: {
      mode: 'split',
      target: './src/api/generated/prismApi.ts',
      client: 'axios',
      override: {
        mutator: {
          path: './src/api/mutator/customInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
