const {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
  insertComment,
  updateArticle,
} = require("../models/articles.model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getAllArticles(req, res, next) {
  return selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleCommentsById(req, res, next) {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then(() => {
      return selectArticleCommentsById(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function addComment(req, res, next) {
  const { article_id } = req.params;
  const { body, username } = req.body;
  return selectArticleById(article_id)
    .then(() => {
      return insertComment(body, username, article_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function editArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return selectArticleById(article_id)
    .then(() => {
      return updateArticle(article_id, inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  addComment,
  editArticle,
};
