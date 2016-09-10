import marvel from './marvel';

export default class Event {
  static all() {
    return marvel.events.findAll();
  }

  static find(id) {
    return marvel.events.find(id);
  }

  constructor(data) {
    this.data = data;
  }

  stories() {
    return this._fetch('stories');
  }

  characters() {
    return this._fetch('characters');
  }

  _fetch(target) {
    const { id } = this.data;
    return marvel.events[target](id);
  }
}
