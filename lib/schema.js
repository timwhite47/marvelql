'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var _process$env = process.env;
var MARVEL_API_PUBLIC_KEY = _process$env.MARVEL_API_PUBLIC_KEY;
var MARVEL_API_PRIVATE_KEY = _process$env.MARVEL_API_PRIVATE_KEY;

var marvelApi = require('marvel-api');
var LIMIT = 100;

var marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY
});

var findByName = function findByName(name) {
  return marvel.characters.findByName(name).then(function (response) {
    return response.data[0];
  });
};

var findAll = function findAll() {
  return marvel.characters.findAll(LIMIT).then(function (response) {
    return response.data;
  });
};

var findById = function findById(id) {
  return marvel.characters.find(id).then(function (response) {
    return response.data[0];
  });
};

var searchByName = function searchByName(name) {
  return marvel.characters.findNameStartsWith(name).then(function (response) {
    return response.data;
  });
};

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

  var id = _fromGlobalId.id;

  return findById(id);
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
          }
        },
        resolve: function resolve(root, _ref) {
          var search = _ref.search;

          if (search) {
            return searchByName(search);
          }

          return findAll();
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
          name: {
            description: 'Name of character',
            type: _graphql.GraphQLString
          },
          id: {
            description: 'Marvel API Character ID',
            type: _graphql.GraphQLString
          }
        },
        resolve: function resolve(root, _ref2) {
          var name = _ref2.name;
          var id = _ref2.id;

          if (id) {
            return findById(id);
          }

          return findByName(name);
        }
      }
    };
  }
});

exports.default = new _graphql.GraphQLSchema({
  query: queryType
});