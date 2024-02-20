const {
  deleteComment,
  selectCommentById,
} = require("../models/comments.model");

function removeComment(req, res, next) {
  const { comment_id } = req.params;
  return Promise.all([selectCommentById(comment_id), deleteComment(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = { removeComment };
