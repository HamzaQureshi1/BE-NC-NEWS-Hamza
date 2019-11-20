DROP DATABASE IF EXISTS nc_test;
CREATE DATABASE nc_test;

CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR,body VARCHAR ,votes VARCHAR ,topic VARCHAR ,author vARCHAR ,created_at VARCHAR) ;


INSERT INTO articles (article_id, title, body, votes, topic, author, created_at) VALUES (1, 'a','a','a','a','a','a');

CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR,article_id INT , votes VARCHAR, created_at VARCHAR, body VARCHAR,
FOREIGN KEY  (article_id) REFERENCES articles(article_id));

INSERT INTO comments (comment_id, author, article_id, votes, created_at, body) VALUES (1, 'b', 1,'b','b','b');
SELECT * FROM articles;
SELECT * FROM comments;