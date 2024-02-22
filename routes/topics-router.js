const { getTopics, addTopic } = require("../controllers/topics.controller");

const topicRouter = require("express").Router();

topicRouter.get("/", getTopics);

topicRouter.post("/", addTopic);

module.exports = topicRouter;
