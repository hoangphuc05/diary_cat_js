const mysql = require('mysql2');
const { db_host, db_username, db_password, db_database } = require('./../config.json');

const connection_error = {
    'PROTOCOL_CONNECTION_LOST': 'Database connection was closed.',
    'ER_CON_COUNT_ERROR': 'Database has too many connections.',
    'ECONNREFUSED': 'Database connection was refused.'
}
const pool = mysql.createPool({
    host: db_host,
    user: db_username,
    password: db_password,
    database: db_database,
});


const getAllUsers = () => {
    return pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                // console.error(connection_error[err]);
            }
            connection.query('SELECT * FROM last_time', (err, rows) => {
                if (err) {
                    console.error(err);
                }
                return rows;
            });
        }
    );
}


module.exports = {getAllUsers};