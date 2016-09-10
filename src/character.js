import marvel from './marvel';
import Promise from 'bluebird';

import {
  range,
  flatten,
} from 'lodash';

const API_LIMIT = 25;
import { parseCollection, parseObject } from './api_helpers';

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
