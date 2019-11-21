const {handle405Errors} = require('../error-handler/error-handler')
const {updateVotesForComments, deleteCommentByCommentId} = require('../controllers/comments')
const commentsRouter = require("express").Router();
commentsRouter.route("/:comment_id").patch(updateVotesForComments).delete(deleteCommentByCommentId).all(handle405Errors)


module.exports = commentsRouter