import marvel, { cacheFetch, cacheCollection } from './marvel';
import Promise from 'bluebird';
import { range, flatten } from 'lodash';

const API_LIMIT = 100;
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

  static all() {
    const cacheKey = `characters:all:${API_LIMIT}`;
    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.characters.findAll(limit, offset)
    );
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
    const { id } = this.data;
    const cacheKey = `characters:${id}:${target}`;

    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.characters[target](id, limit, offset)
    );
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}

export default Character;
