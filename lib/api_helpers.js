"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function parseCollection(response) {
  return response.data;
}

function parseObject(response) {
  return response.data[0];
}

exports.parseObject = parseObject;
exports.parseCollection = parseCollection;