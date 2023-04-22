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

const SaveWinner = async (id, winner) => {
  console.log("saveWinner: inside", id, " : " , winner)
  const winnerContext = await pool.query(`
    SELECT message FROM messages
    WHERE id = $1;
    `, [id]
  );

  const winnerJson = JSON.stringify({winner: winner, promptContext: winnerContext.rows[0].message.promptContext});

  const response = await pool.query(`
    INSERT INTO answers (id, answer)
    VALUES (NEXTVAL('answers_id_seq'), $1)
    RETURNING id ;`, [winnerJson]);
}
module.exports = {UpdateDB, NewInstance, SaveWinner}