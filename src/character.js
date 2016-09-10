import marvel, { cacheFetch } from './marvel';
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
    return cacheFetch(`characters:${id}`,
      () => marvel.characters.find(id).then(parseObject)
    );
  }

  static all({ limit }) {
    limit = limit || API_LIMIT;

    return Promise.map(range(limit / API_LIMIT), (offset) => {
      const cacheKey = `characters:all:${API_LIMIT}:${offset}`;

      return cacheFetch(cacheKey, () => {
        return marvel
        .characters.findAll(API_LIMIT, offset)
        .then(parseCollection);
      });
    }).then((responses) => flatten(responses).slice(0, limit));
  }

  constructor(data) {
    this.data = data;
  }

  comics() {
    return this._fetchCollection('comics');
  }

  events() {
    return this._fetchCollection('events');
  }

  series() {
    return this._fetchCollection('series');
  }

  stories() {
    return this._fetchCollection('stories');
  }

  _fetch(target) {
    const { id } = this.data;
    const cacheKey = `characters:${id}:${target}`;

    return cacheFetch(cacheKey, () => marvel.characters[target](id));
  }

  _fetchCollection(target) {
    return this._fetch(target).then(parseCollection);
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}

export default Character;
