import marvel, { cacheFetch } from './marvel';
import { parseCollection, parseObject } from './api_helpers';

export default class Comic {
  static all() {
    const cacheKey = 'comics:all';
    return cacheFetch(cacheKey, () => marvel.comics.findAll().then(parseCollection));
  }

  static find(id) {
    const cacheKey = `comics:${id}`;
    return cacheFetch(cacheKey, () => marvel.comics.find(id).then(parseObject));
  }

  constructor(data) {
    this.data = data;
  }

  stories() {
    return this._fetchCollection('stories');
  }

  characters() {
    return this._fetchCollection('characters');
  }

  series() {
    return this._fetchObject('series');
  }

  _fetch(target) {
    const { id } = this.data;
    const cacheKey = `characters:${id}:${target}`;

    return cacheFetch(cacheKey, () => marvel.comics[target](id));
  }

  _fetchCollection(target) {
    return this._fetch(target).then(parseCollection);
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}
