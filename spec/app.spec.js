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
    it('PATCH : 200 and responds with article with an updated votes ', () => {return request(app).patch("/api/articles/1").send({inc_votes: 10}).expect(200).then((body) => {console.log(body)})
      
    });
  });
});
