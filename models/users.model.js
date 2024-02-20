const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
}

module.exports = { selectAllUsers };
