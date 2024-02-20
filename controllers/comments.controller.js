const { deleteComment } = require("../models/comments.model");
const { checkExists } = require("./utils");

function removeComment(req, res, next) {
  const { comment_id } = req.params;
  return Promise.all([
    checkExists("comments", "comment_id", comment_id),
    deleteComment(comment_id),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = { removeComment };
