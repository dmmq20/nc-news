const {
  selectArticleById,
  selectArticles,
  selectArticleCommentsById,
  insertComment,
  updateArticle,
} = require("../models/articles.model");
const { selectTopicBySlug } = require("../models/topics.model");
const { checkExists } = require("./utils");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getAllArticles(req, res, next) {
  const { topic } = req.query;
  const promises = [selectArticles(topic)];
  if (topic) {
    promises.push(selectTopicBySlug(topic));
  }
  return Promise.all(promises)
    .then(([articles, _]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleCommentsById(req, res, next) {
  const { article_id } = req.params;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    selectArticleCommentsById(article_id),
  ])
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function addComment(req, res, next) {
  const { article_id } = req.params;
  const { body, username } = req.body;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    insertComment(body, username, article_id),
  ])
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function editArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return Promise.all([
    checkExists("articles", "article_id", article_id),
    updateArticle(article_id, inc_votes),
  ])
    .then(([_, article]) => {
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
