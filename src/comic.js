import marvel from './marvel';
import { parseCollection, parseObject } from './api_helpers';

export default class Comic {
  static all() {
    return marvel.events.findAll().then(parseCollection);
  }

  static find(id) {
    return marvel.events.find(id).then(parseObject);
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

  _fetch(target) {
    const { id } = this.data;
    return marvel.comics[target](id);
  }

  _fetchCollection(target) {
    return this._fetch(target).then(parseCollection);

  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}
