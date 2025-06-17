// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '1909123467@ram',
    database: process.env.DB_NAME || 'ram',
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
    console.log("✅ Database connected successfully!");
});

module.exports = connection;
