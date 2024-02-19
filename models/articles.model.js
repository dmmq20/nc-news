const db = require("../db/connection");

function selectArticleById(id) {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function selectArticles() {
  return db
    .query(
      `
        SELECT articles.author, title, articles.article_id, slug AS topic, articles.created_at, 
        articles.votes, article_img_url, COUNT(comment_id) AS comment_count 
        FROM articles
        JOIN topics ON articles.topic = topics.slug
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id, title, slug
        ORDER BY created_at DESC;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
}

function selectArticleCommentsById(id) {
  let hasComments = false;
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        hasComments = true;
        return result;
      }
      return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
    })
    .then(({ rows }) => {
      if (hasComments) return rows;
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return [];
    });
}

function insertComment(body, author, id) {
  return db
    .query(
      `
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [body, author, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
  insertComment,
};
