const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const { getEndpoints } = require("./controller/api.controller");
const {
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  addComment,
} = require("./controller/articles.controller");
const {
  psqlErrors,
  customErrors,
  serverError,
  invalidRoute,
} = require("./middleware/errorHandlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.post("/api/articles/:article_id/comments", addComment);

app.all("*", invalidRoute);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
