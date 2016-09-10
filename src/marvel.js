if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const {
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_PRIVATE_KEY,
} = process.env;

const marvelApi = require('marvel-api');
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis');

const redisCache = cacheManager.caching({
  store: redisStore,
  ttl: (60 * 60 * 24)
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
