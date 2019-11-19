const { getArticleByArticleId } = require("../controllers/articles");
const { handle405Errors } = require("../error-handler/error-handler");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .all(handle405Errors);

module.exports = articlesRouter;
