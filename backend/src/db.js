const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "app_a_db",
  user: process.env.DB_USER || "sso_admin",
  password: process.env.DB_PASSWORD || "sso_password",
});

// Initialize database tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        keycloak_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("❌ Database init error:", err.message);
  }
}

module.exports = { pool, initDB };