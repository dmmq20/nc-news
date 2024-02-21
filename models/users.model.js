const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
}

function selectUserByUsername(username) {}

module.exports = { selectAllUsers, selectUserByUsername };
