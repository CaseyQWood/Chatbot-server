const { Configuration, OpenAIApi} = require("openai");
const { CreateModerationPrompt } = require("./moderators/createModerationPrompt");
const { HuffmanCompress } = require("./moderators/huffmansCompress");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



async function Moderator(contextualPrompt, privateData) {

  //console.log("Hufmans Compression: ", HuffmanCompress("This is just a test to cover a longer string that is maybe just a little better of a tes but there are a lot of letters in this string so it should be a good test.") );

  promptJson = JSON.stringify(CreateModerationPrompt(contextualPrompt.promptContext)) 
  
  const results = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages : contextualPrompt.promptContext,
  }).then((data) => {
    return data
  }).catch((err) => {
    console.log("error: ", err)
    return
  })

  if (results.data.choices[0]) //check returned data values
  console.log("results.data", results.data.choices[0].message.content)
  return contextualPrompt
}

module.exports = {Moderator}