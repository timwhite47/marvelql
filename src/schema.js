import Character from './character';

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

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      const { id } = fromGlobalId(globalId);
      return Character.find(id);
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
        limit: {
          description: 'Number of characters to return',
          type: GraphQLInt,
        },
      },
      resolve: (root, { search, limit }) => {
        if (search) {
          return Character.search(search);
        }

        return Character.all({ limit });
      },
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: viewerType,
      resolve: () => ({}),
    },
    character: {
      type: characterType,
      args: {
        id: {
          description: 'Marvel API Character ID',
          type: GraphQLString,
        },
      },
      resolve: (root, { id }) => Character.find(id),
    },
  }),
});

export default new GraphQLSchema({
  query: queryType,
});
