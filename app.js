const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getArticleById,
  getAllArticles,
  getArticleCommentsById,
  addComment,
  editArticle,
} = require("./controllers/articles.controller");
const {
  psqlErrors,
  customErrors,
  serverError,
  invalidRoute,
} = require("./middleware/errorHandlers");
const { removeComment } = require("./controllers/comments.controller");
const { getAllUsers } = require("./controllers/users.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", editArticle);

app.delete("/api/comments/:comment_id", removeComment);

app.all("*", invalidRoute);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverError);

module.exports = app;
