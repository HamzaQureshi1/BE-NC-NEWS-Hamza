const connection = require('../db/connection')



exports.selectArticleByArticleId = (article_id) =>{
    // return connection
    //   .select("*")
    //   .from("articles")
    //   .count({ comment_count: "comment_id" })
    //   .leftJoin("comments", "articles.article_id", "comments.article_id")
    //   .groupBy("articles.article_id")
    //   .where({})
    //   .then(() => {

    //     console.log("hi");
    //   })
    //   // .catch(console.log)
    //   // .where("articles.article_id", "=", article_id)
    //   // .returning("*")
    //   // .then(article => {
    //     //   console.log(article, "hi");
    //     //}
    //   //);

    
  
    
    return connection
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comments.comments_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .where("articles.article_id", "=", article_id ).returning('*')
      .then(articles => {
        
        
        if (articles.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `Error status 404`
          });
        } else {
          return articles ;
        }
      });
  
    
}

  




