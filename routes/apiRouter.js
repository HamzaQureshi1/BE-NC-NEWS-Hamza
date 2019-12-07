const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { handle405Errors } = require("../error-handler/error-handler");
const { invalidRoute } = require("../error-handler/error-handler");
const {sendEndPoints} = require("../controllers/sendEndPoints")
apiRouter
  .route("/")
  .get(sendEndPoints)
  .all(handle405Errors);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
