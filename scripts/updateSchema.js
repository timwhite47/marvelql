#!/usr/bin/env babel-node

import fs from 'fs';
import path from 'path';
import Schema from '../lib/schema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

const JSON_SPACING = 2;

// Save JSON of full schema introspection for Babel Relay Plugin to use
graphql(Schema, introspectionQuery)
  .then((result) => {
    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, JSON_SPACING)
      );
    } else {
      fs.writeFileSync(
        path.join(__dirname, '../data/schema.json'),
        JSON.stringify(result, null, JSON_SPACING)
      );
    }
  })
  .then(() => {
    // Save user readable type system shorthand of schema

    fs.writeFileSync(
      path.join(__dirname, '../data/schema.graphql'),
      printSchema(Schema)
    );
  })
