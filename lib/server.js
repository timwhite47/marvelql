'use strict';

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 4000;
var express = require('express');
var graphqlHTTP = require('express-graphql');
var app = express();

app.use('/graphql', graphqlHTTP({
  schema: _schema2.default,
  graphiql: true,
  formatError: function formatError(error) {
    console.log(error);
    return {
      message: error.message,
      locations: error.locations,
      stack: error.stack
    };
  }
}));

app.listen(PORT, function () {
  return console.log('ASSEMBLE!');
});