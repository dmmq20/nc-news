const { selectTopics, insertTopic } = require("../models/topics.model");

function getTopics(req, res, next) {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function addTopic(req, res, next) {
  const { slug, description } = req.body;
  return insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = { getTopics, addTopic };
