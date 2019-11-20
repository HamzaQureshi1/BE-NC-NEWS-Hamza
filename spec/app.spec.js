process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const chai = require("chai");
const chaisorted = require("chai-sorted");
const connection = require("../db/connection");
chai.use(chaisorted);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET:200 ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.have.length(3);
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
    it("405 error for invalid method", () => {
      const invalidMethods = ["patch", "post", "put", "delete"];
      const methodsPromises = invalidMethods.map(methods => {
        return request(app)
          [methods]("/api/topics")
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("invalid method");
          });
      });
      return Promise.all(methodsPromises);
    });
  });
  describe("/users/:username", () => {
    it("GET :404 username does not exist", () => {
      return request(app)
        .get("/api/users/skljdfsahhhhj")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Error status 404");
        });
    });
    it("GET: 200 returns user by username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
          expect(body).to.deep.equal({
            username: "butter_bridge",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "jonny"
          });
        });
    });
    it("GET :404 username does not exist", () => {
      return request(app)
        .get("/api/users/skljdfsahhhhj")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Error status 404");
        });
    });
    it("405 error for invalid method", () => {
      const invalidMethods = ["patch", "post", "put", "delete"];
      const methodsPromises = invalidMethods.map(methods => {
        return request(app)
          [methods]("/api/users/butter_bridge")
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("invalid method");
          });
      });
    });
  });
  describe("/articles/:articles_id", () => {
    it("GET 200 returns article by article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("array");
          expect(response.body.article[0]).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: "13"
          });
          expect(response.body.article[0]).to.have.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          ]);
        });
    });
    it("GET 404 article_id does not exist", () => {
      return request(app)
        .get("/api/articles/37")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Error status 404");
        });
    });
    it("GET 400 article_id is bad", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'select "articles".*, count("comments"."comments_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "dog"'
          );
        });
    });
    it("PATCH : 200 and responds with article with an updated votes ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body.article.articles).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 110,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            
          });
        });
    });
    it("PATCH : 200 and responds with article with an updated votes ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(response => {
          expect(response.body.article.articles).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 90,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          });
        });
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('GET 200 returns an array of comments for the given article_id', () => {
      return request(app).get('/api/articles/5/comments').expect(200).then(response => {
      //   expect(response.body.comments).to.eql([{
      //     comments_id:14,
      //     author:"icellusedkars",
      //     article_id:5,
      //     votes:16,
      //     created_at: 2004-11-25 12:36:03.389+00,
      //     body: "What do you see? I have no idea where this will lead us.  This place I speak of, is known as the Black Lodge"
      //   },
      // {comments_id:15,
      //     author:"butter_bridge",
      //     article_id:5,
      //     votes:1,
      //     created_at: 2003-11-26 12:36:03.389+00,
      //     body: "I am 100% sure that we're not completely sure."

      // }])
      expect(response.body.comments[0]).to.have.keys(
        "comments_id",
        "author",
        "article_id",
        "votes",
        "created_at",
        "body"
      );
      })
      
    });
    
  });
});
