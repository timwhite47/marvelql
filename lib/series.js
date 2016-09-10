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

var Series = function () {
  _createClass(Series, null, [{
    key: 'all',
    value: function all() {
      var cacheKey = 'events:all';
      return (0, _marvel.cacheFetch)(cacheKey, function () {
        return _marvel2.default.series.findAll().then(_api_helpers.parseCollection);
      });
    }
  }, {
    key: 'find',
    value: function find(id) {
      var cacheKey = 'events:' + id;
      return (0, _marvel.cacheFetch)(cacheKey, function () {
        return _marvel2.default.series.find(id).then(_api_helpers.parseObject);
      });
      return _marvel2.default.series.find(id).then(_api_helpers.parseObject);
    }
  }]);

  function Series(data) {
    _classCallCheck(this, Series);

    this.data = data;
  }

  _createClass(Series, [{
    key: 'comics',
    value: function comics() {
      return this._fetchCollection('comics');
    }
  }, {
    key: 'events',
    value: function events() {
      return this._fetchCollection('events');
    }
  }, {
    key: 'stories',
    value: function stories() {
      return this._fetchCollection('stories');
    }
  }, {
    key: '_fetch',
    value: function _fetch(target) {
      var id = this.data.id;

      return _marvel2.default.series[target](id);
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

  return Series;
}();

exports.default = Series;