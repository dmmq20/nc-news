const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

const allEndpoints = Object.keys(endpointsJson);

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET 200: should respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("GET 404: should respond with approriate status and message when sending request to endpoint that doesn't exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid url");
      });
  });
});

describe("/api", () => {
  test("GET 200: should respond with an object describing all available api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        allEndpoints.forEach((endpoint) => {
          expect(endpoints).toHaveProperty(endpoint);
        });
      });
  });
  test("GET 404: should respond with approriate status and message when sending request to endpoint that doesn't exist", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid url");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: should return article when requesting valid id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET 404: should response with appropriate status and msg when accessing non-existent id", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("GET 400: should response with appropriate status and msg when accessing invalid id", () => {
    return request(app)
      .get("/api/articles/invalidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 200: should have comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count");
        expect(article.comment_count).toBe(11);
      });
  });
  test("GET 200: should have 0 comment_count for articles with no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(0);
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: should respond with an array of articles sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 200: should respond with an array of articles sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: should respond with array of articles filtered by topic if provided", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 404: should respond with appropriate status and msg if query is invalid", () => {
    return request(app)
      .get("/api/articles?topic=notAValidTopic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
  test("GET 200: should respond with empty array if topic is valid but no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("GET 200: should respond with array of articles sorted by provided query in descending order by default", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET 200: should respond with array of articles ordered by provided query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET 200: should respond with array of articles sorted by provided query and ascending order when query provided", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });
  test("GET 400: should respond with appropriate status and msg when providing invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=notValid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 400: should respond with appropriate status and msg when providing invalid order", () => {
    return request(app)
      .get("/api/articles?order=notValid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: should respond with comments associated with the article_id sorted by date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 0).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: comments should be sorted by date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length > 0).toBe(true);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: should respond with appropriate status and msg if requesting non-existent id", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
  test("GET 400: should respond with appropriate status and msg if requesting invalid id", () => {
    return request(app)
      .get("/api/articles/notAValidID/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("GET 200: should respond with correct status and empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("POST 201: should respond with inserted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker", body: "test comments" })
      .set("Accept", "application/json")
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          article_id: 1,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          author: "lurker",
          body: "test comments",
          votes: expect.any(Number),
        });
      });
  });
  test("POST 404: should respond with appropriate status and msg when requesting non-existent id", () => {
    // NOTE: this sometimes fails for reasons unknown
    // possibly a problem with psql
    // just run the tests again
    return request(app)
      .post("/api/articles/99999/comments")
      .send({ username: "lurker", body: "test comments" })
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
  test("POST 400: should respond with appropriate status and msg when requesting invalid id", () => {
    return request(app)
      .post("/api/articles/invalidId/comments")
      .send({ username: "lurker", body: "test comments" })
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("POST 404: should respond with appropriate status and msg when request is sent with incorrect user", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "userNotInDb", body: "test comments" })
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("POST 400: should respond with appropriate status and msg when request is sent without body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker" })
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("PATCH 200: should respond with appropriate status code when patch is successful and return updated article", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .set("Accept", "application/json")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(article.votes).toBe(110);
      });
  });
  test("PATCH 404: should respond with appropriate status and msg when trying to update non-existent article", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/99999")
      .send(newVote)
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
  test("PATCH 400: should respond with appropriate status and msg when trying to update invalid article id", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/notAValidId")
      .send(newVote)
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("PATCH 400: should respond with appropriate status and msg when trying to update article with invalid inc_vote", () => {
    const newVote = { inc_votes: "invalid votes" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("PATCH 400: should respond with appropriate status and msg when trying to update article with empty object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("PATCH 400: should respond with appropriate status and msg when trying to update article with incorrect keys", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ wrong: "i am a wrong key" })
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("/api/comments", () => {
  test("DELETE 204: should respond with appropriate status on successful delete", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE 400: should respond with appropriate status and msg when trying to delete comment with invalid id", () => {
    return request(app)
      .delete("/api/comments/notAValidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("DELETE 404: should respond with appropriate status and msg when trying to delete comment with non-existent id", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: should respond with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
