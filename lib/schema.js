'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var _process$env = process.env;
var MARVEL_API_PUBLIC_KEY = _process$env.MARVEL_API_PUBLIC_KEY;
var MARVEL_API_PRIVATE_KEY = _process$env.MARVEL_API_PRIVATE_KEY;

var marvelApi = require('marvel-api');

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
  return marvel.characters.findAll().then(function (response) {
    return response.data;
  });
};

var findById = function findById(id) {
  return marvel.characters.find(id).then(function (response) {
    return response.data[0];
  });
};

var characterType = new _graphql.GraphQLObjectType({
  name: 'Character',
  fields: function fields() {
    return {
      id: {
        description: 'Marvel API ID',
        type: _graphql.GraphQLInt
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
  }
});

var queryType = new _graphql.GraphQLObjectType({
  name: 'Query',
  fields: function fields() {
    return {
      characters: {
        type: new _graphql.GraphQLList(characterType),
        resolve: function resolve() {
          return findAll();
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
        resolve: function resolve(root, _ref) {
          var name = _ref.name;
          var id = _ref.id;

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