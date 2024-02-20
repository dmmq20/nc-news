const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
}

function selectTopicBySlug(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
      return rows;
    });
}

module.exports = { selectTopics, selectTopicBySlug };
