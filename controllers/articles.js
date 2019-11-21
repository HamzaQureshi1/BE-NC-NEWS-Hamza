const { selectArticleByArticleId, changeVotes, fetchCommentsByArticleId, addCommentByArticleId, fetchAllArticles } = require("../models/articles");

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByArticleId(article_id)
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.updateVotes = (req,res,next) => {
const changes = (req.body)
const {article_id} = req.params
changeVotes(changes, article_id).then((article) => res.status(200).send({article})).catch(next)
}

exports.getCommentsByArticleId = (req,res,next) => {
  const {sort_by,order} = req.query
const {article_id} = req.params
fetchCommentsByArticleId(sort_by,order, article_id).then((comments) =>res.status(200).send({comments})).catch(next)
}

exports.postCommentByArticleId =(req,res,next) => {
  const {article_id} =req.params
  const {username, body} = req.body
  
  addCommentByArticleId(article_id, username, body)
    .then(comment => {
      
      res.status(201).send({ comment })
  
  
  })
    .catch(next);
}

exports.getAllArticles = (req,res,next) => {
  fetchAllArticles().then(articles => {
    res.status(200).send({articles})
  }).catch(next)
}