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

var Comic = function () {
  _createClass(Comic, null, [{
    key: 'all',
    value: function all() {
      var cacheKey = 'comics:all';
      return (0, _marvel.cacheCollection)(cacheKey, function (_ref) {
        var limit = _ref.limit;
        var offset = _ref.offset;
        return _marvel2.default.comics.findAll(limit, offset);
      });
    }
  }, {
    key: 'find',
    value: function find(id) {
      var cacheKey = 'comics:' + id;
      return (0, _marvel.cacheFetch)(cacheKey, function () {
        return _marvel2.default.comics.find(id).then(_api_helpers.parseObject);
      });
    }
  }]);

  function Comic(data) {
    _classCallCheck(this, Comic);

    this.data = data;
  }

  _createClass(Comic, [{
    key: 'stories',
    value: function stories() {
      return this._fetchCollection('stories');
    }
  }, {
    key: 'characters',
    value: function characters() {
      return this._fetchCollection('characters');
    }
  }, {
    key: 'series',
    value: function series() {
      return this._fetchObject('series');
    }
  }, {
    key: '_fetch',
    value: function _fetch(target) {
      var id = this.data.id;

      var cacheKey = 'characters:' + id + ':' + target;

      return (0, _marvel.cacheFetch)(cacheKey, function () {
        return _marvel2.default.comics[target](id);
      });
    }
  }, {
    key: '_fetchCollection',
    value: function _fetchCollection(target) {
      return this._fetch(target).then(_api_helpers.parseCollection);
    }
  }, {
    key: '_fetchObject',
    value: function _fetchObject(target) {
      return this._fetch(target).then(_api_helpers.parseObject);
    }
  }]);

  return Comic;
}();

exports.default = Comic;