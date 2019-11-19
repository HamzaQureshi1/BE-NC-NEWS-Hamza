const connection = require('../db/connection')

exports.selectArticleByArticleId =(article_id)=>{
  console.log('in the model')
return connection("articles")
  .where("article_id", article_id)
  .then(article => {
    
    
    if (article.length === 0 ) {
      return Promise.reject({
        status: 404,
        msg: "Error status 404"
      });
    } else { console.log(article)
      return article;
    }
  });
  
}