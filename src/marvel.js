if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const {
  MARVEL_API_PUBLIC_KEY,
  MARVEL_API_PRIVATE_KEY,
} = process.env;

const marvelApi = require('marvel-api');

const marvel = marvelApi.createClient({
  publicKey: MARVEL_API_PUBLIC_KEY,
  privateKey: MARVEL_API_PRIVATE_KEY,
});

export default marvel;
