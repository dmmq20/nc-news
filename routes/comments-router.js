const {
  removeComment,
  editComment,
} = require("../controllers/comments.controller");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", removeComment);
commentRouter.patch("/:comment_id", editComment);

module.exports = commentRouter;
