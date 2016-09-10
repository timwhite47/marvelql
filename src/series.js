import marvel from './marvel';
import { parseCollection, parseObject } from './api_helpers';

export default class Series {
  static all() {
    return marvel.series.findAll().then(parseCollection);
  }

  static find(id) {
    return marvel.series.find(id).then(parseObject);
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

  stories() {
    return this._fetchCollection('stories');
  }

  _fetch(target) {
    const { id } = this.data;
    return marvel.series[target](id);
  }

  _fetchCollection(target) {
    return this._fetch(target).then(parseCollection);
  }

  _fetchObject(target) {
    return this._fetch(target).then(parseObject);
  }
}
