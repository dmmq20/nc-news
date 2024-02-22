const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
}

function insertTopic(slug, description) {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
      [slug, description]
    )
    .then(({ rows }) => rows[0]);
}

module.exports = { selectTopics, insertTopic };
