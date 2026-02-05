const { Pool } = require("pg");
require("dotenv").config();

// Connect to database
const db = process.env.DB_URL
  ? new Pool({ connectionString: process.env.DB_URL })
  : new Pool(
      {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: "localhost",
        database: process.env.DB_NAME,
        port: 5432,
      },
      console.log(`Connected to the todolist_db database.`),
    );

db.connect();

module.exports = db;
