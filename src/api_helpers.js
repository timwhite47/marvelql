function parseCollection(response) {
  return response.data;
}

function parseObject(response) {
  return response.data[0];
}

export {
  parseObject,
  parseCollection,
};
