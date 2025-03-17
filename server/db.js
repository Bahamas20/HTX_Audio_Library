const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        CONSTRAINT users_email_key UNIQUE (email),
        CONSTRAINT users_username_key UNIQUE (username)
      );
    `);

    const adminPlainPassword = 'admin';
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(adminPlainPassword, salt);

    await client.query(`
      INSERT INTO public.users (username, email, password_hash) 
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING;
    `, ['admin', 'admin@example.com', adminPasswordHash]);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.audios (
        audio_id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        s3_url TEXT,
        CONSTRAINT audios_user_id_fkey FOREIGN KEY (user_id)
          REFERENCES public.users (user_id)
          ON UPDATE NO ACTION
          ON DELETE CASCADE
      );
    `);

  } finally {
    client.release();
  }
}

initializeDatabase().catch(err => console.error('Error initializing the database', err));

module.exports = pool;
