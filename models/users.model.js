const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
}

function selectUserByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => rows[0]);
}

module.exports = { selectAllUsers, selectUserByUsername };
