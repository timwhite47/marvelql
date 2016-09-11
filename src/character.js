import marvel, { cacheFetch, cacheCollection } from './marvel';

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

  static all(args) {
    const cacheKey = `characters:all:${API_LIMIT}`;
    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.characters.findAll(limit, offset),
      args.first
    );
  }

  constructor(data) {
    this.data = data;
  }

  comics(args) {
    return this._fetchCollection('comics', { limit: args.first });
  }

  events(args) {
    return this._fetchCollection('events', { limit: args.first });
  }

  series(args) {
    return this._fetchCollection('series', { limit: args.first });
  }

  stories(args) {
    return this._fetchCollection('stories', { limit: args.first });
  }

  _fetch(target) {
    const { id } = this.data;
    const cacheKey = `characters:${id}:${target}`;

    return cacheFetch(cacheKey, () => marvel.characters[target](id));
  }

  _fetchCollection(target, args) {
    const { id } = this.data;
    const cacheKey = `characters:${id}:${target}`;

    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.characters[target](id, limit, offset),
      args.limit,
    );
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}

export default Character;
