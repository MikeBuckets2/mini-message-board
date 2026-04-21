const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query(
    "SELECT * FROM messages ORDER BY added DESC"
  );
  return rows;
}

async function getMessageById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createMessage(text, username) {
  const { rows } = await pool.query(
    "INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING *",
    [text, username]
  );
  return rows[0];
}

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
};