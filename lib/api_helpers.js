"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function parseCollection(response) {
  console.log(response.meta);
  return response.data;
}

function parseObject(response) {
  console.log(response.meta);
  return response.data[0];
}

exports.parseObject = parseObject;
exports.parseCollection = parseCollection;