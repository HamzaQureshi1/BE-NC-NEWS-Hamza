const { getArticleByArticleId, updateVotes, getCommentsByArticleId,postCommentByArticleId, getAllArticles } = require("../controllers/articles");
const { handle405Errors } = require("../error-handler/error-handler");
const articlesRouter = require("express").Router();


articlesRouter.route("/").get(getAllArticles).all(handle405Errors)

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId).patch(updateVotes)
  .all(handle405Errors);

  articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentByArticleId).all(handle405Errors)

module.exports = articlesRouter;
