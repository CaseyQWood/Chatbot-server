const { Configuration, OpenAIApi} = require("openai");
const { CreateModerationPrompt } = require("./moderators/createModerationPrompt");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



async function Moderator(contextualPrompt, privateData) {

  let prompt = CreateModerationPrompt(contextualPrompt.promptContext,)
  
  console.log("Moderator Prompt: ", prompt)
  console.log("Moderator Prompt Context: ", contextualPrompt.promptContext)
  const results = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages : prompt,
  }).then((data) => {
    console.log("Moderator Respose: ", data.data.choices[0].message.content)
    return data
  }).catch((err) => {
    console.log("error: ", err)
    return
  })

  //if (results.data)   console.log("results.data", results.data.choices[0].message.content)
  //check returned data values
  return contextualPrompt
}

module.exports = {Moderator}