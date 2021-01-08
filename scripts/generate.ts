import fs from 'fs';
import { printSchema } from 'graphql';
import { generate } from '@graphql-codegen/cli';
import schema from '../src/server/schema';

export async function generateSchemaAndTypes() {
  fs.writeFileSync('./schema.graphql', printSchema(schema));

  return generate(
    {
      schema: './schema.graphql',
      documents: './src/client/**/*.graphql',
      generates: {
        './src/client/graphql.ts': {
          plugins: [
            'typescript',
            'typescript-operations',
            'typed-document-node',
            {
              add: {
                content: '/* eslint-disable */',
              },
            },
          ],
        },
      },
    },
    true,
  );
}

generateSchemaAndTypes().catch((error) => {
  console.error(error);
  process.exit(1);
});
