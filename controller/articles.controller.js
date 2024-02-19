const {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
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
  return selectArticleCommentsById(article_id)
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: "No comments available" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
}

module.exports = { getArticleById, getAllArticles, getArticleCommentsById };
