const { getTopics } = require("../controllers/topics");
const {handle405Errors} = require('../error-handler/error-handler')
const topicsRouter = require("express").Router();


topicsRouter.route("/").get(getTopics).all(handle405Errors)

module.exports = topicsRouter;
