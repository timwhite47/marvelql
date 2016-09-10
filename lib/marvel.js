'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var _process$env = process.env;
var MARVEL_API_PUBLIC_KEY = _process$env.MARVEL_API_PUBLIC_KEY;
var MARVEL_API_PRIVATE_KEY = _process$env.MARVEL_API_PRIVATE_KEY;

var marvelApi = require('marvel-api');
var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

var redisCache = cacheManager.caching({
  store: redisStore,
  ttl: 60 * 60 * 24
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