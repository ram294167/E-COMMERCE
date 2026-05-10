// db.js - PostgreSQL Connection Pool
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('✅ Database connected successfully!');
    console.log(`📊 Connected to ${process.env.DB_NAME || 'ecommerce_db'}`);
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

function formatQuery(query, params = []) {
    let index = 0;
    const formattedQuery = query.replace(/\?/g, () => `$${++index}`);
    return { text: formattedQuery, values: params };
}

module.exports = {
    query: (text, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }

        const { text: formattedText, values } = formatQuery(text, params || []);
        if (typeof callback === 'function') {
            return pool.query(formattedText, values, (err, result) => {
                if (err) return callback(err);
                callback(null, result.rows);
            });
        }

        return pool.query(formattedText, values).then((result) => result.rows);
    },
    pool
};
