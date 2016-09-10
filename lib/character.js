'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var marvelApi = require('marvel-api');
var API_LIMIT = 100;

var _process$env = process.env;
var MARVEL_API_PUBLIC_KEY = _process$env.MARVEL_API_PUBLIC_KEY;
var MARVEL_API_PRIVATE_KEY = _process$env.MARVEL_API_PRIVATE_KEY;

var marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY
});

function parseCollection(response) {
  return response.data;
}

function parseObject(response) {
  return response.data[0];
}

var Character = function () {
  _createClass(Character, null, [{
    key: 'search',
    value: function search(input) {
      return marvel.characters.findNameStartsWith(input).then(parseCollection);
    }
  }, {
    key: 'find',
    value: function find(id) {
      return marvel.characters.find(id).then(parseObject);
    }
  }, {
    key: 'all',
    value: function all(_ref) {
      var limit = _ref.limit;

      limit = limit || API_LIMIT;
      return _bluebird2.default.map((0, _lodash.range)(limit / API_LIMIT), function (offset) {
        return marvel.characters.findAll(API_LIMIT, offset).then(parseCollection);
      }).then(function (responses) {
        return (0, _lodash.flatten)(responses).slice(0, limit);
      });
    }
  }]);

  function Character(data) {
    _classCallCheck(this, Character);

    this.data = data;
  }

  _createClass(Character, [{
    key: 'fetchComics',
    value: function fetchComics() {
      return marvel.characters.comics(this.data.id).then(parseCollection);
    }
  }]);

  return Character;
}();

exports.default = Character;