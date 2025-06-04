const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool();

pool.query("SELECT current_database()", (err, res) => {
  if (err) {
    console.error("❌ DB Error:", err);
  } else {
    console.log("✅ Connected to DB:", res.rows[0].current_database);
  }
});

module.exports = pool;
