require("dotenv").config({ path: "../.env" });

const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export a promise-based connection for easier use
const db = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL pool:", err);
  } else {
    console.log("Successfully connected to MySQL pool.");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
