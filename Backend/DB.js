import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Adjust the path if needed

import pkg from "pg";
const { Pool } = pkg;

// Create a new Pool using the DATABASE_URL from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: Test the database connection on startup
pool.connect().catch((err) => {
  console.error("Database connection error:", err);
});

export default pool;