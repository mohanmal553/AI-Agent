const axios = require("axios");

async function callModel(prompt) {

  const response = await axios.post(process.env.MODEL_API, {
    prompt: prompt
  });

  return response.data;
}

module.exports = { callModel };