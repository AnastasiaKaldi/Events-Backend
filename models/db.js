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

module.exports = pool;
