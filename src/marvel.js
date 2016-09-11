import { parseCollection } from './api_helpers';
import dotEnv from 'dotenv';
import Promise from 'bluebird';
import { flatten, range } from 'lodash';
if (process.env.NODE_ENV !== 'production') { dotEnv.config(); }

const API_LIMIT = 25;
const HOURS = 24;
const MINUTES = 60;
const SECONDS = 60;

const {
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_PRIVATE_KEY,
} = process.env;

const marvelApi = require('marvel-api');
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis');

const redisCache = cacheManager.caching({
  store: redisStore,
  ttl: (SECONDS * MINUTES * HOURS),
});

const marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY,
});

export default marvel;

export const cacheFetch = (key, fetcher) => {
  console.log(`Fetching: ${key}`);
  return redisCache.wrap(key, fetcher);
};

export const cacheCollection = (key, fetcher) => {
  let offset = 0;

  const limit = API_LIMIT;
  return cacheFetch(key, () => fetcher({ limit, offset }).then(({ meta }) => {

    const pages = range(meta.total / API_LIMIT);

    return Promise.map(pages, (pageNumber) => {
      offset = pageNumber * API_LIMIT;

      return fetcher({ offset, limit }).then(parseCollection);
    });
  })).then((response) => flatten(response));

};
