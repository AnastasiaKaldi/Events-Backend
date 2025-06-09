const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT current_database()", (err, res) => {
  if (err) {
    console.error("❌ Could not connect to database:", err);
  } else {
    console.log("✅ Connected to DB:", res.rows[0].current_database);
  }
});

async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function markUserVerified(userId) {
  return db.query("UPDATE users SET is_verified = 1 WHERE id = ?", [userId]);
}

module.exports = {
  pool,
  getUserByEmail,
};
