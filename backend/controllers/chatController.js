const { retrieveContext } = require("../services/ragService");
const { callModel } = require("../services/modelService");

async function chat(req, res) {

  try {

    const { question } = req.body;

    const context = await retrieveContext(question);

    const prompt = `
Use the context to answer.

Context:
${context}

Question:
${question}
`;

    const answer = await callModel(prompt);

    res.json({
      question,
      context,
      answer
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { chat };