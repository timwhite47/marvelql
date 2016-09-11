'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheCollection = exports.cacheFetch = undefined;

var _api_helpers = require('./api_helpers');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
  _dotenv2.default.config();
}

var API_LIMIT = 25;
var HOURS = 24;
var MINUTES = 60;
var SECONDS = 60;

var _process$env = process.env;
var MARVEL_API_PUBLIC_KEY = _process$env.MARVEL_API_PUBLIC_KEY;
var MARVEL_API_PRIVATE_KEY = _process$env.MARVEL_API_PRIVATE_KEY;

var marvelApi = require('marvel-api');
var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

var redisCache = cacheManager.caching({
  store: redisStore,
  ttl: SECONDS * MINUTES * HOURS
});

var marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY
});

exports.default = marvel;
var cacheFetch = exports.cacheFetch = function cacheFetch(key, fetcher) {
  console.log('Fetching: ' + key);
  return redisCache.wrap(key, fetcher);
};

var cacheCollection = exports.cacheCollection = function cacheCollection(key, fetcher, expectedLimit) {
  console.log('expectedLimit', expectedLimit);
  return cacheFetch(key, function () {
    return fetcher({ limit: 1, offset: 0 });
  }).then(function (_ref) {
    var meta = _ref.meta;

    var pages = undefined;

    if (expectedLimit) {
      pages = (0, _lodash.range)(expectedLimit / API_LIMIT);
    } else {
      pages = (0, _lodash.range)(meta.total / API_LIMIT);
    }

    return _bluebird2.default.map(pages, function (pageNumber) {
      var offset = pageNumber * API_LIMIT;

      return cacheFetch(key + ':' + offset, function () {
        return fetcher({ offset: offset, limit: API_LIMIT }).then(_api_helpers.parseCollection);
      });
    }).then(function (response) {
      return (0, _lodash.flatten)(response);
    });
  });
};