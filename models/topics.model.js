const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
}

function selectTopicByWord(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Topic not found" });
      }
      return rows;
    });
}

module.exports = { selectTopics, selectTopicByWord };
