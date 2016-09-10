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

  // id (int, optional): The unique ID of the comic resource.,
  // digitalId (int, optional): The ID of the digital comic representation of this comic. Will be 0 if the comic is not available digitally.,
  // title (string, optional): The canonical title of the comic.,
  // issueNumber (double, optional): The number of the issue in the series (will generally be 0 for collection formats).,
  // variantDescription (string, optional): If the issue is a variant (e.g. an alternate cover, second printing, or director’s cut), a text description of the variant.,
  // description (string, optional): The preferred description of the comic.,
  // modified (Date, optional): The date the resource was most recently modified.,
  // isbn (string, optional): The ISBN for the comic (generally only populated for collection formats).,
  // upc (string, optional): The UPC barcode number for the comic (generally only populated for periodical formats).,
  // diamondCode (string, optional): The Diamond code for the comic.,
  // ean (string, optional): The EAN barcode for the comic.,
  // issn (string, optional): The ISSN barcode for the comic.,
  // format (string, optional): The publication format of the comic e.g. comic, hardcover, trade paperback.,
  // pageCount (int, optional): The number of story pages in the comic.,
  // textObjects (Array[TextObject], optional): A set of descriptive text blurbs for the comic.,
  // resourceURI (string, optional): The canonical URL identifier for this resource.,
  // urls (Array[Url], optional): A set of public web site URLs for the resource.,
  // series (SeriesSummary, optional): A summary representation of the series to which this comic belongs.,
  // variants (Array[ComicSummary], optional): A list of variant issues for this comic (includes the "original" issue if the current issue is a variant).,
  // collections (Array[ComicSummary], optional): A list of collections which include this comic (will generally be empty if the comic's format is a collection).,
  // collectedIssues (Array[ComicSummary], optional): A list of issues collected in this comic (will generally be empty for periodical formats such as "comic" or "magazine").,
  // dates (Array[ComicDate], optional): A list of key dates for this comic.,
  // prices (Array[ComicPrice], optional): A list of prices for this comic.,
  // thumbnail (Image, optional): The representative image for this comic.,
  // images (Array[Image], optional): A list of promotional images associated with this comic.,
  // creators (CreatorList, optional): A resource list containing the creators associated with this comic.,
  // characters (CharacterList, optional): A resource list containing the characters which appear in this comic.,
  // stories (StoryList, optional): A resource list containing the stories which appear in this comic.,
  // events (EventList, optional): A resource list containing the events in which this comic appears.
const parseResourceURI = (resourceURI) => last(resourceURI.split('/'));

const seriresType = new GraphQLObjectType({
  name: 'Series',
  fields: () => ({
    id: {
      description: 'The id of the series',
      type: GraphQLString,
      resolve: (obj) => parseResourceURI(obj.resourceURI),
    },
    name: {
      description: 'The name of the series',
      type: GraphQLString,
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
    }
  })
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
      type: seriresType,
      description: 'Series that comic belongs to.',
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

        return character.fetchComics();
      },
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
