'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _comic = require('./comic');

var _comic2 = _interopRequireDefault(_comic);

var _series = require('./series');

var _series2 = _interopRequireDefault(_series);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _graphql = require('graphql');

var _lodash = require('lodash');

var _graphqlRelay = require('graphql-relay');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

  var id = _fromGlobalId.id;
  var type = _fromGlobalId.type;

  console.log('Resolved from Global ID', id, type);
  return _character2.default.find(id);
}, function (obj) {
  console.log('Resolving Type of object', obj);
  return characterType;
}); /* eslint-disable no-use-before-define */

var nodeInterface = _nodeDefinitions.nodeInterface;
var nodeField = _nodeDefinitions.nodeField;

var parseResourceURI = function parseResourceURI(resourceURI) {
  return (0, _lodash.last)(resourceURI.split('/'));
};

var seriesType = new _graphql.GraphQLObjectType({
  name: 'Series',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)(),
      title: {
        description: 'The name of the series',
        type: _graphql.GraphQLString
      },
      description: {
        description: 'A description of the series.',
        type: _graphql.GraphQLString
      },
      urls: {
        type: new _graphql.GraphQLList(urlType),
        description: 'A set of public web site URLs for the resource'
      },
      startYear: {
        type: _graphql.GraphQLInt,
        description: 'The first year of publication for the series'
      },
      endYear: {
        type: _graphql.GraphQLInt,
        description: 'The last year of publication for the series (conventionally, 2099 for ongoing series)'
      },
      rating: {
        type: _graphql.GraphQLString,
        description: 'The age-appropriateness rating for the series'
      },
      modified: {
        type: _graphql.GraphQLString,
        description: ''
      },
      thumbnail: {
        type: imageType,
        description: 'The representative image for this series'
      },
      comics: {
        type: comicConnection,
        args: _graphqlRelay.connectionArgs,
        description: 'A resource list containing comics in this series',
        resolve: function resolve(data) {
          var series = new _series2.default(data);
          return series.comics();
        }
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
        args: _graphqlRelay.connectionArgs,
        description: 'Events the character is involved in',
        resolve: function resolve(data) {
          var series = new _series2.default(data);
          return series.events();
        }
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
      id: (0, _graphqlRelay.globalIdField)(),
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
        type: seriesType,
        description: 'Series that comic belongs to.',
        resolve: function resolve(data) {
          return _series2.default.find(parseResourceURI(data.series.resourceURI));
        }
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
        type: characterConnection,
        args: _graphqlRelay.connectionArgs,
        description: 'Characters appearing in comic',
        resolve: function resolve(data) {
          var comic = new _comic2.default(data);
          return comic.characters();
        }
      }
    };
  }
});

var eventType = new _graphql.GraphQLObjectType({
  name: 'Event',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)(),
      title: {
        description: 'Title of Event',
        type: _graphql.GraphQLString
      },
      description: {
        description: 'Description of Event',
        type: _graphql.GraphQLString
      },
      urls: {
        type: new _graphql.GraphQLList(urlType),
        description: 'A set of public web site URLs for the event'
      },
      start: {
        description: 'Start Date of Event',
        type: _graphql.GraphQLString
      },
      end: {
        description: 'End Date of Event',
        type: _graphql.GraphQLString
      },
      thumbnail: {
        description: 'The representative image for this event',
        type: imageType
      },
      comics: {
        description: 'Comics included in this event.',
        type: comicConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(data) {
          var event = new _event2.default(data);
          return event.comics();
        }
      },

      // stories: {
      //   description: 'Stories included in this event.',
      //   type: storyType
      // }

      characters: {
        type: characterConnection,
        args: _graphqlRelay.connectionArgs,
        description: 'Characters involved in event',
        resolve: function resolve(data) {
          var event = new _event2.default(data);
          return event.characters();
        }
      }
    };
  }
});

var characterType = new _graphql.GraphQLObjectType({
  name: 'Character',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)(),
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
        type: comicConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(response, args) {
          var character = new _character2.default(response);
          return (0, _graphqlRelay.connectionFromPromisedArray)(character.comics(args), args);
        }
      },
      series: {
        type: seriesConnection,
        args: _graphqlRelay.connectionArgs,
        description: 'Series that the character is in.',
        resolve: function resolve(response, args) {
          var character = new _character2.default(response);
          return (0, _graphqlRelay.connectionFromPromisedArray)(character.series(), args);
        }
      },
      events: {
        type: eventConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(response, args) {
          var character = new _character2.default(response);
          return (0, _graphqlRelay.connectionFromPromisedArray)(character.events(), args);
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
        type: comicConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(root, args) {
          return _comic2.default.all(args);
        }
      },
      series: {
        type: seriesConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(root, args) {
          return _series2.default.all(args);
        }
      },

      events: {
        type: eventConnection,
        args: _graphqlRelay.connectionArgs,
        resolve: function resolve(root, args) {
          return _event2.default.all(args);
        }
      },

      characters: {
        type: characterConnection,
        args: (0, _lodash.merge)(_graphqlRelay.connectionArgs, {
          search: {
            description: 'Search String to look up characters',
            type: _graphql.GraphQLString
          }
        }),
        resolve: function resolve(root, args) {
          if (args.search) {
            return (0, _graphqlRelay.connectionFromPromisedArray)(_character2.default.search(args.search), args);
          }

          return (0, _graphqlRelay.connectionFromPromisedArray)(_character2.default.all(args), args);
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
        resolve: function resolve(root, _ref) {
          var id = _ref.id;
          return _character2.default.find((0, _graphqlRelay.fromGlobalId)(id).id);
        }
      },
      comic: {
        type: comicType,
        args: {
          id: {
            description: 'Marvel API Comic ID',
            type: _graphql.GraphQLString
          }
        },
        resolve: function resolve(root, _ref2) {
          var id = _ref2.id;
          return _comic2.default.find((0, _graphqlRelay.fromGlobalId)(id).id);
        }
      },
      series: {
        type: seriesType,
        args: {
          id: {
            description: 'Marvel API Series ID',
            type: _graphql.GraphQLString
          }
        },
        resolve: function resolve(root, _ref3) {
          var id = _ref3.id;
          return _series2.default.find((0, _graphqlRelay.fromGlobalId)(id).id);
        }
      }
    };
  }
});

var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({ nodeType: comicType });

var comicConnection = _connectionDefinition.connectionType;

var _connectionDefinition2 = (0, _graphqlRelay.connectionDefinitions)({ nodeType: eventType });

var eventConnection = _connectionDefinition2.connectionType;

var _connectionDefinition3 = (0, _graphqlRelay.connectionDefinitions)({ nodeType: characterType });

var characterConnection = _connectionDefinition3.connectionType;

var _connectionDefinition4 = (0, _graphqlRelay.connectionDefinitions)({ nodeType: seriesType });

var seriesConnection = _connectionDefinition4.connectionType;
exports.default = new _graphql.GraphQLSchema({
  query: queryType
});