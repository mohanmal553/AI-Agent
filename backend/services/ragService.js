const client = require("../config/chroma");
const { fakeEmbedding } = require("./embeddingService");

async function retrieveContext(question) {

  const collection = await client.getOrCreateCollection({
    name: "university_docs"
  });

  const embedding = fakeEmbedding(question);

  const result = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 3
  });

  return result.documents.flat().join("\n");
}

module.exports = { retrieveContext };