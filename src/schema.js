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
} from 'lodash';

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

const parseResourceURI = (resourceURI) => last(resourceURI.split('/'));

const seriesType = new GraphQLObjectType({
  name: 'Series',
  fields: () => ({
    id: {
      description: 'The id of the series',
      type: GraphQLString,
    },
    title: {
      description: 'The name of the series',
      type: GraphQLString,
    },
    description: {
      description: 'A description of the series.',
      type: GraphQLString,
    },
    urls: {
      type: urlType,
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
      type: GraphQLString,
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
      type: eventType,
      description: '',
      resolve: (data) => {
        const series = new Series(data);
        return series.events();
      }
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
    id: {
      description: 'Marvel API ID',
      type: GraphQLID,
    },
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
      type: new GraphQLList(characterType),
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
    id: {
      description: 'Marvel API ID',
      type: new GraphQLNonNull(GraphQLID),
    },
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
      type: new GraphQLList(comicType),
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
      type: new GraphQLList(characterType),
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
      resolve: (character) => [character.thumbnail.path, character.thumbnail.extension].join('.'),
    },
    comics: {
      description: 'Comics the character appears in.',
      type: new GraphQLList(comicType),
      resolve: (response) => {
        const character = new Character(response);

        return character.comics();
      },
    },
    series: {
      type: new GraphQLList(seriesType),
      description: 'Series that the character is in.',
      resolve(response) {
        const character = new Character(response);
        return character.series();
      },
    },
    events: {
      type: new GraphQLList(eventType),
      resolve(response) {
        const character = new Character(response);
        return character.events();
      },
    },
  }),
  interfaces: [nodeInterface],
});

const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    comics: {
      type: new GraphQLList(comicType),
      resolve: () => Comic.all(),
    },
    series: {
      type: new GraphQLList(seriesType),
      resolve: () => Series.all(),
    },

    events: {
      type: new GraphQLList(eventType),
      resolve: () => Event.all(),
    },
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
