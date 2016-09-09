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
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay';

const marvelApi = require('marvel-api');
const LIMIT = 100;

const marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY,
});

const findByName = (name) => marvel.characters.findByName(name)
  .then((response) => response.data[0]);

const findAll = () => marvel.characters.findAll(LIMIT)
  .then((response) => response.data);

const findById = (id) => marvel.characters.find(id)
  .then((response) => response.data[0]);

const searchByName = (name) => marvel.characters.findNameStartsWith(name)
  .then((response) => response.data);

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      const { id } = fromGlobalId(globalId);
      return findById(id);
    },
    () => characterType,
  );

const characterType = new GraphQLObjectType({
  name: 'Character',
  fields: () => ({
    id: {
      description: 'Marvel API ID',
      type: new GraphQLNonNull(GraphQLID),
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
  interfaces: [nodeInterface],
});

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    characters: {
      type: new GraphQLList(characterType),
      args: {
        search: {
          description: 'Search String to look up characters',
          type: GraphQLString,
        },
      },
      resolve: (root, { search }) => {
        if (search) {
          return searchByName(search);
        }

        return findAll();
      },
    },
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: viewerType,
      resolve: () => ({})
    },
    character: {
      type: characterType,
      args: {
        name: {
          description: 'Name of character',
          type: GraphQLString,
        },
        id: {
          description: 'Marvel API Character ID',
          type: GraphQLString,
        },
      },
      resolve: (root, { name, id }) => {
        if (id) {
          return findById(id);
        }

        return findByName(name);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: queryType,
});
