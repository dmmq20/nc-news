const {
  getAllArticles,
  getArticleById,
  getArticleCommentsById,
  addComment,
  editArticle,
  addArticle,
  removeArticle,
} = require("../controllers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getAllArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getArticleCommentsById);

articleRouter.post("/:article_id/comments", addComment);
articleRouter.post("/", addArticle);

articleRouter.patch("/:article_id", editArticle);

articleRouter.delete("/:article_id", removeArticle);

module.exports = articleRouter;
