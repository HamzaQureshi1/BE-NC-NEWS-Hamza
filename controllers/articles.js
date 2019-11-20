const { selectArticleByArticleId, changeVotes } = require("../models/articles");

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id)
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.updateVotes = (req,res,next) => {
const changes = (req.body)
const {article_id} = req.params
changeVotes(changes, article_id).then(article => res.status(200).send({article})).catch(next)
}