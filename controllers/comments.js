const {changeVotesByComments, removeComment} = require('../models/comments')

exports.updateVotesForComments = (req,res,next) => {
const changes = (req.body)

const {comment_id} = req.params
  changeVotesByComments(changes, comment_id).then((comment) => res.status(200).send(comment)).catch(next)
}

exports.deleteCommentByCommentId = (req,res,next) => {
const {comment_id} =req.params
  removeComment(comment_id).then(()=>res.sendStatus(204)).catch(next)
}
