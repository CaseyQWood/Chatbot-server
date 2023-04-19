const { Configuration, OpenAIApi} = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function ChatGenerate(contextualPrompt) {
  if (!contextualPrompt) return "please enter a valid prompt"

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages : contextualPrompt,
  });

  return completion.data.choices[0].message.content
}

module.exports = {ChatGenerate}