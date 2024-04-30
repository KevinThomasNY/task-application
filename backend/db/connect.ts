import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: 'testDb',
    connectionLimit: 10,
})

export default pool;