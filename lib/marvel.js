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

var marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY
});

exports.default = marvel;