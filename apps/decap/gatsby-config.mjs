import autoload from '@custom/schema/gatsby-autoload';
import { getPages, getTranslatables } from './build/index.js';
import { resolve } from 'path';

const dir = resolve('data');

/**
 * @type {import('gatsby').GatsbyConfig['plugins']}
 */
export const plugins = [
  {
    resolve: '@amazeelabs/gatsby-source-silverback',
    options: {
      schema_configuration: './graphqlrc.yml',
      directives: autoload,
      sources: {
        getPages: getPages(`${dir}/page`),
        getTranslatables: getTranslatables(dir),
      },
    },
  },
  {
    resolve: '@amazeelabs/gatsby-plugin-static-dirs',
    options: {
      directories: {
        'node_modules/@custom/decap/dist': '/admin',
        'node_modules/@custom/decap/media': '/media',
      },
    },
  },
];
