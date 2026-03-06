function fakeEmbedding(text) {
  const arr = Array(384).fill(0).map(() => Math.random());
  return arr;
}

module.exports = { fakeEmbedding };