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
    it("GET 404 incorrect route", () => {
      return request(app)
        .get("/api/toics")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(`invalid route`);
        });
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
          expect(body.user).to.be.an("object");
          expect(body.user).to.deep.equal({
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
          expect(response.body).to.be.an("object");
          expect(response.body).to.eql({
            article:
            {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: "13"
          }});
          expect(response.body.article).to.have.keys([
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
            'select "articles".*, count("comments"."comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "dog"'
          );
        });
    });
    it("PATCH : 200 and responds with article with an updated votes ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body).to.eql({
            article:{
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 110,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          }});
        });
    });
    it("PATCH : 200 and responds with article with an updated votes ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(response => {
          expect(response.body).to.eql({
            article:{
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 90,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          }});
        });
    });
    it("PATCH : 200 and responds with article with an updated votes ", () => {
      return request(app)
        .patch("/api/articles/1")

        .expect(200)
        .then(response => {
          expect(response.body).to.eql({article:{
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          }});
        });
    });
    it("PATCH:400 if passed invalid data type for inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "hello_world" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'update "articles" set "votes" = "votes" + $1 where "articles"."article_id" = $2 returning * - invalid input syntax for integer: "NaN"'
          );
        });
    });
    it("PATCH 404 if passed and article_id that does not exist", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: "10" })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal(`Error status 404`);
        });
    });
    it("405 error for invalid method", () => {
      const invalidMethods = ["post", "put", "delete"];
      const methodsPromises = invalidMethods.map(methods => {
        return request(app)
          [methods]("/api/articles/1")
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("invalid method");
          });
      });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET 200 returns an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(response => {
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
            "comment_id",
            "author",
            
            "votes",
            "created_at",
            "body"
          );
          expect(response.body.comments).to.be.an("array");
        });
    });
    it("GET 200 returns an array of comments sorted by created_at as default and in descending order by default", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.eql({
            comment_id: 14,
            author: "icellusedkars",
            
            votes: 16,
            created_at: "2004-11-25T12:36:03.389Z",
            body:
              "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge."
          });
        });
    });
    it("GET 200 returns an array of comments sorted by votes and ordered ascending", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.eql({
            comment_id: 15,
            author: "butter_bridge",
            
            votes: 1,
            created_at: "2003-11-26T12:36:03.389Z",
            body: "I am 100% sure that we're not completely sure."
          });
        });
    });
    it("GET 404 returned when provided a non existent author", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(
            'Error status 404'
          );
        });
    });
    it("GET 400 returnns error when passed sort_by and order which do not exist", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by=hello&order=afsa")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(
            'select "comments"."comment_id", "comments"."votes", "comments"."created_at", "comments"."author", "comments"."body" from "comments" where "comments"."article_id" = $1 order by "hello" asc - column "hello" does not exist'
          );
        });
    });
    it("status:201 responds with object of posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments?sort_by=votes")
        .send({ username: "icellusedkars", body: "Yo" })
        .expect(201)
        .then(response => {
          expect(response.body.comment[0]).to.be.an("object");
          expect(response.body.comment[0].author).to.equal("icellusedkars");
          expect(response.body.comment[0].body).to.equal("Yo");
        });
    });
    it("POST 404 returned when trying to post to article_id that does not exist", () => {
      return request(app)
        .post("/api/articles/100000/comments")
        .send({ username: "icellusedkars", body: "Yo" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql('insert into "comments" ("article_id", "author", "body") values ($1, $2, $3) returning * - insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"')
        });
    });
    it("405 error for invalid method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodsPromises = invalidMethods.map(methods => {
        return request(app)
          [methods]("/api/articles/1/comments")
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("invalid method");
          });
      });
    });
  });
  describe("/comments/:comment_id", () => {
    it("PATCH 200 and responds with comment with updated votes", () => {
      return request(app)
        .patch("/api/comments/10")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.eql({
            comment_id: 10,
            author: "icellusedkars",
            article_id: 1,
            votes: 10,
            created_at: "2008-11-24T12:36:03.389Z",
            body: "git push origin master"
          });
        });
    });
    it("PATCH 200 and responds with comment with updated votes", () => {
      return request(app)
        .patch("/api/comments/10")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.eql({
            comment_id: 10,
            author: "icellusedkars",
            article_id: 1,
            votes: -5,
            created_at: "2008-11-24T12:36:03.389Z",
            body: "git push origin master"
          });
        });
    });
    it("PATCH 400 and responds with comment with updated votes", () => {
      return request(app)
        .patch("/api/comments/10")
        .send({ inc_votes: "hello_world" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(
            'update "comments" set "votes" = "votes" + $1 where "comments"."comment_id" = $2 returning * - invalid input syntax for integer: "NaN"'
          );
        });
    });
    it("PATCH 200 and responds with comment with updated votes when not sent a body", () => {
      return request(app)
        .patch("/api/comments/10")

        .expect(200)
        .then(response => {
          expect(response.body.comment).to.eql({
            comment_id: 10,
            author: "icellusedkars",
            article_id: 1,
            votes: 0,
            created_at: "2008-11-24T12:36:03.389Z",
            body: "git push origin master"
          });
        });
    });
    it("PATCH 404 when comment_id cant b found", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(`Error status 404`);
        });
    });

    it("DELETE 204 deletes by comment_id and returns no content ", () => {
      return request(app)
        .delete("/api/comments/10")
        .expect(204);
    });
    it("DELETE 404 when comment_id cant be found ", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(`Error status 404`);
        });
    });
    it("DELETE 400 when passed an invalid comment_id ", () => {
      return request(app)
        .delete("/api/comments/helo")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(
            'delete from "comments" where "comment_id" = $1 - invalid input syntax for integer: "helo"'
          );
        });
    });
  });

  describe("/articles", () => {
    it("GET 200 returns an articles array of artcile objects ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(response.body.articles).to.have.length(12);
        });
    });
      it("GET 200 returns an articles array of artcile objects ", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql(
              {
                article_id:1,
                title:'Living in the shadow of a great man',
                created_at:'2018-11-15T12:21:54.171Z',
                votes:100,
                topic:"mitch",
                author:"butter_bridge",
                comment_count:"13"

              }
            );
            
          });
      });
      it("GET 200 returns an articles array of artcile objects ", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 12,
              title: "Moustache",
              created_at: "1974-11-26T12:21:54.171Z",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              comment_count: "0"
            });
          });
      });
      it("GET 200 returns an articles array of artcile objects ", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              comment_count: "13"
            });
          });
      });
       it("GET 200 returns an articles array of artcile objects ", () => {
         return request(app)
           .get("/api/articles?sort_by=article_id&order=asc&author=butter_bridge")
           .expect(200)
           .then(response => {
             expect(response.body.articles[0]).to.eql({
               article_id: 1,
               title: "Living in the shadow of a great man",
               created_at: "2018-11-15T12:21:54.171Z",
               votes: 100,
               topic: "mitch",
               author: "butter_bridge",
               comment_count: "13"
             });
           });
       });
        it("GET 200 returns an articles array of artcile objects ", () => {
          return request(app)
            .get(
              "/api/articles?sort_by=article_id&order=asc&author=butter_bridge&topic=mitch"
            )
            .expect(200)
            .then(response => {
              expect(response.body.articles[0]).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                comment_count: "13"
              });
            });
        });
        it("GET 400 when sort-by, order,author or topic is does not exist ", () => {
          return request(app)
            .get(
              "/api/articles?sort_by=arti1cle_id&order=asc&author=butter_bridge&topic=mitch"
            )
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.eql(
                'select "articles"."article_id", "articles"."author", "articles"."created_at", "articles"."title", "articles"."topic", "articles"."votes", count("comments"."comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."author" = $1 and "articles"."topic" = $2 group by "articles"."article_id" order by "arti1cle_id" asc - column "arti1cle_id" does not exist'
              );
            });
        });
    it("GET 400 when sort-by, order,author or topic is does not exist ", () => {
      return request(app)
        .get(
          "/api/articles?sort_by=article_id&order=asc&author=butter_bridge&topic=not-a-topic"
        )
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql("Not found topic doesn't exist"
            
          );
        });
    });
    it("GET 400 when sort-by, order,author or topic is does not exist ", () => {
      return request(app)
        .get(
          "/api/articles?sort_by=article_id&order=asc&author=butter_bridg"
        )
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql("Not found author doesn't exist"

          );
        });
    });
        it("GET 404 incorrect route", () => {
          return request(app)
            .get("/api/article")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal(`invalid route`);
            });
        });
        it("405 error for invalid method", () => {
          const invalidMethods = ["patch", "post", "put", "delete"];
          const methodsPromises = invalidMethods.map(methods => {
            return request(app)
              [methods]("/api/articles")
              .expect(405)
              .then(response => {
                expect(response.body.msg).to.equal("invalid method");
              });
          });
          return Promise.all(methodsPromises);
        });

  });
});
