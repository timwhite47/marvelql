'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _comic = require('./comic');

var _comic2 = _interopRequireDefault(_comic);

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
      },
      characters: {
        type: new _graphql.GraphQLList(characterType),
        description: 'Characters appearing in comic',
        resolve: function resolve(data) {
          var comic = new _comic2.default(data);
          return comic.characters();
        }
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
      comics: {
        type: new _graphql.GraphQLList(comicType),
        resolve: function resolve() {
          return _comic2.default.all();
        }
      },
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