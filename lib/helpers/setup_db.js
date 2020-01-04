const pg = require('pg');

const getDB = () => {
    const pool = new pg.Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT)
    });
    return pool;
}

module.exports = getDB;
