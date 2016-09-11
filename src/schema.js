/* eslint-disable no-use-before-define */

import Character from './character';
import Comic from './comic';
import Series from './series';
import Event from './event';

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
  last,
  merge,
} from 'lodash';

import {
  nodeDefinitions,
  fromGlobalId,
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      const { id, type } = fromGlobalId(globalId);
      console.log('Resolved from Global ID', id, type);
      return Character.find(id);
    },
    (obj) => {
      console.log('Resolving Type of object', obj);
      return characterType;
    },
  );


const parseResourceURI = (resourceURI) => last(resourceURI.split('/'));

const seriesType = new GraphQLObjectType({
  name: 'Series',
  fields: () => ({
    id: globalIdField(),
    title: {
      description: 'The name of the series',
      type: GraphQLString,
    },
    description: {
      description: 'A description of the series.',
      type: GraphQLString,
    },
    urls: {
      type: new GraphQLList(urlType),
      description: 'A set of public web site URLs for the resource',
    },
    startYear: {
      type: GraphQLInt,
      description: 'The first year of publication for the series',
    },
    endYear: {
      type: GraphQLInt,
      description: 'The last year of publication for the series (conventionally, 2099 for ongoing series)',
    },
    rating: {
      type: GraphQLString,
      description: 'The age-appropriateness rating for the series',
    },
    modified: {
      type: GraphQLString,
      description: '',
    },
    thumbnail: {
      type: imageType,
      description: 'The representative image for this series',
    },
    comics: {
      type: comicConnection,
      args: connectionArgs,
      description: 'A resource list containing comics in this series',
      resolve: (data) => {
        const series = new Series(data);
        return series.comics();
      },
    },
    // stories: {
    //   type: GraphQLString,
    //   description: '',
    //   resolve: (data) => {
    //     const series = new Series(data);
    //     return series.stories();
    //   },
    // },
    events: {
      type: eventConnection,
      args: connectionArgs,
      description: 'Events the character is involved in',
      resolve: (data) => {
        const series = new Series(data);
        return series.events();
      },
    },
  }),
});

const imageType = new GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    url: {
      type: GraphQLString,
      resolve: (obj) => [obj.path, obj.extension].join('.'),
    },
  }),
});

const urlType = new GraphQLObjectType({
  name: 'URL',
  fields: () => ({
    type: {
      type: GraphQLString,
      description: 'A text identifier for the URL',
    },
    url: {
      type: GraphQLString,
      description: 'A full URL (including scheme, domain, and path)',
    },
  }),
});

const comicType = new GraphQLObjectType({
  name: 'Comic',
  fields: () => ({
    id: globalIdField(),
    digitalId: {
      description: 'Digital Comic ID',
      type: GraphQLString,
    },
    title: {
      description: 'The canonical id of the comic',
      type: GraphQLString,
    },
    issueNumber: {
      description: 'The number of the issue in the series (will generally be 0 for collection formats)',
      type: GraphQLInt,
    },
    format: {
      description: ' The publication format of the comic e.g. comic, hardcover, trade paperback.',
      type: GraphQLString,
    },
    series: {
      type: seriesType,
      description: 'Series that comic belongs to.',
      resolve: (data) => Series.find(parseResourceURI(data.series.resourceURI)),
    },
    images: {
      type: new GraphQLList(imageType),
      description: 'A list of promotional images associated with this comic.',
    },
    thumbnail: {
      type: imageType,
      description: 'The representative image for this comic',
    },
    urls: {
      type: new GraphQLList(urlType),
      description: 'A set of public web site URLs for the resource',
    },
    characters: {
      type: characterConnection,
      args: connectionArgs,
      description: 'Characters appearing in comic',
      resolve: (data) => {
        const comic = new Comic(data);
        return comic.characters();
      },
    },
  }),
});

const eventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: globalIdField(),
    title: {
      description: 'Title of Event',
      type: GraphQLString,
    },
    description: {
      description: 'Description of Event',
      type: GraphQLString,
    },
    urls: {
      type: new GraphQLList(urlType),
      description: 'A set of public web site URLs for the event',
    },
    start: {
      description: 'Start Date of Event',
      type: GraphQLString,
    },
    end: {
      description: 'End Date of Event',
      type: GraphQLString,
    },
    thumbnail: {
      description: 'The representative image for this event',
      type: imageType,
    },
    comics: {
      description: 'Comics included in this event.',
      type: comicConnection,
      args: connectionArgs,
      resolve: (data) => {
        const event = new Event(data);
        return event.comics();
      },
    },

    // stories: {
    //   description: 'Stories included in this event.',
    //   type: storyType
    // }

    characters: {
      type: characterConnection,
      args: connectionArgs,
      description: 'Characters involved in event',
      resolve: (data) => {
        const event = new Event(data);
        return event.characters();
      },
    },
  }),
});

const characterType = new GraphQLObjectType({
  name: 'Character',
  fields: () => ({
    id: globalIdField(),
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
      resolve: (character) => [character.thumbnail.path, character.thumbnail.extension].join('.'),
    },
    comics: {
      description: 'Comics the character appears in.',
      type: comicConnection,
      args: connectionArgs,
      resolve: (response, args) => {
        const character = new Character(response);
        return connectionFromPromisedArray(character.comics(), args);
      },
    },
    series: {
      type: seriesConnection,
      args: connectionArgs,
      description: 'Series that the character is in.',
      resolve: (response, args) => {
        const character = new Character(response);
        return connectionFromPromisedArray(character.series(), args);
      },
    },
    events: {
      type: eventConnection,
      args: connectionArgs,
      resolve(response, args) {
        const character = new Character(response);
        return connectionFromPromisedArray(character.events(), args);
      },
    },
  }),
  interfaces: [nodeInterface],
});

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    comics: {
      type: comicConnection,
      args: connectionArgs,
      resolve: (root, args) => Comic.all(args),
    },
    series: {
      type: seriesConnection,
      args: connectionArgs,
      resolve: () => Series.all(),
    },

    events: {
      type: eventConnection,
      args: connectionArgs,
      resolve: () => Event.all(),
    },

    characters: {
      type: characterConnection,
      args: merge(connectionArgs, {
        search: {
          description: 'Search String to look up characters',
          type: GraphQLString,
        },
      }),
      resolve: (root, args) => {
        if (args.search) {
          return connectionFromPromisedArray(Character.search(args.search), args);
        }

        return connectionFromPromisedArray(Character.all(), args);
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
    comic: {
      type: comicType,
      args: {
        id: {
          description: 'Marvel API Comic ID',
          type: GraphQLString,
        },
      },
      resolve: (root, { id }) => Comic.find(id),
    },
    series: {
      type: seriesType,
      args: {
        id: {
          description: 'Marvel API Series ID',
          type: GraphQLString,
        },
      },
      resolve: (root, { id }) => Series.find(id),
    },
  }),
});

const { connectionType: comicConnection } = connectionDefinitions({ nodeType: comicType });
const { connectionType: eventConnection } = connectionDefinitions({ nodeType: eventType });
const { connectionType: characterConnection } = connectionDefinitions({ nodeType: characterType });
const { connectionType: seriesConnection } = connectionDefinitions({ nodeType: seriesType });

export default new GraphQLSchema({
  query: queryType,
});
