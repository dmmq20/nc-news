const db = require("../db/connection");

function selectArticleById(id) {
  return db
    .query(
      `
      select articles.*, CAST(COUNT(comment_id) as INTEGER) as comment_count from articles
      left join comments on articles.article_id = comments.article_id
      where articles.article_id = $1
      group by articles.article_id;
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

function selectArticles(topic) {
  let query = `
      SELECT articles.author, title, articles.article_id, articles.topic, 
      articles.created_at, articles.votes, article_img_url, 
      COUNT(comment_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryVals = [];
  if (topic) {
    query += ` WHERE articles.topic = $1`;
    queryVals.push(topic);
  }
  query += ` GROUP BY articles.article_id
            ORDER BY created_at DESC;`;
  return db.query(query, queryVals).then(({ rows }) => {
    return rows;
  });
}

function selectArticleCommentsById(id) {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [id]
    )
    .then(({ rows }) => rows);
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

function updateArticle(id, inc_votes) {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `,
      [inc_votes, id]
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
  updateArticle,
};
