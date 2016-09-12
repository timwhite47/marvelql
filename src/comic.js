import marvel, { cacheCollection, cacheFetch } from './marvel';
import { parseCollection, parseObject } from './api_helpers';

export default class Comic {
  static all() {
    const cacheKey = 'comics:all';
    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.comics.findAll(limit, offset)
    );
  }

  static find(id) {
    const cacheKey = `comics:${id}`;
    return cacheFetch(cacheKey, () => marvel.comics.find(id).then(parseObject));
  }

  constructor(data) {
    this.data = data;
  }

  stories(args) {
    return this._fetchCollection('stories', args);
  }

  characters(args) {
    return this._fetchCollection('characters', args);
  }

  series() {
    return this._fetchObject('series');
  }

  _fetch(target) {
    const { id } = this.data;
    const cacheKey = `comics:${id}:${target}`;

    return cacheFetch(cacheKey, () => marvel.comics[target](id));
  }

  _fetchCollection(target, args) {
    const { id } = this.data;
    const cacheKey = `comics:${id}:${target}`;

    return cacheCollection(cacheKey, ({ limit, offset }) =>
      marvel.comics[target](id, limit, offset),
      args.limit,
    );
  }


  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}
