const util = require('util');
const mysql = require('mysql');

const getDB = () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
        timeout: parseInt(process.env.DB_TIMEOUT)
    });
    // promisify common operations
    return {
        query(sql, args) {
            return util.promisify(pool.query).call(pool, sql, args);
        },
        end() {
            return util.promisify(pool.end).call(pool);
        }
    }
}

module.exports = getDB;
