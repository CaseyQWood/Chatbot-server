const {ChatGenerate} = require('./chatGeneration.js') 
const {UpdateDB, NewInstance} = require('./dataBaseQueries.js')
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
require('dotenv').config()
//const { response } = require('express');

//app.use(cors());
app.use(cors())

app.use(express.json()); // Used to parse JSON bodies
//app.use(express.urlencoded()); // Parse URL-encoded bodies using query-string library
// or
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library



app.get('/newSession', cors(), (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("new session")
  
  NewInstance().then((data) => {
    console.log("data: ", data)
    return res.send({data: data});
  }).catch((err) => {
    console.log("error: ", err)
    return
  })
})

app.get('/hello', (req, res) => {
  console.log("hello-World")
  return res.send('Hello World!')
})

app.post('/generate', cors(), (req, res, next) => {
  const sessionID = req.body.id;
  const newPrompt = {role: "user", content: req.body.prompt};
  let promptContext;

  UpdateDB(sessionID, newPrompt).then((data) => {
    promptContext = data.rows[0].message.promptContext;

    ChatGenerate(promptContext).then((data) => {
      let newResponse = {role: "assistant", content: generatePrompt(data)};

      UpdateDB(sessionID, newResponse).then((data) => {    
        res.setHeader('Access-Control-Allow-Origin', '*');    
        return res.send({data: data.rows[0].message.promptContext.at(-1)});
      })}).catch((err) => {
        console.log("error: ", err)
        return
      }
    );
  }).catch((err) => {
    console.log("error: ", err)
    return
  })
})

app.listen(process.env.PORT, host, (err) => {
 if (err) console.log("err: ", err)
  console.log(`Example app listening on port ${port}`)
})

function generatePrompt(prompt) {
  const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
  return `${capitalizedPrompt}.`;
}