const express = require("express");
const { getTopics } = require("./controller/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid url" });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});

module.exports = app;
