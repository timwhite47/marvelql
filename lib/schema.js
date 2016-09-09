'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _character = require('./character');

var _character2 = _interopRequireDefault(_character);

var _graphql = require('graphql');

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
        resolve: function resolve(obj) {
          return [obj.thumbnail.path, obj.thumbnail.extension].join('.');
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