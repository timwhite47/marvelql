'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _graphql = require('graphql');

var _lodash = require('lodash');

var _graphqlRelay = require('graphql-relay');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

  var id = _fromGlobalId.id;

  return _character2.default.find(id);
}, function () {
  return characterType;
});

var nodeInterface = _nodeDefinitions.nodeInterface;
var nodeField = _nodeDefinitions.nodeField;

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

var parseResourceURI = function parseResourceURI(resourceURI) {
  return (0, _lodash.last)(resourceURI.split('/'));
};

var seriresType = new _graphql.GraphQLObjectType({
  name: 'Series',
  fields: function fields() {
    return {
      id: {
        description: 'The id of the series',
        type: _graphql.GraphQLString,
        resolve: function resolve(obj) {
          return parseResourceURI(obj.resourceURI);
        }
      },
      name: {
        description: 'The name of the series',
        type: _graphql.GraphQLString
      }
    };
  }
});

var imageType = new _graphql.GraphQLObjectType({
  name: 'Image',
  fields: function fields() {
    return {
      url: {
        type: _graphql.GraphQLString,
        resolve: function resolve(obj) {
          return [obj.path, obj.extension].join('.');
        }
      }
    };
  }
});

var urlType = new _graphql.GraphQLObjectType({
  name: 'URL',
  fields: function fields() {
    return {
      type: {
        type: _graphql.GraphQLString,
        description: 'A text identifier for the URL'
      },
      url: {
        type: _graphql.GraphQLString,
        description: 'A full URL (including scheme, domain, and path)'
      }
    };
  }
});

var comicType = new _graphql.GraphQLObjectType({
  name: 'Comic',
  fields: function fields() {
    return {
      id: {
        description: 'Marvel API ID',
        type: _graphql.GraphQLID
      },
      digitalId: {
        description: 'Digital Comic ID',
        type: _graphql.GraphQLString
      },
      title: {
        description: 'The canonical id of the comic',
        type: _graphql.GraphQLString
      },
      issueNumber: {
        description: 'The number of the issue in the series (will generally be 0 for collection formats)',
        type: _graphql.GraphQLInt
      },
      format: {
        description: ' The publication format of the comic e.g. comic, hardcover, trade paperback.',
        type: _graphql.GraphQLString
      },
      series: {
        type: seriresType,
        description: 'Series that comic belongs to.'
      },
      images: {
        type: new _graphql.GraphQLList(imageType),
        description: 'A list of promotional images associated with this comic.'
      },
      thumbnail: {
        type: imageType,
        description: 'The representative image for this comic'
      },
      urls: {
        type: new _graphql.GraphQLList(urlType),
        description: 'A set of public web site URLs for the resource'
      }
    };
  }
});

var characterType = new _graphql.GraphQLObjectType({
  name: 'Character',
  fields: function fields() {
    return {
      id: {
        description: 'Marvel API ID',
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
      },
      name: {
        description: 'Name of character',
        type: _graphql.GraphQLString
      },
      description: {
        description: 'A short bio or description of the character.',
        type: _graphql.GraphQLString
      },
      modified: {
        description: 'The date the resource was most recently modified.',
        type: _graphql.GraphQLString
      },
      resourceURI: {
        description: 'The canonical URL identifier for this resource',
        type: _graphql.GraphQLString
      },
      thumbnail: {
        description: '',
        type: _graphql.GraphQLString,
        resolve: function resolve(character) {
          return [character.thumbnail.path, character.thumbnail.extension].join('.');
        }
      },
      comics: {
        description: 'Comics the character appears in.',
        type: new _graphql.GraphQLList(comicType),
        resolve: function resolve(response) {
          var character = new _character2.default(response);

          return character.fetchComics();
        }
      }
    };
  },
  interfaces: [nodeInterface]
});

var viewerType = new _graphql.GraphQLObjectType({
  name: 'Viewer',
  fields: function fields() {
    return {
      characters: {
        type: new _graphql.GraphQLList(characterType),
        args: {
          search: {
            description: 'Search String to look up characters',
            type: _graphql.GraphQLString
          },
          limit: {
            description: 'Number of characters to return',
            type: _graphql.GraphQLInt
          }
        },
        resolve: function resolve(root, _ref) {
          var search = _ref.search;
          var limit = _ref.limit;

          if (search) {
            return _character2.default.search(search);
          }

          return _character2.default.all({ limit: limit });
        }
      }
    };
  }
});

var queryType = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: function fields() {
    return {
      node: nodeField,
      viewer: {
        type: viewerType,
        resolve: function resolve() {
          return {};
        }
      },
      character: {
        type: characterType,
        args: {
          id: {
            description: 'Marvel API Character ID',
            type: _graphql.GraphQLString
          }
        },
        resolve: function resolve(root, _ref2) {
          var id = _ref2.id;
          return _character2.default.find(id);
        }
      }
    };
  }
});

exports.default = new _graphql.GraphQLSchema({
  query: queryType
});