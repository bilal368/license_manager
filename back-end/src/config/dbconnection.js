const mysql = require('mysql');
require('./env')
let db = {};
db = mysql.createPool({
	connectionLimit: 50,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	debug: false
});

module.exports = db;