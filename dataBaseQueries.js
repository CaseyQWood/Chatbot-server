const { Pool } = require('pg');
require('dotenv').config();
const preContext = require('./prompts/preContexts.js');
const dennisNedryCheeky = require('./prompts/nedry.js');
const {createDennis} = require('./prompts/DennisNedry.js');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

const NewInstance = async (color) => {
  const promptJson = JSON.stringify({promptContext: createDennis(color)});

  // updating the database with the new prompt context and returning the id
  const response = await pool.query(`
    INSERT INTO messages (id, message)
    VALUES (NEXTVAL('messages_id_seq'), $1)
    RETURNING id ;`, [promptJson]);
    
    return response.rows[0]; 
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

const SaveWinner = async (id, username) => {
  console.log("Inside SaveWinner: ", id, username)
  const context = await pool.query(`
    SELECT message FROM messages
    WHERE id = $1;
    `, [id]
  );

  let winnerContext = context.rows[0].message.promptContext;

  const promptLength = Math.ceil((winnerContext.length - 6) / 2);
  const winnerJson = JSON.stringify({promptContext: winnerContext});

  console.log("promptLength: ", promptLength, username)
  const response = await pool.query(`
    INSERT INTO answers (id, answer, number_of_prompts, user_name)
    VALUES (NEXTVAL('answers_id_seq'), $1, $2, $3)
    RETURNING id ;`, [winnerJson, promptLength, username]);
}

const GetTopWinners = async () => {
  console.log("Inside DB Query")
  const response = await pool.query(`
    SELECT id, number_of_prompts, user_name FROM answers
    WHERE number_of_prompts > 0
    ORDER BY number_of_prompts DESC
    LIMIT 10;
  `);

  return response;
}
module.exports = {UpdateDB, NewInstance, SaveWinner, GetTopWinners}