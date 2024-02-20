const db = require("../db/connection");

function selectCommentById(id) {
  return db
    .query(
      `
    SELECT * FROM comments WHERE comment_id = $1
    `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows;
    });
}

function deleteComment(id) {
  return db.query(
    `
    DELETE FROM comments WHERE comment_id = $1;
    `,
    [id]
  );
}

module.exports = { deleteComment, selectCommentById };
