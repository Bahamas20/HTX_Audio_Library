const pool = require('../db'); 
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
  return await pool.query("SELECT * FROM users");
};

const getUserById = async (id) => {
  return await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
};

const getUserByUsername = async (username) => {
  return await pool.query("SELECT * FROM users WHERE username = $1", [username]);
};

const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt(10); 
  const passwordHash = await bcrypt.hash(password, salt); 
  return await pool.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, passwordHash]
  );
};

const updateUser = async (user_id, username, email, password) => {
  let query, params;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    query = `
      UPDATE users
      SET username = $1, email = $2, password_hash = $3
      WHERE user_id = $4
      RETURNING *`;
    params = [username, email, passwordHash, user_id];
  } else {
    query = `
      UPDATE users
      SET username = $1, email = $2
      WHERE user_id = $3
      RETURNING *`;
    params = [username, email, user_id];
  }

  return await pool.query(query, params);
};


const deleteUser = async (user_id) => {
  return await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [user_id]);
};

module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
