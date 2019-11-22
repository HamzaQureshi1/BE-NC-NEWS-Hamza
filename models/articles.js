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
      } else return { articles: articles[0] };
    });
};

exports.fetchCommentsByArticleId = (sort_by, order, article_id) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      return comments;
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  return connection
    .insert({ body: body, author: username, article_id: article_id })
    .into("comments")
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

exports.fetchAllArticles = (sort_by, order, author, topic) => {
  console.log(author)
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "articles.title",
      "articles.topic",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comments.comments_id" })
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) {
        query.where("articles.author", "=", author);
      }
      if (topic) {
        query.where("articles.topic", "=", topic);
      }
    })
    .then(articles => {
      return (articles) ;
    });
};
