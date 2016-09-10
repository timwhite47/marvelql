'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marvel = require('./marvel');

var _marvel2 = _interopRequireDefault(_marvel);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _api_helpers = require('./api_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_LIMIT = 25;

var Character = function () {
  _createClass(Character, null, [{
    key: 'search',
    value: function search(input) {
      return _marvel2.default.characters.findNameStartsWith(input).then(_api_helpers.parseCollection);
    }
  }, {
    key: 'find',
    value: function find(id) {
      return _marvel2.default.characters.find(id).then(_api_helpers.parseObject);
    }
  }, {
    key: 'all',
    value: function all(_ref) {
      var limit = _ref.limit;

      limit = limit || API_LIMIT;
      return _bluebird2.default.map((0, _lodash.range)(limit / API_LIMIT), function (offset) {
        return _marvel2.default.characters.findAll(API_LIMIT, offset).then(_api_helpers.parseCollection);
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
      return _marvel2.default.characters.comics(this.data.id).then(_api_helpers.parseCollection);
    }
  }]);

  return Character;
}();

exports.default = Character;