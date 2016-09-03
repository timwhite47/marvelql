import Schema from './schema';

const PORT = 4000;
const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true,
}));

app.listen(PORT, () => console.log('ASSEMBLE!'));
