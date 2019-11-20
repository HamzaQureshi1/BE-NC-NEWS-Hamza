const { getArticleByArticleId, updateVotes } = require("../controllers/articles");
const { handle405Errors } = require("../error-handler/error-handler");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId).patch(updateVotes)
  .all(handle405Errors);

module.exports = articlesRouter;
