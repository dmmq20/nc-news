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
      .then((response) => {
        expect(response.body.msg).toBe("Invalid url");
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
      .then((response) => {
        expect(response.body.msg).toBe("Invalid url");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: should return article when requesting valid id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(1);
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET 404: should response with appropriate status and msg when accessing non-existent id", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Article not found");
      });
  });
  test("GET 400: should response with appropriate status and msg when accessing invalid id", () => {
    return request(app)
      .get("/api/articles/invalidId")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: should respond with an array of articles sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
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
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
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
        expect(msg).toBe("Not found");
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
        expect(comment.body).toBe("test comments");
        expect(comment.author).toBe("lurker");
        expect(comment.article_id).toBe(1);
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
      });
  });
  test("POST 404: should respond with appropriate status and msg when requesting non-existent id", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({ username: "lurker", body: "test comments" })
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
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
});
