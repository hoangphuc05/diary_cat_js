const mysql = require('mysql');
const {db_host, db_user, db_password, db_database} = require('../../config.json');

module.exports = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database,
});