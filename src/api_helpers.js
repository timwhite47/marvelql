function parseCollection(response) {
  console.log(response.meta);
  return response.data;
}

function parseObject(response) {
  console.log(response.meta);
  return response.data[0];
}

export {
  parseObject,
  parseCollection,
};
