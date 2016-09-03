if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const {
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_PRIVATE_KEY,
} = process.env;

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

const marvelApi = require('marvel-api');

const marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY,
});

const findByName = (name) => marvel.characters.findByName(name)
  .then((response) => response.data[0]);

const characterType = new GraphQLObjectType({
  name: 'Character',
  fields: () => ({
    id: {
      description: 'Marvel API ID',
      type: GraphQLInt,
    },
    name: {
      description: 'Name of character',
      type: GraphQLString,
    },
    description: {
      description: 'A short bio or description of the character.',
      type: GraphQLString,
    },
    modified: {
      description: 'The date the resource was most recently modified.',
      type: GraphQLString,
    },
    resourceURI: {
      description: 'The canonical URL identifier for this resource',
      type: GraphQLString,
    },
    thumbnail: {
      description: '',
      type: GraphQLString,
      resolve: (obj) => [obj.thumbnail.path, obj.thumbnail.extension].join('.'),
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    character: {
      type: characterType,
      args: {
        name: {
          description: 'Name of character',
          type: GraphQLString,
        },
      },

      resolve: (root, { name }) => findByName(name),
    },
  }),
});

export default new GraphQLSchema({
  query: queryType,
});
