const connection = require("../db/connection");

exports.changeVotesByComments = (changes, comment_id) => {
  
  return connection
    .select("*")
    .from("comments")
    .where("comments.comment_id", "=", comment_id)
    .increment("votes", changes.inc_votes || 0)
    .returning("*")
    .then(comment => {
      
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error status 404`
        });
      } else return { comment: comment[0] };
    });
};

exports.removeComment = (comment_id) => {
  return connection.from("comments").where("comment_id", comment_id).del().then((response) => {
    if(!response) {
      return Promise.reject({status:404,
      msg:`Error status 404`})
    }
  })
}