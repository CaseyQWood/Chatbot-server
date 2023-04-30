const { Configuration, OpenAIApi} = require("openai");
const { Moderator } = require("./moderator");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function CheckCharacters(str) {
let numOfChar = "";
let currentChar = "";
let numOpenBrackets = 0;
let i = 0;

while (i < str.length && numOpenBrackets < 2) {
  const currChar = str[i];

  if (currChar === "[") {
    numOpenBrackets++;

    if (numOpenBrackets === 1) {
      const start = i + 1;
      const end = str.indexOf("]", start);

      if (end > -1) {
        numOfChar = str.slice(start, end);
        i = end;
      }
    } else if (numOpenBrackets === 2) {
      const start = i + 1;
      const end = str.indexOf("]", start);

      if (end > -1) {
        currentChar = str.slice(start, end);
        break;
      }
    }
  }

  i++;
}

const newStr = str.replace("[" + numOfChar + "]", "").replace("[" + currentChar  + "]", "");

return {newStr, numOfChar, currentChar}
}

async function ChatGenerate(contextualPrompt) {
  //console.log("ChatGenerate: ", character)
  if (!contextualPrompt) return "please enter a valid prompt"

  //Moderator(contextualPrompt);
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages : contextualPrompt.promptContext,
  })

  let completionData = completion.data.choices[0].message

  return CheckCharacters(completionData.content).newStr

  //return completionData.content
  
}

module.exports = {ChatGenerate}