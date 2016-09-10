import marvel, { cacheFetch } from './marvel';
import { parseCollection, parseObject } from './api_helpers';

export default class Event {
  static all() {
    const cacheKey = 'events:all';
    return cacheFetch(cacheKey, () => marvel.events.findAll().then(parseCollection));
  }

  static find(id) {
    const cacheKey = `events:${id}`;
    return cacheFetch(cacheKey, () => marvel.events.find(id).then(parseObject));
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

  comics() {
    return this._fetchCollection('comics');
  }

  creators() {
    return this._fetchCollection('creators');
  }

  series() {
    return this._fetchCollection('series');
  }

  stories() {
    return this._fetchCollection('stories');
  }

  _fetch(target) {
    const { id } = this.data;
    const cacheKey = `events:${id}:${target}`;
    return cacheFetch(cacheKey, () => marvel.events[target](id));
  }

  _fetchCollection(target) {
    return this._fetch(target).then(parseCollection);
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}
