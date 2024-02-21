const {
  getAllArticles,
  getArticleById,
  getArticleCommentsById,
  addComment,
  editArticle,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getAllArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getArticleCommentsById);

articleRouter.post("/:article_id/comments", addComment);

articleRouter.patch("/:article_id", editArticle);

module.exports = articleRouter;