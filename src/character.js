if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import Promise from 'bluebird';

import {
  range,
  flatten,
} from 'lodash';

const marvelApi = require('marvel-api');
const API_LIMIT = 25;

const {
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_PRIVATE_KEY,
} = process.env;

const marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY,
});

function parseCollection(response) {
  return response.data;
}

function parseObject(response) {
  return response.data[0];
}

class Character {
  static search(input) {
    return marvel.characters.findNameStartsWith(input).then(parseCollection);
  }

  static find(id) {
    return marvel.characters.find(id).then(parseObject);
  }

  static all({ limit }) {
    limit = limit || API_LIMIT;
    return Promise.map(range(limit / API_LIMIT), (offset) => marvel
      .characters.findAll(API_LIMIT, offset)
      .then(parseCollection))
      .then((responses) => flatten(responses).slice(0, limit));
  }

  constructor(data) {
    this.data = data;
  }

  fetchComics() {
    return marvel.characters.comics(this.data.id)
      .then(parseCollection);
  }
}

export default Character;
