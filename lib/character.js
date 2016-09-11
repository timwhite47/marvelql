'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marvel = require('./marvel');

var _marvel2 = _interopRequireDefault(_marvel);

var _api_helpers = require('./api_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_LIMIT = 100;

var Character = function () {
  _createClass(Character, null, [{
    key: 'search',
    value: function search(input) {
      return _marvel2.default.characters.findNameStartsWith(input).then(_api_helpers.parseCollection);
    }
  }, {
    key: 'find',
    value: function find(id) {
      return (0, _marvel.cacheFetch)('characters:' + id, function () {
        return _marvel2.default.characters.find(id).then(_api_helpers.parseObject);
      });
    }
  }, {
    key: 'all',
    value: function all(args) {
      var cacheKey = 'characters:all:' + API_LIMIT;
      return (0, _marvel.cacheCollection)(cacheKey, function (_ref) {
        var limit = _ref.limit;
        var offset = _ref.offset;
        return _marvel2.default.characters.findAll(limit, offset);
      }, args.first);
    }
  }]);

  function Character(data) {
    _classCallCheck(this, Character);

    this.data = data;
  }

  _createClass(Character, [{
    key: 'comics',
    value: function comics(args) {
      return this._fetchCollection('comics', { limit: args.first });
    }
  }, {
    key: 'events',
    value: function events(args) {
      return this._fetchCollection('events', { limit: args.first });
    }
  }, {
    key: 'series',
    value: function series(args) {
      return this._fetchCollection('series', { limit: args.first });
    }
  }, {
    key: 'stories',
    value: function stories(args) {
      return this._fetchCollection('stories', { limit: args.first });
    }
  }, {
    key: '_fetch',
    value: function _fetch(target) {
      var id = this.data.id;

      var cacheKey = 'characters:' + id + ':' + target;

      return (0, _marvel.cacheFetch)(cacheKey, function () {
        return _marvel2.default.characters[target](id);
      });
    }
  }, {
    key: '_fetchCollection',
    value: function _fetchCollection(target, args) {
      var id = this.data.id;

      var cacheKey = 'characters:' + id + ':' + target;

      return (0, _marvel.cacheCollection)(cacheKey, function (_ref2) {
        var limit = _ref2.limit;
        var offset = _ref2.offset;
        return _marvel2.default.characters[target](id, limit, offset);
      }, args.limit);
    }
  }, {
    key: '_fetchObject',
    value: function _fetchObject(target) {
      return this._fetch(target).then(_api_helpers.parseObject);
    }
  }]);

  return Character;
}();

exports.default = Character;