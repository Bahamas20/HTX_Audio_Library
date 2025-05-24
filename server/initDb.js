const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function shouldInitDb() {
  const result = await pool.query("SELECT to_regclass('public.users')");
  return result.rows[0].to_regclass === null;
}

async function runInitScript() {
  const shouldInit = await shouldInitDb();
  if (!shouldInit) {
    console.log("✅ Tables already exist. Skipping DB init.");
    return;
  }

  const initSqlPath = path.join(__dirname, 'docker-init', 'init.sql');
  const initSql = fs.readFileSync(initSqlPath, 'utf-8');

  try {
    await pool.query(initSql);
    console.log("✅ Database initialized.");
  } catch (err) {
    console.error("❌ DB Init Error:", err.message);
  }
}

module.exports = runInitScript;
