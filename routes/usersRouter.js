const {getUserByUsername} = require('../controllers/users')
const {handle405Errors} = require('../error-handler/error-handler')
const usersRouter = require("express").Router();

usersRouter.route("/:username").get(getUserByUsername).all(handle405Errors)

module.exports = usersRouter;
