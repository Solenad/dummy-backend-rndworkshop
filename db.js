import mysql from "mysql2/promise";
import "dotenv/config";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to the MySQL database!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err.message);
  });

export default pool;
