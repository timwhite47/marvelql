'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marvel = require('./marvel');

var _marvel2 = _interopRequireDefault(_marvel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function () {
  _createClass(Event, null, [{
    key: 'all',
    value: function all() {
      return _marvel2.default.events.findAll();
    }
  }, {
    key: 'find',
    value: function find(id) {
      return _marvel2.default.events.find(id);
    }
  }]);

  function Event(data) {
    _classCallCheck(this, Event);

    this.data = data;
  }

  _createClass(Event, [{
    key: 'stories',
    value: function stories() {
      return this._fetch('stories');
    }
  }, {
    key: 'characters',
    value: function characters() {
      return this._fetch('characters');
    }
  }, {
    key: '_fetch',
    value: function _fetch(target) {
      var id = this.data.id;

      return _marvel2.default.events[target](id);
    }
  }]);

  return Event;
}();

exports.default = Event;