const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const { endpoints } = require("./controller/api.controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controller/articles.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", endpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid url" });
  next();
});

app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});

module.exports = app;
