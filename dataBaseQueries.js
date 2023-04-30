const { Pool } = require('pg');
require('dotenv').config();
const preContext = require('./prompts/preContexts.js');
const dennisNedryCheeky = require('./prompts/nedry.js');
const {createDennis} = require('./prompts/DennisNedry.js');
const {LoopBackPrompt} = require('./prompts/loopBack.js');
const {BrennanPrompt} = require('./prompts/Brennan.js');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

const NewInstance = async (name) => {
  console.log("NewInstance name: ", name)
  const response1 = await pool.query(`
    SELECT * FROM characters
    WHERE name = $1;
    `, [name]
  ); 

  //console.log("response1 TEST: ", response1.rows[0])
  const promptJson = JSON.stringify({promptContext: response1.rows[0].context.promptContext});

  // updating the database with the new prompt context and returning the id
  const response2 = await pool.query(`
    INSERT INTO messages (id, message, character, fav_color)
    VALUES (NEXTVAL('messages_id_seq'), $1, $2, $3)
    RETURNING id, fav_color ;`, [promptJson, name, response1.rows[0].fav_color]);
    
    return response2.rows[0]; 
}

const UpdateDB = async (id, message) => {
  const currentContext = await pool.query(
    `
    SELECT message FROM messages 
    WHERE id = $1;
    `,
    [id]
  );

  let newContext = currentContext.rows[0].message.promptContext
  newContext.push(message);

  // query takes in one object with two keys, text and values [{"promptContext": var}, int]
  const response = await pool.query(`
    UPDATE messages
    SET message = $1
    WHERE id = $2
    RETURNING * ;
  `, [{"promptContext": newContext}, id]);

  return response;
}

const SaveWinner = async (id, username, character) => {
  const context = await pool.query(`
    SELECT message FROM messages
    WHERE id = $1;
    `, [id]
  );

  let winnerContext = context.rows[0].message.promptContext;

  const promptLength = Math.ceil((winnerContext.length - 6) / 2);
  const winnerJson = JSON.stringify({promptContext: winnerContext});

  const response = await pool.query(`
    INSERT INTO answers (id, answer, number_of_prompts, user_name, character)
    VALUES (NEXTVAL('answers_id_seq'), $1, $2, $3, $4)
    RETURNING id ;`, [winnerJson, promptLength, username, character]);
}

const GetTopWinners = async (character) => {
  const response = await pool.query(`
    SELECT id, number_of_prompts, user_name, character FROM answers
    WHERE number_of_prompts > 0 AND character = $1
    ORDER BY number_of_prompts DESC
    LIMIT 10;
    `, [character]
  );

  return response;
}

const GetCharacters = async () => {
  const response = await pool.query(`
    SELECT name FROM characters
  `);

  return response;
}

const UpdateCharacters = async () => {
  const color = "turquise";
 let character = {promptContext: BrennanPrompt(color)};
  
  const response = await pool.query(`
    INSERT INTO characters
    (id, context, name, fav_color)
    VALUES (NEXTVAL('messages_id_seq'), $1, $2, $3)
    RETURNING *;
  `, [character, "Brennan", color]);

  return response;
}

module.exports = {UpdateDB, NewInstance, SaveWinner, GetTopWinners, GetCharacters, UpdateCharacters}