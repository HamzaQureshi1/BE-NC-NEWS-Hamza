const connection = require("../db/connection");

exports.selectArticleByArticleId = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error status 404`
        });
      } else {
        return { article: article[0] };
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
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Error status 404`
        });
      } else return { article: article[0] };
    });
};

exports.fetchCommentsByArticleId = (sort_by, order, article_id) => {
  return connection
    .select(
      "comments.comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.author",
      "comments.body"
    )
    .from("comments")
    .where("comments.article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      if (comments.length < 1) {
        return Promise.all([[], checkIfExist(article_id)]);
      } else {
        return { comments: comments };
      }
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  return connection
    .insert({ body: body, author: username, article_id: article_id })
    .into("comments")
    .returning("*")
    .then(comment => {
      
      return { comment: comment[0] };
    });
};

exports.fetchAllArticles = (sort_by, order, author, topic) => {
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
    .count({ comment_count: "comments.comment_id" })
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
      if (articles.length === 0) {
        return Promise.all([
          [],
          checkIfTopicExist(topic),
          checkIfAuthorExist(author)
        ]);
      } else {
        return [articles];
      }
    });
};

function checkIfExist(article_id) {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(articles => {
      if (articles.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Error status 404"
        });
      }
    });
}

function checkIfTopicExist(topic) {
  if (!topic) {
    return true;
  }
  return connection
    .select("*")
    .from("topics")
    .where("slug", topic)
    .then(topic => {
      if (topic.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Not found topic doesn't exist"
        });
      }
    });
}

function checkIfAuthorExist(author) {
  if (!author) {
    return true;
  }
  return connection
    .select("*")
    .from("users")
    .where("username", author)
    .then(user => {
      if (user.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Not found author doesn't exist"
        });
      }
    });
}
