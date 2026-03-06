const { ChromaClient } = require("chromadb");

const client = new ChromaClient({
  path: process.env.CHROMA_URL
});

module.exports = client;