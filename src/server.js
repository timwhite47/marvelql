import Schema from './schema';

const PORT = process.env.PORT || 4000;
const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true,
  formatError: (error) => {
    console.log(error);
    return {
      message: error.message,
      locations: error.locations,
      stack: error.stack
    }
  },
}));

app.listen(PORT, () => console.log('ASSEMBLE!'));
