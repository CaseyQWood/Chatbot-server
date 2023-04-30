const {ChatGenerate} = require('./chatGeneration.js') 
const {UpdateDB, NewInstance, SaveWinner, GetTopWinners, GetCharacters, UpdateCharacters} = require('./dataBaseQueries.js')
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
require('dotenv').config()

app.use(cors())

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library

app.post('/newSession', cors(), (req, res) => {
  console.log("Inside newSession route: ", req.body)
  res.setHeader('Access-Control-Allow-Origin', '*');

  NewInstance(req.body.character).then((data) => {
    return res.send({data: data});
  }).catch((err) => {
    console.log("error: ", err)
    return
  })
})

app.post("/winners", cors(), (req, res) => {
  GetTopWinners(req.body.character).then((data) => {
    return res.send({data: data.rows});
  }).catch((err) => {
    console.log("error: ", err)
    return
  })
})

app.post('/saveWinner', cors(), (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  SaveWinner(req.body.id, req.body.username).then((data) => {
    return res.send({data: data});
  }).catch((err) => {
    console.log("error: ", err)
    return
  })
})

app.post('/generate', cors(), (req, res, next) => {
  const sessionID = req.body.id;
  const newPrompt = {role: "user", content: req.body.prompt};

  let promptContext;

  UpdateDB(sessionID, newPrompt).then((data) => {
    promptContext = data.rows[0].message.promptContext;
    
    ChatGenerate({promptContext}).then((data) => {
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

app.get('/hello', (req, res) => {
  console.log("hello-World")
  return res.send('Hello World!')
})

app.get("/characters", cors(), (req, res) => {
  
  GetCharacters().then((data) => {
    return res.send({data: data.rows});
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