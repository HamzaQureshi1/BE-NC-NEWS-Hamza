const connection = require("../db/connection");

exports.selectArticleByArticleId = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comments_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .returning("*")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error status 404`
        });
      } else {
        return articles;
      }
    });
};

exports.changeVotes = (changes, article_id) => {
  console.log(changes);
  return connection
    .select("*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .increment("votes", changes.inc_votes || 0)
    .returning("*")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error status 404`
        });
      } else return {articles: articles[0]}
    });
};

exports.fetchCommentsByArticleId = (sort_by, order, article_id) => {return connection.select('*').from("comments").where("comments.article_id", "=", article_id).orderBy(sort_by || 'created_at', order).then(comments =>{return comments})
  
}

exports.addCommentByArticleId = (article_id, username, body) => {
  
return connection.insert({body:body, author:username, article_id:article_id}).into("comments").returning('*').then(
  
  
  
  ([comment]) => {return comment}
  
  
  )
  
      
        
}