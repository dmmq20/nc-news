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
