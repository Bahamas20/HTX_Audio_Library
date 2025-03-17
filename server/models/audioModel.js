const pool = require('../db');

const getAudiosByUser = async (user_id) => {
  return await pool.query(
    "SELECT * FROM audios WHERE user_id = $1",
    [user_id]
  );
};

const getAudioById = async (audio_id, user_id) => {
  return await pool.query(
    "SELECT * FROM audios WHERE audio_id = $1 AND user_id = $2",
    [audio_id, user_id]
  );
};

const createAudio = async (user_id, title, description, s3_url) => {
  return await pool.query(
    `INSERT INTO audios (user_id, title, description, s3_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, title, description, s3_url]
  );
};

const deleteAudio = async (audio_id, user_id) => {

  return await pool.query(
    "DELETE FROM audios WHERE audio_id = $1 AND user_id = $2 RETURNING *",
    [audio_id, user_id]
  );
};

module.exports = {
  getAudiosByUser,
  getAudioById,
  createAudio,
  deleteAudio,
};
